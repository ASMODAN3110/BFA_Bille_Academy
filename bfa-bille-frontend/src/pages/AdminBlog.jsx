import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import BlogStats from '../components/admin/blog/BlogStats'
import BlogFilters from '../components/admin/blog/BlogFilters'
import BlogSearch from '../components/admin/blog/BlogSearch'
import BlogTable from '../components/admin/blog/BlogTable'
import BlogFormModal from '../components/admin/blog/BlogFormModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminBlog — Gestion du blog (/admin/blog)
   ------------------------------------------------------------
   @EF32 Statistiques : vues (30 j), articles publiés,
         nouveaux commentaires
   @EF33 Liste triée (date de publication desc), filtre par statut
         (Tous / Publiés / Brouillons)
   @EF34 Recherche par titre ou auteur, pagination (10 / page)
   @EF35 CRUD : création, modification, suppression avec
         confirmation, publication / dépublication
   @EF36 Validation : titre et contenu obligatoires (contenu
         saisi via l'éditeur <Editor />)
   ------------------------------------------------------------
   État (conforme au cahier des charges) :
     articles, statusFilter, searchTerm, isModalOpen,
     isDeleteConfirmOpen, currentPage (itemsPerPage = 10)
   ============================================================ */

const ITEMS_PER_PAGE = 10

const sortKey = (a) => a.datePublication || a.dateModification || ''

export default function AdminBlog({ autoAdd = false }) {
  /* ⚠️ Plus de données mock : la liste part vide. Les articles
     arriveront du backend (GET /admin/articles) quand les
     endpoints CRUD existeront. */
  const [articles, setArticles] = useState([])
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [page, setPage] = useState(1)

  /* Route /admin/blog/new → ouvre le formulaire d'ajout. */
  useEffect(() => {
    if (autoAdd) {
      setEditing(null)
      setIsModalOpen(true)
    }
  }, [autoAdd])

  /* Retour à la 1re page dès que le filtre ou la recherche change. */
  useEffect(() => {
    setPage(1)
  }, [statusFilter, searchTerm])

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return articles
      .filter((a) => {
        if (statusFilter === 'Publiés') return a.estPublie
        if (statusFilter === 'Brouillons') return !a.estPublie
        return true
      })
      .filter(
        (a) =>
          !q ||
          a.titre.toLowerCase().includes(q) ||
          a.auteur.toLowerCase().includes(q),
      )
      .sort((a, b) => sortKey(b).localeCompare(sortKey(a)))
  }, [articles, statusFilter, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page],
  )

  const start = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const end = Math.min(page * ITEMS_PER_PAGE, filtered.length)

  /* -------------------- Actions -------------------- */

  const openAdd = () => {
    setEditing(null)
    setIsModalOpen(true)
  }

  const openEdit = (post) => {
    setEditing(post)
    setIsModalOpen(true)
  }

  const handleSave = (data) => {
    setArticles((prev) =>
      editing
        ? prev.map((a) => (a.id === editing.id ? data : a))
        : [data, ...prev],
    )
    setIsModalOpen(false)
    setEditing(null)
  }

  const handleTogglePublish = (post) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === post.id
          ? {
              ...a,
              estPublie: !a.estPublie,
              statut: !a.estPublie ? 'Publié' : 'Brouillon',
              dateModification: new Date().toISOString().slice(0, 10),
            }
          : a,
      ),
    )
  }

  const handleDelete = () => {
    setArticles((prev) => prev.filter((a) => a.id !== toDelete?.id))
    setToDelete(null)
    setIsDeleteConfirmOpen(false)
  }

  const closeDeleteConfirm = () => {
    setToDelete(null)
    setIsDeleteConfirmOpen(false)
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Blog"
        subtitle="Articles publiés sur le site : actualités, portraits et communiqués."
        action={
          <Button type="button" onClick={openAdd} className="shrink-0">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Nouvel article
          </Button>
        }
      />

      <BlogStats articles={articles} />

      <div className="space-y-4">
        <BlogFilters
          selected={statusFilter}
          onSelect={setStatusFilter}
          articles={articles}
        />
        <BlogSearch value={searchTerm} onChange={setSearchTerm} />
      </div>

      <BlogTable
        posts={pageItems}
        onEdit={openEdit}
        onTogglePublish={handleTogglePublish}
        onDelete={(post) => {
          setToDelete(post)
          setIsDeleteConfirmOpen(true)
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-sombre/60" role="status">
          {filtered.length === 0 ? (
            'Aucun résultat.'
          ) : (
            <>
              Affichage{' '}
              <span className="font-bold text-vert">{start}</span>–{end} sur{' '}
              <span className="font-bold text-vert">{filtered.length}</span>{' '}
              article(s)
            </>
          )}
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <BlogFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
        post={editing}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Supprimer l'article"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.titre ?? ''} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
