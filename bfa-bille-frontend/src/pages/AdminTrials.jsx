import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
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
import { trialRequests } from '../data/mockData'
import { TRIAL_STORAGE_KEY } from '../hooks/useTrialForm'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminTrials — Gestion des demandes d'essai (/admin/trials)
   ------------------------------------------------------------
   - Fusionne les candidatures mock (trialRequests) + celles
     inscrites via le formulaire public (localStorage)
   - Statistiques (@EF20), recherche + filtres (statut, catégorie,
     date), pagination
   - Valider (@EF18), Refuser avec motif obligatoire (@EF19),
     Voir détails (@EF15), suppression confirmée
   - Actions groupées (Valider / Refuser la sélection)
   - Export CSV
   ============================================================ */

const PAGE_SIZE = 10

const readStoredTrials = () => {
  try {
    return JSON.parse(localStorage.getItem(TRIAL_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export default function AdminTrials() {
  const [trials, setTrials] = useState(() => [
    ...trialRequests,
    ...readStoredTrials(),
  ])
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

  const setStatusOf = (ids, newStatus, extra = {}) => {
    setTrials((prev) =>
      prev.map((t) =>
        ids.includes(t.id) ? { ...t, statut: newStatus, ...extra } : t,
      ),
    )
  }

  const handleConfirm = (row) => setStatusOf([row.id], 'Confirmé')
  const handleRefuse = (row, reason) =>
    setStatusOf([row.id], 'Refusé', { motifRefus: reason })

  const handleBulkConfirm = () => {
    setStatusOf(selectedIds, 'Confirmé')
    setSelectedIds([])
  }
  const handleBulkRefuse = () => {
    setStatusOf(selectedIds, 'Refusé', {
      motifRefus: 'Refus collectif (action groupée)',
    })
    setSelectedIds([])
  }

  /* ⚠️ React Compiler : `toDelete.id` lu uniquement dans les
     callbacks setState (jamais au 1er niveau du handler). */
  const handleDelete = () => {
    setTrials((prev) => prev.filter((t) => t.id !== toDelete.id))
    setSelectedIds((prev) => prev.filter((id) => id !== toDelete.id))
    setToDelete(null)
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
