import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import ThemeFilter from '../components/admin/gallery/ThemeFilter'
import AlbumGrid from '../components/admin/gallery/AlbumGrid'
import AlbumActions from '../components/admin/gallery/AlbumActions'
import AlbumFormModal from '../components/admin/gallery/AlbumFormModal'
import MediaUploadModal from '../components/admin/gallery/MediaUploadModal'
import MediaGrid from '../components/admin/gallery/MediaGrid'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api } from '../utils/api'
import { normalizeAlbum } from '../utils/albumAdapter'

/* ============================================================
   AdminGallery — Gestion de la galerie (/admin/gallery)
   ------------------------------------------------------------
   Module 4 — branchement backend :
   - Liste : GET /admin/albums?limit=100 (Bearer) → normalisée
     via normalizeAlbum (dateCreation en clé "YYYY-MM-DD",
     medias garantis en tableau).
   - CRUD : POST/PUT /admin/albums (+ /:id) {titre, description?,
     theme} ; DELETE /admin/albums/:id (+ fichiers S3).
   - Médias : POST /admin/albums/:id/media (multipart, champ
     `files`) → l'album mis à jour est remonté ; DELETE
     /admin/albums/:albumId/media/:mediaId → `data` = album à jour.
   - États : loading / error (chargement) + serverError (actions,
     affiché dans la modale d'album ou en bandeau sinon).
   ------------------------------------------------------------
   @EF21 Vue grille (maquette Claude Design) : albums triés par date,
         filtre par thème, pagination (11 par page + carte d'ajout) ;
         l'album sélectionné affiche ses médias sous la grille
   @EF22 CRUD des albums (création / modification / suppression
         avec confirmation)
   @EF23 Import de médias : drag & drop ou parcours, formats
         JPG/PNG/MP4/WEBM, max 10 Mo, aperçu, barre de progression
   @EF24 Vue médias : grille d'un album, aperçu, suppression d'un
         média avec confirmation
   ============================================================ */

const PAGE_SIZE = 11

