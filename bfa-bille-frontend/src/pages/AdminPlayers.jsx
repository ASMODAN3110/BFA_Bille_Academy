import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import PlayerStats from '../components/admin/PlayerStats'
import PlayerSearch from '../components/admin/PlayerSearch'
import PlayerTable from '../components/admin/PlayerTable'
import PlayerForm from '../components/admin/PlayerForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api, clearSession, getToken } from '../utils/api'

/* ============================================================
   AdminPlayers — Gestion des joueurs (/admin/players)
   ------------------------------------------------------------
   - Données : GET /api/players?limit=100 (public, tri serveur) —
     le backend n'a pas de GET /admin/players.
   - CRUD : POST/PUT/DELETE /admin/players (protégés, auth: true).
   - Recherche + filtre catégorie + pagination locale (5/page).
   - `autoAdd` : ouvre le formulaire d'ajout au chargement
     (route /admin/players/add depuis les actions rapides).
   ============================================================ */

const PAGE_SIZE = 5

export default function AdminPlayers({ autoAdd = false }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [exportingId, setExportingId] = useState(null)

  /* Recharge l'effectif depuis le backend (liste re-triée par le serveur). */
  const loadPlayers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/api/players?limit=100', { auth: true })
      setPlayers(data?.data?.items ?? [])
    } catch (err) {
      setError(err?.message || 'Impossible de charger les joueurs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPlayers()
  }, [loadPlayers])

  /* Route /admin/players/add → ouvre le formulaire d'ajout. */
  useEffect(() => {
    if (autoAdd) {
      setEditing(null)
      setServerError(null)
      setFormOpen(true)
    }
  }, [autoAdd])

  /* Retour à la 1re page dès qu'un filtre change. */
  useEffect(() => {
    setPage(1)
  }, [query, category])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return players.filter((p) => {
      const matchesQuery =
        !q ||
        p.nom.toLowerCase().includes(q) ||
        (p.prenom ?? '').toLowerCase().includes(q) ||
        p.poste.toLowerCase().includes(q)
      const matchesCategory =
        category === 'Tous' || String(p.categorie?.id) === category
      return matchesQuery && matchesCategory
    })
  }, [players, query, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  const openAdd = () => {
    setEditing(null)
    setServerError(null)
    setFormOpen(true)
  }

  const openEdit = (player) => {
    setEditing(player)
    setServerError(null)
    setFormOpen(true)
  }

  /* Ajout (POST) / modification (PUT) — puis rechargement serveur. */
  const handleSave = async (data) => {
    setServerError(null)
    try {
      if (editing) {
        await api(`/admin/players/${editing?.id}`, {
          method: 'PUT',
          body: data,
          auth: true,
        })
      } else {
        await api('/admin/players', { method: 'POST', body: data, auth: true })
      }
      setFormOpen(false)
      setEditing(null)
      await loadPlayers()
    } catch (err) {
      setServerError(err?.message || 'Une erreur est survenue.')
    }
  }

  /* Export PDF de la fiche joueur : fetch binaire (le helper api() ne
     gère que le JSON), puis téléchargement via un <a download> temporaire. */
  const handleExportPdf = async (player) => {
    setExportingId(player.id)
    setError(null)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/admin/players/${player.id}/export-pdf`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      )
      if (res.status === 401) {
        clearSession()
        window.location.assign('/admin')
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || `Erreur ${res.status}.`)
      }
      const blob = await res.blob()
      const filename =
        res.headers
          .get('Content-Disposition')
          ?.match(/filename="([^"]+)"/)?.[1] ?? `fiche-joueur-${player.id}.pdf`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err?.message || "L'export PDF a échoué.")
    } finally {
      setExportingId(null)
    }
  }

  /* Suppression (DELETE) — puis rechargement serveur. */
  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    api(`/admin/players/${id}`, { method: 'DELETE', auth: true })
      .then(() => loadPlayers())
      .catch((err) =>
        setError(err?.message || 'Impossible de supprimer le joueur.'),
      )
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Gestion des joueurs"
        subtitle="Effectif complet de l'académie : ajout, modification et suppression."
        action={
          <Button type="button" onClick={openAdd} className="shrink-0">
            <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />
            Ajouter un joueur
          </Button>
        }
      />

      <PlayerStats players={players} />

      {loading ? (
        <p className="text-center text-sm text-sombre/75">
          Chargement des joueurs…
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
        >
          {error}
        </div>
      ) : (
        <>
          <PlayerSearch
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            resultCount={filtered.length}
            totalCount={players.length}
          />

          <PlayerTable
            players={pageItems}
            onEdit={openEdit}
            onDelete={setToDelete}
            onExportPdf={handleExportPdf}
            exportingId={exportingId}
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

      <PlayerForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
          setServerError(null)
        }}
        onSave={handleSave}
        player={editing}
        serverError={serverError}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le joueur"
        message={`Voulez-vous vraiment supprimer ${toDelete?.nom ?? ''} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
