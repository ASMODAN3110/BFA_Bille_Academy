import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faTrophy,
  faFutbol,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import ResultsTable from '../components/admin/ResultsTable'
import ResultForm from '../components/admin/ResultForm'
import StatCard from '../components/admin/StatCard'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  fadeUp,
  staggerContainer,
} from '../hooks/useScrollAnimation'
import { api } from '../utils/api'
import { normalizeResult, toResultPayload } from '../utils/resultsAdapter'
import { useCategories } from '../hooks/useCategories'

/* ============================================================
   AdminResults — Gestion des résultats (/admin/results)
   ------------------------------------------------------------
   - CRUD complet des rencontres (championnat / amical) branché
     sur GET/POST/PUT/DELETE /admin/results (auth)
   - Bilan BFA : victoires, nuls, défaites
   - Filtre par type de rencontre
   ============================================================ */

const TYPE_OPTIONS = [
  { value: 'Tous', label: 'Tous' },
  { value: 'Championnat', label: 'Championnat' },
  { value: 'Amical', label: 'Amical' },
]

const selectClasses =
  'w-full rounded-lg border border-clair bg-white px-3 py-2 text-sm text-sombre outline-none transition focus:border-vert focus:ring-2 focus:ring-vert/20'

// Le seed envoie « BFA U9 » / « BFA U15 » / « BFA U17 » (jamais « BFA »
// seul) : on teste donc .includes('BFA'), pas === 'BFA'.
const bfaResult = (r) => {
  if (r.equipeA.includes('BFA') && r.equipeB.includes('BFA')) return 'nul'
  const isHome = r.equipeA.includes('BFA')
  const our = isHome ? r.scoreA : r.scoreB
  const theirs = isHome ? r.scoreB : r.scoreA
  if (our > theirs) return 'victoire'
  if (our < theirs) return 'defaite'
  return 'nul'
}

export default function AdminResults() {
  const { categories } = useCategories()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [type, setType] = useState('Tous')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const loadResults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/admin/results?limit=100', { auth: true })
      setResults((data?.data?.items ?? []).map(normalizeResult))
    } catch (err) {
      setError(err?.message || 'Impossible de charger les résultats.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadResults()
  }, [loadResults])

  const bilan = useMemo(() => {
    const b = { victoire: 0, nul: 0, defaite: 0 }
    results.forEach((r) => {
      b[bfaResult(r)] += 1
    })
    return b
  }, [results])

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
        const res = await api(`/admin/results/${editing.id}`, {
          method: 'PUT',
          body: toResultPayload(data),
          auth: true,
        })
        setResults((prev) =>
          prev.map((r) => (r.id === editing.id ? normalizeResult(res.data) : r)),
        )
      } else {
        const res = await api('/admin/results', {
          method: 'POST',
          body: toResultPayload(data),
          auth: true,
        })
        setResults((prev) => [normalizeResult(res.data), ...prev])
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      setServerError(err?.message || "Une erreur est survenue à l'enregistrement.")
    }
  }

  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    api(`/admin/results/${id}`, { method: 'DELETE', auth: true })
      .then(loadResults)
      .catch((err) => setError(err?.message || 'Impossible de supprimer le résultat.'))
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Résultats"
        subtitle="Historique des rencontres de l'académie : scores et bilans."
        action={
          <Button type="button" onClick={openAdd} className="shrink-0">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Ajouter un résultat
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Victoires"
          value={bilan.victoire}
          subtitle="Matchs gagnés par la BFA"
          icon={faTrophy}
          accent="bg-succes"
        />
        <StatCard
          label="Nuls"
          value={bilan.nul}
          subtitle="Matchs nuls"
          icon={faRankingStar}
          accent="bg-dore"
        />
        <StatCard
          label="Défaites"
          value={bilan.defaite}
          subtitle="Matchs perdus"
          icon={faFutbol}
          accent="bg-erreur"
        />
      </motion.div>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
        <p className="text-sm text-sombre/60">
          <span className="font-bold text-vert">{filtered.length}</span>{' '}
          rencontre(s) sur {results.length}
        </p>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClasses}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Card>

      {loading ? (
        <p className="text-center text-sm text-sombre/60">
          Chargement des résultats…
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
        >
          {error}
        </div>
      ) : (
        <ResultsTable
          results={filtered}
          onEdit={openEdit}
          onDelete={setToDelete}
        />
      )}

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
