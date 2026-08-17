import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import TrialStats from '../components/admin/trials/TrialStats'
import TrialSearch from '../components/admin/trials/TrialSearch'
import TrialTable from '../components/admin/trials/TrialTable'
import TrialDetailsModal from '../components/admin/trials/TrialDetailsModal'
import TrialRefuseModal from '../components/admin/trials/TrialRefuseModal'
import TrialExport from '../components/admin/trials/TrialExport'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import { api } from '../utils/api'
import { useCategories } from '../hooks/useCategories'
import { TRIAL_STORAGE_KEY } from '../hooks/useTrialForm'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminTrials — Gestion des demandes d'essai (/admin/trials)
   ------------------------------------------------------------
   Module 3 — branchement backend :
   - Liste : GET /admin/trials?limit=100 (Bearer) → normalisée
     via normalizeTrial (catégorie déduite de l'âge).
   - Actions : PUT /admin/trials/:id/validate, /refuse (motif),
     DELETE /admin/trials/:id → la ligne est mise à jour avec la
     réponse du serveur ; un 409 (déjà traitée) resynchronise.
   - Actions groupées : PUT validate/refuse en parallèle.
   - Migration optionnelle : les anciennes demandes du localStorage
     (formulaire public avant module 3) sont rejouées une seule fois
     vers POST /api/trials, puis la clé est nettoyée.
   - Statistiques (@EF20), recherche + filtres (statut, catégorie,
     date), pagination client, export CSV : inchangés.
   ============================================================ */

const PAGE_SIZE = 10
const TRIAL_MIGRATED_KEY = 'bfa_trial_migrated'

const STATUT_LABEL = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  REFUSE: 'Refusé',
}

