import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import BlogTable from '../components/admin/blog/BlogTable'
import BlogPanel from '../components/admin/blog/BlogPanel'
import BlogFormModal from '../components/admin/blog/BlogFormModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api } from '../utils/api'
import { normalizeArticle, toArticlePayload } from '../utils/blogAdapter'

/* ============================================================
   AdminBlog — Gestion du blog (/admin/blog)
   ------------------------------------------------------------
   Maquette Claude Design : liste (onglets + recherche) à gauche,
   « Édition rapide » de l'article sélectionné à droite.
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
  const [selectedId, setSelectedId] = useState(null)
  const [panelError, setPanelError] = useState(null)
  const [panelSaving, setPanelSaving] = useState(false)
  const [menu, setMenu] = useState(null)
  const panelRef = useRef(null)

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

  const counts = useMemo(
    () => ({
      Tous: articles.length,
      Publiés: articles.filter((a) => a.estPublie).length,
      Brouillons: articles.filter((a) => !a.estPublie).length,
    }),
    [articles],
  )

  const pageItems = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page],
  )

  const selectedPost =
    articles.find((a) => a.id === selectedId) ?? pageItems[0] ?? null

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

  /* Sélection : sur téléphone le panneau est sous la liste, on y amène l'écran. */
  const selectPost = (id) => {
    setSelectedId(id)
    setPanelError(null)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  /* Édition rapide : le backend exige le corps complet → on repart de
     l'article et on n'écrase que titre / image / statut. */
  const handleQuickSave = async (post, patch) => {
    setPanelError(null)
    if (patch.titre.length < 3) {
      setPanelError('Le titre doit contenir au moins 3 caractères.')
      return
    }
    setPanelSaving(true)
    try {
      const res = await api(`/admin/blog/${post.id}`, {
        method: 'PUT',
        auth: true,
        body: toArticlePayload({
          titre: patch.titre,
          contenu: post.contenu,
          categorie: post.categorie,
          auteur: post.auteur,
          image: patch.image || post.image,
          estPublie: patch.estPublie,
          datePublication: post.datePublication || new Date().toISOString().slice(0, 10),
        }),
      })
      setArticles((prev) =>
        prev.map((a) => (a.id === post.id ? normalizeArticle(res.data) : a)),
      )
    } catch (err) {
      setPanelError(err?.message || "Impossible d'enregistrer l'article.")
    } finally {
      setPanelSaving(false)
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
      .then(() => {
        setSelectedId((cur) => (cur === id ? null : cur))
        return loadArticles()
      })
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
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Blog"
        subtitle={`${counts.Tous} article${counts.Tous > 1 ? 's' : ''} · ${counts.Publiés} publié${counts.Publiés > 1 ? 's' : ''} · ${counts.Brouillons} brouillon${counts.Brouillons > 1 ? 's' : ''}`}
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Nouvel article
          </button>
        }
      />

      {loading ? (
        <p className="text-center text-sm text-sombre/75">
          Chargement des articles…
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

          <div className="flex flex-wrap items-start gap-4">
            <BlogTable
              posts={pageItems}
              counts={counts}
              total={filtered.length}
              page={page}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={setPage}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeId={selectedPost?.id ?? null}
              onSelect={selectPost}
              onMenu={(post, rect) =>
                setMenu({ post, top: rect.bottom + 4, right: window.innerWidth - rect.right })
              }
            />
            <div ref={panelRef} className="flex min-w-0 flex-1 basis-80 scroll-mt-20">
              <BlogPanel
                key={selectedPost?.id ?? 'none'}
                post={selectedPost}
                error={panelError}
                saving={panelSaving}
                onSave={handleQuickSave}
                onFull={openEdit}
              />
            </div>
          </div>
        </>
      )}

      {menu && (
        <div
          role="menu"
          style={{ top: menu.top, right: menu.right }}
          className="fixed z-50 min-w-48 rounded-xl border border-[#e3ede6] bg-white p-1.5 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => openEdit(menu.post)}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm transition hover:bg-[#f4f9f6]"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4 text-vert" />
            Modifier
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleTogglePublish(menu.post)}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm transition hover:bg-[#f4f9f6]"
          >
            <FontAwesomeIcon
              icon={menu.post.estPublie ? faEyeSlash : faEye}
              className="h-4 w-4 text-dore-dark"
            />
            {menu.post.estPublie ? 'Dépublier' : 'Publier'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setToDelete(menu.post)
              setIsDeleteConfirmOpen(true)
            }}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-erreur transition hover:bg-erreur/10"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            Supprimer
          </button>
        </div>
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
