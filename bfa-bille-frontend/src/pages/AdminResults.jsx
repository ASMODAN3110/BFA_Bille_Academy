import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import ResultsTable from '../components/admin/ResultsTable'
import ResultForm from '../components/admin/ResultForm'
import RankingPanel from '../components/admin/RankingPanel'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Button from '../components/ui/Button'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api } from '../utils/api'
import { normalizeResult, toResultPayload } from '../utils/resultsAdapter'
import { useCategories } from '../hooks/useCategories'

/* ============================================================
   AdminResults — Résultats & classements (/admin/results)
   ------------------------------------------------------------
   - CRUD complet des rencontres (championnat / amical) branché
     sur GET/POST/PUT/DELETE /admin/results (auth)
   - Pastilles de catégorie : filtre backend (?categorieId=) des
     derniers matchs + classement de la catégorie (/api/rankings)
   - Filtre par type de rencontre
   ============================================================ */

const TYPE_OPTIONS = [
  { value: 'Tous', label: 'Tous les types' },
  { value: 'Championnat', label: 'Championnat' },
  { value: 'Amical', label: 'Amical' },
]

const selectClasses =
  'rounded-lg border border-[#e3ede6] bg-white px-3 py-2 text-sm text-sombre outline-none transition focus:border-vert focus:ring-2 focus:ring-vert/20'

export default function AdminResults() {
  const { categories } = useCategories()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [type, setType] = useState('Tous')
  const [categorieId, setCategorieId] = useState(null)
  const [rankingKey, setRankingKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const loadResults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = categorieId ? `&categorieId=${categorieId}` : ''
      const data = await api(`/admin/results?limit=100${query}`, { auth: true })
      setResults((data?.data?.items ?? []).map(normalizeResult))
    } catch (err) {
      setError(err?.message || 'Impossible de charger les résultats.')
    } finally {
      setLoading(false)
    }
  }, [categorieId])

  // Par défaut : première catégorie (comme sur la maquette).
  useEffect(() => {
    if (categorieId === null && categories.length > 0) setCategorieId(categories[0].id)
  }, [categories, categorieId])

  useEffect(() => {
    if (categorieId !== null) loadResults()
  }, [loadResults, categorieId])

  const selectedCategory = categories.find((c) => c.id === categorieId)

  const filtered = useMemo(() => {
    return results
      .filter((r) => type === 'Tous' || r.type === type)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [results, type])

  const openAdd = () => {
    setEditing(null)
    setServerError(null)
    setFormOpen(true)
  }

  const openEdit = (result) => {
    setEditing(result)
    setServerError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setServerError(null)
  }

  const handleSave = async (data) => {
    setServerError(null)
    try {
      if (editing) {
        await api(`/admin/results/${editing.id}`, {
          method: 'PUT',
          body: toResultPayload(data),
          auth: true,
        })
      } else {
        await api('/admin/results', {
          method: 'POST',
          body: toResultPayload(data),
          auth: true,
        })
      }
      setFormOpen(false)
      setEditing(null)
      setRankingKey((k) => k + 1)
      loadResults()
    } catch (err) {
      setServerError(err?.message || "Une erreur est survenue à l'enregistrement.")
    }
  }

  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    api(`/admin/results/${id}`, { method: 'DELETE', auth: true })
      .then(() => {
        setRankingKey((k) => k + 1)
        return loadResults()
      })
      .catch((err) => setError(err?.message || 'Impossible de supprimer le résultat.'))
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Résultats & classements"
        subtitle="Saisissez un score : le classement se met à jour automatiquement."
        action={
          <Button type="button" onClick={openAdd} className="shrink-0">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Saisir un résultat
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Catégorie">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategorieId(c.id)}
            aria-pressed={c.id === categorieId}
            className={`inline-flex h-10 items-center rounded-[10px] border px-3.5 text-[13px] transition ${
              c.id === categorieId
                ? 'border-vert bg-menthe font-semibold text-vert-dark'
                : 'border-[#e3ede6] bg-white font-medium text-[#3b4d42] hover:border-vert/50'
            }`}
          >
            {c.nom}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <section className="min-w-0 flex-[999_1_32rem] overflow-hidden rounded-2xl border border-[#e3ede6] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 px-[18px] py-3">
            <h2 className="text-base font-bold">Derniers matchs</h2>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={selectClasses}
              aria-label="Filtrer par type"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p className="px-4 pb-5 text-center text-sm text-sombre/75">
              Chargement des résultats…
            </p>
          ) : error ? (
            <div
              role="alert"
              className="mx-4 mb-4 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
            >
              {error}
            </div>
          ) : (
            <ResultsTable results={filtered} onEdit={openEdit} onDelete={setToDelete} />
          )}
        </section>
        {selectedCategory && (
          <RankingPanel categorie={selectedCategory} refreshKey={rankingKey} />
        )}
      </div>

      <ResultForm
        open={formOpen}
        onClose={closeForm}
        onSave={handleSave}
        result={editing}
        categories={categories}
        serverError={serverError}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le résultat"
        message={`Voulez-vous vraiment supprimer le match ${toDelete?.equipeA ?? ''} – ${toDelete?.equipeB ?? ''} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