const readStoredTrials = () => {
  try {
    return JSON.parse(localStorage.getItem(TRIAL_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

/* Promesse partagée de la migration : même sous React StrictMode
   (double montage en dev), la migration n'est rejouée qu'une fois.
   Le flag localStorage couvre, lui, les rechargements ultérieurs. */
let migrationInFlight = null

/* Normalise une demande du backend vers la forme consommée par le
   back-office (TrialStats / TrialTable / modals). La catégorie est
   déduite de l'âge (elle n'est pas renvoyée par l'API). */
const normalizeTrial = (d, categories) => ({
  id: d.id,
  nom: d.nomJoueur,
  prenom: d.prenomJoueur,
  age: d.age,
  categorie:
    categories.find((c) => d.age >= c.ageMin && d.age <= c.ageMax)?.nom ?? '',
  poste: '',
  telephone: d.telephone,
  email: d.email,
  dateEssai: d.dateEssai,
  dateSoumission: d.dateSoumission,
  message: d.message,
  statut: STATUT_LABEL[d.statut] ?? d.statut,
  motifRefus: d.motifRefus,
  traitePar: d.traitePar,
})

export default function AdminTrials() {
  /* Données du backend (plus de localStorage comme source de vérité). */
  const { categories } = useCategories()
  const [trials, setTrials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tous')
  const [category, setCategory] = useState('Tous')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [toDelete, setToDelete] = useState(null)
  const [selectedTrial, setSelectedTrial] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [trialToRefuse, setTrialToRefuse] = useState(null)
  const [refuseOpen, setRefuseOpen] = useState(false)

  /* Compteur de requêtes : ignore une réponse périmée si la liste est
     rechargée (ex. catégories qui arrivent après le 1er fetch). */
  const loadSeq = useRef(0)

  /* Retour à la 1re page dès qu'un filtre change. */
  useEffect(() => {
    setPage(1)
  }, [query, status, category, dateFilter])

  /* Désélectionne les candidats masqués par un filtre. */
  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => filtered.some((t) => t.id === id)),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, category, dateFilter])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trials.filter((t) => {
      const matchesQuery =
        !q ||
        (t.nom ?? '').toLowerCase().includes(q) ||
        (t.prenom ?? '').toLowerCase().includes(q) ||
        (t.email ?? '').toLowerCase().includes(q) ||
        (t.telephone ?? '').toLowerCase().includes(q)
      const matchesStatus = status === 'Tous' || t.statut === status
      const matchesCategory =
        category === 'Tous' || t.categorie === category
      const matchesDate =
        !dateFilter ||
        (t.dateEssai ?? '').startsWith(dateFilter) ||
        (t.dateSoumission ?? '').startsWith(dateFilter)
      return matchesQuery && matchesStatus && matchesCategory && matchesDate
    })
  }, [trials, query, status, category, dateFilter])

  const counts = useMemo(() => {
    const c = { 'En attente': 0, Confirmé: 0, Refusé: 0 }
    trials.forEach((t) => {
      if (c[t.statut] !== undefined) c[t.statut] += 1
    })
    return c
  }, [trials])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  /* -------- Chargement + migration optionnelle -------- */

  /* Migration one-shot : les anciennes demandes du localStorage
     (formulaire public d'avant le module 3) sont rejouées vers le
     backend, puis la clé est nettoyée. Non bloquant en cas d'échec. */
  const migrateLegacyTrials = useCallback(() => {
    if (migrationInFlight) return migrationInFlight
    migrationInFlight = (async () => {
      try {
        if (localStorage.getItem(TRIAL_MIGRATED_KEY)) return
        const stored = readStoredTrials()
        if (!Array.isArray(stored) || stored.length === 0) return
        await Promise.all(
          stored.map((r) =>
            api('/api/trials', {
              method: 'POST',
              body: {
                nomJoueur: String(r.nom ?? '').trim(),
                prenomJoueur: String(r.prenom ?? '').trim(),
                age: Number(r.age),
                telephone: String(r.telephone ?? '').trim(),
                email: String(r.email ?? '').trim(),
                dateEssai: r.dateEssai ?? '',
                message: String(r.message ?? '').trim() || null,
              },
            }).catch(() => null),
          ),
        )
        localStorage.setItem(TRIAL_MIGRATED_KEY, '1')
        localStorage.removeItem(TRIAL_STORAGE_KEY)
      } catch {
        /* Non bloquant : on garde l'état existant. */
      }
    })()
    return migrationInFlight
  }, [])

  const loadTrials = useCallback(async () => {
    const requestId = ++loadSeq.current
    setLoading(true)
    setError(null)
    try {
      const res = await api('/admin/trials?limit=100', { auth: true })
      if (requestId !== loadSeq.current) return // réponse périmée
      const items = res?.data?.items ?? []
      setTrials(items.map((d) => normalizeTrial(d, categories)))
    } catch (err) {
      if (requestId !== loadSeq.current) return
      setError(err?.message || 'Impossible de charger les demandes.')
    } finally {
      if (requestId === loadSeq.current) setLoading(false)
    }
  }, [categories])

  /* Premier chargement : migration puis liste. Rechargé quand les
     catégories arrivent (la catégorie déduite a besoin de leurs bornes). */
  useEffect(() => {
    migrateLegacyTrials().then(() => loadTrials())
  }, [migrateLegacyTrials, loadTrials])

  /* -------- Actions (toutes via l'API) -------- */

  const handleConfirm = async (row) => {
    setServerError(null)
    try {
      const res = await api(`/admin/trials/${row.id}/validate`, {
        method: 'PUT',
        auth: true,
      })
      setTrials((prev) =>
        prev.map((t) => (t.id === row.id ? normalizeTrial(res.data, categories) : t)),
      )
    } catch (err) {
      // 409 : déjà traitée → on affiche le message et on resynchronise.
      setServerError(err?.message || 'Impossible de valider la demande.')
      loadTrials()
    }
  }

  const handleRefuse = async (row, reason) => {
    setServerError(null)
    try {
      const res = await api(`/admin/trials/${row.id}/refuse`, {
        method: 'PUT',
        body: { motifRefus: reason },
        auth: true,
      })
      setTrials((prev) =>
        prev.map((t) => (t.id === row.id ? normalizeTrial(res.data, categories) : t)),
      )
    } catch (err) {
      setServerError(err?.message || 'Impossible de refuser la demande.')
      loadTrials()
    }
  }

  const handleBulkConfirm = async () => {
    const ids = selectedIds
    setSelectedIds([])
    setServerError(null)
    try {
      await Promise.all(
        ids.map((id) =>
          api(`/admin/trials/${id}/validate`, { method: 'PUT', auth: true }),
        ),
      )
    } catch (err) {
      setServerError(err?.message || 'Impossible de valider la sélection.')
    } finally {
      await loadTrials()
    }
  }

  const handleBulkRefuse = async () => {
    const ids = selectedIds
    setSelectedIds([])
    setServerError(null)
    try {
      await Promise.all(
        ids.map((id) =>
          api(`/admin/trials/${id}/refuse`, {
            method: 'PUT',
            body: { motifRefus: 'Refus collectif (action groupée)' },
            auth: true,
          }),
        ),
      )
    } catch (err) {
      setServerError(err?.message || 'Impossible de refuser la sélection.')
    } finally {
      await loadTrials()
    }
  }

  /* ⚠️ React Compiler : `toDelete?.id` lu au 1er niveau du handler
     (avec garde null) — jamais via une lecture directe d'objet nullable. */
  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    api(`/admin/trials/${id}`, { method: 'DELETE', auth: true })
      .then(() => {
        setTrials((prev) => prev.filter((t) => t.id !== id))
        setSelectedIds((prev) => prev.filter((x) => x !== id))
      })
      .catch((err) =>
        setServerError(err?.message || 'Impossible de supprimer la demande.'),
      )
  }

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const openDetails = (row) => {
    setSelectedTrial(row)
    setDetailsOpen(true)
  }
  const closeDetails = () => setDetailsOpen(false)

  const openRefuse = (row) => {
    setTrialToRefuse(row)
    setRefuseOpen(true)
  }
  const closeRefuse = () => setRefuseOpen(false)

  const selectedOnPage = pageItems.filter((t) => selectedIds.includes(t.id))

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Demandes d'essai"
        subtitle="Consultez, validez ou refusez les candidatures des futurs académiciens."
        action={<TrialExport trials={filtered} />}
      />

      <TrialStats trials={trials} />

      {/* Erreur d'une action (validate/refuse/delete) — bandeau au-dessus de la table. */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
        >
          <span>{serverError}</span>
          <button
            type="button"
            onClick={() => setServerError(null)}
            aria-label="Fermer l'erreur"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-erreur/70 transition hover:bg-erreur/10"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-sombre/60">
          Chargement des demandes…
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
        >
          {error}
        </div>
      ) : (
        <>
          <TrialSearch
            query={query}
            onQueryChange={setQuery}
            status={status}
            onStatusChange={setStatus}
            category={category}
            onCategoryChange={setCategory}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            resultCount={filtered.length}
            totalCount={trials.length}
          />

          {/* Barre d'actions groupées */}
          {selectedOnPage.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-dore/40 bg-dore/10 px-4 py-3"
            >
              <p className="text-sm font-bold text-dore-dark">
                {selectedOnPage.length} sélectionné(s)
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleBulkConfirm}
                >
                  <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
                  Valider
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleBulkRefuse}
                >
                  <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" />
                  Refuser
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                >
                  Tout désélectionner
                </Button>
              </div>
            </motion.div>
          )}

          <TrialTable
            trials={pageItems}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onConfirm={handleConfirm}
            onRefuse={openRefuse}
            onDetails={openDetails}
            onDelete={setToDelete}
          />

          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <TrialDetailsModal
        open={detailsOpen}
        onClose={closeDetails}
        trial={selectedTrial}
      />
      <TrialRefuseModal
        open={refuseOpen}
        onClose={closeRefuse}
        trial={trialToRefuse}
        onConfirm={handleRefuse}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la demande"
        message={`Voulez-vous vraiment supprimer la candidature de ${toDelete?.prenom ?? ''} ${toDelete?.nom ?? ''} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
