import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { api } from '../utils/api'
import { normalizeArticle, toArticlePayload } from '../utils/blogAdapter'

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
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverError, setServerError] = useState(null)
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

  /* Chargement depuis le backend (limit=100 + filtres/recherche/
     pagination côté client — convention du projet). */
  const loadArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/admin/blog?limit=100', { auth: true })
      setArticles((data?.data?.items ?? []).map(normalizeArticle))
    } catch (err) {
      setError(err?.message || 'Impossible de charger les articles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

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
    setServerError(null)
    setIsModalOpen(true)
  }

  const openEdit = (post) => {
    setEditing(post)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (data) => {
    setServerError(null)
    try {
      if (editing) {
        const res = await api(`/admin/blog/${editing.id}`, {
          method: 'PUT',
          body: toArticlePayload(data),
          auth: true,
        })
        setArticles((prev) =>
          prev.map((a) => (a.id === editing.id ? normalizeArticle(res.data) : a)),
        )
      } else {
        const res = await api('/admin/blog', {
          method: 'POST',
          body: toArticlePayload(data),
          auth: true,
        })
        setArticles((prev) => [normalizeArticle(res.data), ...prev])
      }
      setIsModalOpen(false)
      setEditing(null)
    } catch (err) {
      setServerError(err?.message || "Une erreur est survenue à l'enregistrement.")
    }
  }

  const handleTogglePublish = async (post) => {
    try {
      const res = await api(`/admin/blog/${post.id}`, {
        method: 'PATCH',
        body: { estPublie: !post.estPublie },
        auth: true,
      })
      setArticles((prev) =>
        prev.map((a) => (a.id === post.id ? normalizeArticle(res.data) : a)),
      )
    } catch (err) {
      setError(err?.message || 'Impossible de changer le statut.')
    }
  }

  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    setIsDeleteConfirmOpen(false)
    api(`/admin/blog/${id}`, { method: 'DELETE', auth: true })
      .then(loadArticles)
      .catch((err) => setError(err?.message || 'Impossible de supprimer l’article.'))
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

      {loading ? (
        <p className="text-center text-sm text-sombre/60">
          Chargement des articles…
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
        </>
      )}

      <BlogFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditing(null)
          setServerError(null)
        }}
        onSave={handleSave}
        post={editing}
        serverError={serverError}
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
