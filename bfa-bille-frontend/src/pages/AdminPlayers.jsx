import { useEffect, useMemo, useState } from 'react'
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

/* ============================================================
   AdminPlayers — Gestion des joueurs (/admin/players)
   ------------------------------------------------------------
   - CRUD complet : lister, rechercher/filtrer, exporter,
     ajouter (modale), modifier (modale), supprimer (confirmation)
   - Pagination locale (5 par page)
   - `autoAdd` : ouvre le formulaire d'ajout au chargement
     (route /admin/players/add depuis les actions rapides)
   ============================================================ */

const PAGE_SIZE = 5

export default function AdminPlayers({ autoAdd = false }) {
  /* ⚠️ Plus de données mock : la liste part vide. Les effectifs
     arriveront du backend (GET /admin/joueurs) quand les endpoints
     CRUD existeront. */
  const [players, setPlayers] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const [status, setStatus] = useState('Tous')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  /* Route /admin/players/add → ouvre le formulaire d'ajout. */
  useEffect(() => {
    if (autoAdd) {
      setEditing(null)
      setFormOpen(true)
    }
  }, [autoAdd])

  /* Retour à la 1re page dès qu'un filtre change. */
  useEffect(() => {
    setPage(1)
  }, [query, category, status])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return players.filter((p) => {
      const matchesQuery =
        !q ||
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        p.poste.toLowerCase().includes(q)
      const matchesCategory = category === 'Tous' || p.categorie === category
      const matchesStatus = status === 'Tous' || p.statut === status
      return matchesQuery && matchesCategory && matchesStatus
    })
  }, [players, query, category, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (player) => {
    setEditing(player)
    setFormOpen(true)
  }

  const handleSave = (data) => {
    setPlayers((prev) =>
      editing
        ? prev.map((p) => (p.id === editing.id ? data : p))
        : [data, ...prev],
    )
    setFormOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    setPlayers((prev) => prev.filter((p) => p.id !== toDelete.id))
    setToDelete(null)
  }

  const handleExport = () => {
    const header = 'Nom;Prénom;Poste;Âge;Catégorie;Statut'
    const rows = filtered.map((p) =>
      [p.nom, p.prenom, p.poste, p.age, p.categorie, p.statut].join(';'),
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([`﻿${csv}`], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'joueurs.csv'
    a.click()
    URL.revokeObjectURL(url)
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
        subtitle="Effectif complet de l'académie : ajout, modification, suppression et export."
        action={
          <Button type="button" onClick={openAdd} className="shrink-0">
            <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />
            Ajouter un joueur
          </Button>
        }
      />

      <PlayerStats players={players} />

      <PlayerSearch
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        onExport={handleExport}
        resultCount={filtered.length}
        totalCount={players.length}
      />

      <PlayerTable players={pageItems} onEdit={openEdit} onDelete={setToDelete} />

      <div className="flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <PlayerForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
        player={editing}
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