export default function AdminGallery() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState('Tous')
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [toDeleteAlbum, setToDeleteAlbum] = useState(null)
  const [toDeleteMedia, setToDeleteMedia] = useState(null)
  const [previewMedia, setPreviewMedia] = useState(null)
  const [page, setPage] = useState(1)

  /* Compteur de requêtes : ignore une réponse périmée si la liste
     est rechargée. */
  const loadSeq = useRef(0)

  const filteredAlbums = useMemo(
    () =>
      selectedTheme === 'Tous'
        ? albums
        : albums.filter((a) => a.theme === selectedTheme),
    [albums, selectedTheme],
  )

  const sortedAlbums = useMemo(
    () =>
      [...filteredAlbums].sort((a, b) =>
        b.dateCreation.localeCompare(a.dateCreation),
      ),
    [filteredAlbums],
  )

  const totalPages = Math.max(1, Math.ceil(sortedAlbums.length / PAGE_SIZE))
  const pageAlbums = useMemo(
    () => sortedAlbums.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedAlbums, page],
  )

  /* Album affiché : celui choisi s'il est dans la page, sinon le premier. */
  const selectedAlbum =
    pageAlbums.find((a) => a.id === selectedAlbumId) ?? pageAlbums[0] ?? null

  /* Retour à la 1re page quand le thème change. */
  useEffect(() => {
    setPage(1)
    setSelectedAlbumId(null)
  }, [selectedTheme])

  /* -------- Chargement -------- */

  const loadAlbums = useCallback(async () => {
    const requestId = ++loadSeq.current
    setLoading(true)
    setError(null)
    try {
      const res = await api('/admin/albums?limit=100', { auth: true })
      if (requestId !== loadSeq.current) return
      const items = (res?.data?.items ?? []).map(normalizeAlbum)
      // Diagnostic : nombre d'albums réellement reçus.
      
      setAlbums(items)
    } catch (err) {
      if (requestId !== loadSeq.current) return
      setError(err?.message || 'Impossible de charger les albums.')
    } finally {
      if (requestId === loadSeq.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAlbums()
  }, [loadAlbums])

  /* -------------------- Albums -------------------- */

  const openAddAlbum = () => {
    setEditingAlbum(null)
    setServerError(null)
    setIsAlbumModalOpen(true)
  }

  const openEditAlbum = (album) => {
    setEditingAlbum(album)
    setServerError(null)
    setIsAlbumModalOpen(true)
  }

  const handleSaveAlbum = async (data) => {
    setServerError(null)
    try {
      const saved = editingAlbum
        ? await api(`/admin/albums/${editingAlbum?.id}`, {
            method: 'PUT',
            body: data,
            auth: true,
          })
        : await api('/admin/albums', { method: 'POST', body: data, auth: true })
      const normalized = normalizeAlbum(saved?.data)
      setAlbums((prev) =>
        editingAlbum
          ? prev.map((a) => (a.id === normalized.id ? normalized : a))
          : [normalized, ...prev],
      )
      setIsAlbumModalOpen(false)
      setEditingAlbum(null)
    } catch (err) {
      // 400 → message backend (errors[0]) affiché dans la modale.
      setServerError(err?.message || "Impossible d'enregistrer l'album.")
    }
  }

  const requestDeleteAlbum = (album) => {
    setToDeleteAlbum(album)
    setToDeleteMedia(null)
    setServerError(null)
    setIsDeleteConfirmOpen(true)
  }

  /* ⚠️ React Compiler : `toDeleteAlbum?.id` lu au 1er niveau du
     handler (avec garde null). */
  const confirmDeleteAlbum = () => {
    const id = toDeleteAlbum?.id
    if (id == null) return
    setToDeleteAlbum(null)
    setIsDeleteConfirmOpen(false)
    api(`/admin/albums/${id}`, { method: 'DELETE', auth: true })
      .then(() => {
        setAlbums((prev) => prev.filter((a) => a.id !== id))
        setSelectedAlbumId((prevId) => (prevId === id ? null : prevId))
      })
      .catch((err) =>
        setServerError(err?.message || "Impossible de supprimer l'album."),
      )
  }

  /* -------------------- Médias -------------------- */

  /* L'upload a réussi → on remplace l'album par la réponse serveur
     (le backend renvoie l'album mis à jour, médias inclus). */
  const handleUploaded = (updatedAlbum) => {
    const normalized = normalizeAlbum(updatedAlbum)
    setAlbums((prev) =>
      prev.map((a) => (a.id === normalized.id ? normalized : a)),
    )
    setServerError(null)
  }

  const requestDeleteMedia = (media) => {
    setToDeleteMedia(media)
    setToDeleteAlbum(null)
    setServerError(null)
    setIsDeleteConfirmOpen(true)
  }

  /* ⚠️ React Compiler : albumId + mediaId lus au 1er niveau. */
  const confirmDeleteMedia = () => {
    const albumId = selectedAlbum?.id
    const mediaId = toDeleteMedia?.id
    if (albumId == null || mediaId == null) return
    setToDeleteMedia(null)
    setIsDeleteConfirmOpen(false)
    api(`/admin/albums/${albumId}/media/${mediaId}`, {
      method: 'DELETE',
      auth: true,
    })
      .then((res) => {
        const normalized = normalizeAlbum(res?.data)
        setAlbums((prev) =>
          prev.map((a) => (a.id === albumId ? normalized : a)),
        )
      })
      .catch((err) =>
        setServerError(err?.message || 'Impossible de supprimer le média.'),
      )
  }

  const closeDeleteConfirm = () => {
    setToDeleteAlbum(null)
    setToDeleteMedia(null)
    setIsDeleteConfirmOpen(false)
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      {/* Erreur d'une action hors modale (suppression) — le message
          d'enregistrement s'affiche dans la modale d'album. */}
      {serverError && !isAlbumModalOpen && (
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

      <PageHeader
        title="Galerie"
        subtitle="Albums photo et vidéo publiés sur le site public."
        action={
          <button
            type="button"
            onClick={openAddAlbum}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Nouvel album
          </button>
        }
      />

      {loading ? (
        <p className="py-10 text-center text-sm text-sombre/75">
          Chargement des albums…
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
          <ThemeFilter selected={selectedTheme} onSelect={setSelectedTheme} />

          <AlbumGrid
            albums={pageAlbums}
            selectedId={selectedAlbum?.id ?? null}
            onSelect={setSelectedAlbumId}
            onAddPhotos={() =>
              selectedAlbum ? setIsMediaModalOpen(true) : openAddAlbum()
            }
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              variant="square"
            />
          )}

          {selectedAlbum && (
            <section className="rounded-2xl border border-[#e3ede6] bg-white px-4 py-[18px] sm:px-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold">{selectedAlbum.titre}</h2>
                  <span className="text-[13px] text-sombre/75">
                    {selectedAlbum.medias.length > 0
                      ? 'Photo de couverture : ★ 1re photo'
                      : 'Aucun média pour le moment'}
                  </span>
                </div>
                <AlbumActions
                  album={selectedAlbum}
                  onAddMedia={() => setIsMediaModalOpen(true)}
                  onEdit={openEditAlbum}
                  onDelete={requestDeleteAlbum}
                />
              </div>
              <MediaGrid
                album={selectedAlbum}
                onPreview={setPreviewMedia}
                onDeleteMedia={requestDeleteMedia}
              />
            </section>
          )}
        </>
      )}

      <AlbumFormModal
        open={isAlbumModalOpen}
        onClose={() => {
          setIsAlbumModalOpen(false)
          setEditingAlbum(null)
        }}
        onSave={handleSaveAlbum}
        album={editingAlbum}
        serverError={serverError}
      />

      <MediaUploadModal
        open={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        album={selectedAlbum}
        onUpload={handleUploaded}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={toDeleteMedia ? confirmDeleteMedia : confirmDeleteAlbum}
        title={toDeleteMedia ? 'Supprimer le média' : "Supprimer l'album"}
        message={
          toDeleteMedia
            ? `Voulez-vous vraiment supprimer le média « ${
                toDeleteMedia.nom ?? toDeleteMedia.id ?? ''
              } » de l'album ? Cette action est irréversible.`
            : `Voulez-vous vraiment supprimer l'album « ${
                toDeleteAlbum?.titre ?? ''
              } » et tous ses médias ? Cette action est irréversible.`
        }
        confirmLabel="Supprimer"
      />

      {/* Aperçu d'un média */}
      <Modal
        open={Boolean(previewMedia)}
        onClose={() => setPreviewMedia(null)}
        title={previewMedia?.nom ?? 'Média'}
        subtitle="Aperçu du média"
        size="lg"
        footer={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewMedia(null)}
          >
            Fermer
          </Button>
        }
      >
        {previewMedia?.type === 'video' ? (
          <video
            src={previewMedia.url}
            controls
            autoPlay
            className="w-full rounded-xl"
          />
        ) : (
          <img
            src={previewMedia?.url}
            alt={previewMedia?.nom ?? 'Photo de l’album'}
            loading="lazy"
            className="w-full rounded-xl"
          />
        )}
      </Modal>
    </motion.div>
  )
}
