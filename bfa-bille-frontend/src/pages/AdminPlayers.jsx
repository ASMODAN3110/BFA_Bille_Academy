import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFilePdf, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import PlayerSearch from '../components/admin/PlayerSearch'
import PlayerTable, { playerName } from '../components/admin/PlayerTable'
import PlayerForm from '../components/admin/PlayerForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useCategories } from '../hooks/useCategories'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api, clearSession, getToken } from '../utils/api'

/* ============================================================
   AdminPlayers — Gestion des joueurs (/admin/players)
   ------------------------------------------------------------
   - Données : GET /api/players?limit=100 (public, tri serveur) —
     le backend n'a pas de GET /admin/players.
   - CRUD : POST/PUT/DELETE /admin/players (protégés, auth: true).
   - Recherche + pastilles de catégorie (avec effectifs) + filtre de
     poste + pagination locale (5/page), mise en page de la maquette.
   - Sélection multiple : changer de catégorie, exporter (CSV),
     supprimer. Menu « ⋯ » par ligne : export PDF, suppression.
   - `autoAdd` : ouvre le formulaire d'ajout au chargement
     (route /admin/players/add depuis les actions rapides).
   ============================================================ */

const PAGE_SIZE = 5

/* Export CSV (séparateur « ; », BOM pour Excel) d'une liste de joueurs. */
function downloadCsv(list) {
  const head = ['Nom', 'Prénom', 'Catégorie', 'Poste', 'Date de naissance', 'Arrivée']
  const cell = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`
  const rows = list.map((p) =>
    [
      p.nom,
      p.prenom,
      p.categorie?.nom,
      p.poste,
      p.dateNaissance?.slice(0, 10),
      p.dateArrivee?.slice(0, 10),
    ]
      .map(cell)
      .join(';'),
  )
  const blob = new Blob(['﻿' + [head.map(cell).join(';'), ...rows].join('\r\n')], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'joueurs-bfa.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminPlayers({ autoAdd = false }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const [poste, setPoste] = useState('Tous')
  const [selectedIds, setSelectedIds] = useState([])
  const [menu, setMenu] = useState(null)
  const [bulkDelete, setBulkDelete] = useState(false)
  const { categories } = useCategories()
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
  }, [query, category, poste])

  /* Menu « ⋯ » : se ferme au clic ailleurs, à Échap ou au défilement. */
  useEffect(() => {
    if (!menu) return undefined
    const close = () => setMenu(null)
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('click', close)
    window.addEventListener('scroll', close, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

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
      const matchesPoste = poste === 'Tous' || p.poste === poste
      return matchesQuery && matchesCategory && matchesPoste
    })
  }, [players, query, category, poste])

  const counts = useMemo(() => {
    const c = {}
    players.forEach((p) => {
      c[p.categorie?.id] = (c[p.categorie?.id] ?? 0) + 1
    })
    return c
  }, [players])

  const postes = useMemo(
    () => [...new Set(players.map((p) => p.poste))].filter(Boolean).sort(),
    [players],
  )

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

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const toggleAllOnPage = () => {
    const ids = pageItems.map((p) => p.id)
    setSelectedIds((prev) =>
      ids.every((id) => prev.includes(id))
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])],
    )
  }

  const selected = players.filter((p) => selectedIds.includes(p.id))

  /* Changement de catégorie groupé : le backend exige le corps complet. */
  const handleBulkMove = async (categorieId) => {
    if (!categorieId) return
    setError(null)
    try {
      await Promise.all(
        selected.map((p) =>
          api(`/admin/players/${p.id}`, {
            method: 'PUT',
            auth: true,
            body: {
              nom: p.nom,
              prenom: p.prenom,
              poste: p.poste,
              dateNaissance: p.dateNaissance?.slice(0, 10),
              categorieId: Number(categorieId),
              photo: p.photo || null,
            },
          }),
        ),
      )
      setSelectedIds([])
    } catch (err) {
      setError(err?.message || 'Impossible de changer la catégorie.')
    } finally {
      await loadPlayers()
    }
  }

  const handleBulkDelete = async () => {
    const ids = selectedIds
    setBulkDelete(false)
    setSelectedIds([])
    setError(null)
    try {
      await Promise.all(
        ids.map((id) => api(`/admin/players/${id}`, { method: 'DELETE', auth: true })),
      )
    } catch (err) {
      setError(err?.message || 'Impossible de supprimer la sélection.')
    } finally {
      await loadPlayers()
    }
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Joueurs"
        subtitle={`${players.length} joueur${players.length > 1 ? 's' : ''} · ${categories.length} catégorie${categories.length > 1 ? 's' : ''}`}
        action={
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => downloadCsv(filtered)}
              disabled={filtered.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#cfe0d4] bg-white px-4 text-sm font-semibold text-vert-dark transition hover:bg-[#f4f9f6] disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
              Exporter
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              Ajouter un joueur
            </button>
          </div>
        }
      />

      {loading ? (
        <p className="text-center text-sm text-sombre/75">
          Chargement des joueurs…
        </p>
      ) : (
        <>
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
            >
              {error}
            </div>
          )}

          <PlayerSearch
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            poste={poste}
            onPosteChange={setPoste}
            postes={postes}
            counts={counts}
            totalCount={players.length}
          />

          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-vert-dark px-4 py-2.5 text-sm text-white">
              <b className="font-semibold">
                {selected.length} joueur{selected.length > 1 ? 's' : ''} sélectionné
                {selected.length > 1 ? 's' : ''}
              </b>
              <select
                value=""
                onChange={(e) => handleBulkMove(e.target.value)}
                aria-label="Changer de catégorie"
                className="h-9 rounded-lg border border-white/30 bg-transparent px-2 text-sm text-white outline-none"
              >
                <option value="" className="text-sombre">
                  Changer de catégorie
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="text-sombre">
                    {c.nom}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => downloadCsv(selected)}
                className="min-h-9 text-white/80 transition hover:text-white"
              >
                Exporter
              </button>
              <button
                type="button"
                onClick={() => setBulkDelete(true)}
                className="min-h-9 text-white/80 transition hover:text-white"
              >
                Supprimer
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="ml-auto min-h-9 font-semibold text-[#f1d36b]"
              >
                Désélectionner
              </button>
            </div>
          )}

          <PlayerTable
            players={pageItems}
            total={filtered.length}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            onToggleAll={toggleAllOnPage}
            onEdit={openEdit}
            onMenu={(player, rect) =>
              setMenu({ player, top: rect.bottom + 4, right: window.innerWidth - rect.right })
            }
          />
        </>
      )}

      {menu && (
        <div
          role="menu"
          style={{ top: menu.top, right: menu.right }}
          className="fixed z-50 min-w-52 rounded-xl border border-[#e3ede6] bg-white p-1.5 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            disabled={exportingId === menu.player.id}
            onClick={() => handleExportPdf(menu.player)}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm transition hover:bg-[#f4f9f6]"
          >
            <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4 text-dore-dark" />
            Exporter la fiche (PDF)
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setToDelete(menu.player)}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-erreur transition hover:bg-erreur/10"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            Supprimer
          </button>
        </div>
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
        message={`Voulez-vous vraiment supprimer ${toDelete ? playerName(toDelete) : ''} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />

      <ConfirmDialog
        open={bulkDelete}
        onClose={() => setBulkDelete(false)}
        onConfirm={handleBulkDelete}
        title="Supprimer la sélection"
        message={`Voulez-vous vraiment supprimer ${selected.length} joueur(s) ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
