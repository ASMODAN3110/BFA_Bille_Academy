import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faImages,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import ThemeFilter from '../components/admin/gallery/ThemeFilter'
import AlbumGrid from '../components/admin/gallery/AlbumGrid'
import AlbumActions from '../components/admin/gallery/AlbumActions'
import AlbumFormModal from '../components/admin/gallery/AlbumFormModal'
import MediaUploadModal from '../components/admin/gallery/MediaUploadModal'
import MediaGrid from '../components/admin/gallery/MediaGrid'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import { adminAlbums } from '../data/mockData'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminGallery — Gestion de la galerie (/admin/gallery)
   ------------------------------------------------------------
   @EF21 Vue grille : albums triés par date, filtre par thème,
         pagination (4 par page)
   @EF22 CRUD des albums (création / modification / suppression
         avec confirmation)
   @EF23 Import de médias : drag & drop ou parcours, formats
         JPG/PNG/MP4/WEBM, max 10 Mo, aperçu, barre de progression
   @EF24 Vue médias : grille d'un album, aperçu, suppression d'un
         média avec confirmation
   ------------------------------------------------------------
   État (conforme au cahier des charges) :
     albums, selectedTheme, selectedAlbumId, currentView
     (grille / médias), isAlbumModalOpen, isMediaModalOpen,
     isDeleteConfirmOpen
   ============================================================ */

const PAGE_SIZE = 4

export default function AdminGallery() {
  const [albums, setAlbums] = useState(adminAlbums)
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

  /* Compteur local pour des ids de médias stables (upload). */
  const idCounter = useRef(adminAlbums.length * 100)

  const currentView = selectedAlbumId ? 'media' : 'grid'

  const selectedAlbum = useMemo(
    () => albums.find((a) => a.id === selectedAlbumId) ?? null,
    [albums, selectedAlbumId],
  )

  const filteredAlbums = useMemo(
    () =>
      selectedTheme === 'Tous'
        ? albums
        : albums.filter((a) => a.theme === selectedTheme),
    [albums, selectedTheme],
  )

  const sortedAlbums = useMemo(
    () => [...filteredAlbums].sort((a, b) => b.dateCreation.localeCompare(a.dateCreation)),
    [filteredAlbums],
  )

  const totalPages = Math.max(1, Math.ceil(sortedAlbums.length / PAGE_SIZE))
  const pageAlbums = useMemo(
    () => sortedAlbums.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedAlbums, page],
  )

  /* Retour à la 1re page quand le thème change. */
  useEffect(() => {
    setPage(1)
  }, [selectedTheme])

  const nextMediaId = () => {
    idCounter.current += 1
    return Date.now() + idCounter.current
  }

  /* -------------------- Albums -------------------- */

  const openAddAlbum = () => {
    setEditingAlbum(null)
    setIsAlbumModalOpen(true)
  }

  const openEditAlbum = (album) => {
    setEditingAlbum(album)
    setIsAlbumModalOpen(true)
  }

  const handleSaveAlbum = (data) => {
    setAlbums((prev) =>
      editingAlbum
        ? prev.map((a) => (a.id === editingAlbum.id ? data : a))
        : [data, ...prev],
    )
    setIsAlbumModalOpen(false)
    setEditingAlbum(null)
  }

  const requestDeleteAlbum = (album) => {
    setToDeleteAlbum(album)
    setToDeleteMedia(null)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDeleteAlbum = () => {
    setAlbums((prev) => prev.filter((a) => a.id !== toDeleteAlbum?.id))
    if (toDeleteAlbum?.id === selectedAlbumId) setSelectedAlbumId(null)
    setToDeleteAlbum(null)
    setIsDeleteConfirmOpen(false)
  }

  /* -------------------- Médias -------------------- */

  const openAlbumMedia = (album) => {
    setSelectedAlbumId(album.id)
    setPage(1)
  }

  const backToAlbums = () => {
    setSelectedAlbumId(null)
    setPage(1)
  }

  const handleUploaded = (files) => {
    const newMedias = files.map((f) => ({
      id: nextMediaId(),
      type: f.type,
      url: f.url,
      nomFichier: f.nom,
    }))
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === selectedAlbumId
          ? { ...a, medias: [...a.medias, ...newMedias] }
          : a,
      ),
    )
  }

  const requestDeleteMedia = (media) => {
    setToDeleteMedia(media)
    setToDeleteAlbum(null)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDeleteMedia = () => {
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === selectedAlbumId
          ? { ...a, medias: a.medias.filter((m) => m.id !== toDeleteMedia?.id) }
          : a,
      ),
    )
    setToDeleteMedia(null)
    setIsDeleteConfirmOpen(false)
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
      className="space-y-6"
    >
      <PageHeader
        title="Galerie"
        subtitle="Albums photos et vidéos publiés sur le site public."
        action={
          <Button type="button" onClick={openAddAlbum} className="shrink-0">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Créer un album
          </Button>
        }
      />

      {currentView === 'grid' ? (
        <>
          <ThemeFilter
            selected={selectedTheme}
            onSelect={setSelectedTheme}
            count={sortedAlbums.length}
            total={albums.length}
          />

          {pageAlbums.length === 0 ? (
            <Card className="p-10 text-center">
              <FontAwesomeIcon
                icon={faImages}
                className="mx-auto h-10 w-10 text-sombre/20"
              />
              <p className="mt-3 font-bold text-sombre/70">
                Aucun album dans ce thème.
              </p>
            </Card>
          ) : (
            <>
              <AlbumGrid
                albums={pageAlbums}
                onOpen={openAlbumMedia}
                onAddMedia={(album) => {
                  setSelectedAlbumId(album.id)
                  setIsMediaModalOpen(true)
                }}
                onEdit={openEditAlbum}
                onDelete={requestDeleteAlbum}
              />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      ) : (
        /* ------------ Vue médias d'un album ------------ */
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-clair p-4 md:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={backToAlbums}
                aria-label="Retour aux albums"
                title="Retour aux albums"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-vert transition hover:bg-vert/10 active:scale-95"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-vert">
                  {selectedAlbum?.titre}
                </h2>
                <p className="truncate text-xs text-sombre/60">
                  {selectedAlbum?.description}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-vert/10 px-3 py-1 text-xs font-bold text-vert">
                <FontAwesomeIcon icon={faImages} className="h-3.5 w-3.5" />
                {selectedAlbum?.medias.length ?? 0} média(s)
              </span>
              <AlbumActions
                album={selectedAlbum}
                onAddMedia={() => setIsMediaModalOpen(true)}
                onEdit={openEditAlbum}
                onDelete={requestDeleteAlbum}
              />
            </div>
          </div>

          <div className="p-4 md:p-5">
            <MediaGrid
              album={selectedAlbum}
              onPreview={setPreviewMedia}
              onDeleteMedia={requestDeleteMedia}
            />
          </div>
        </Card>
      )}

      <AlbumFormModal
        open={isAlbumModalOpen}
        onClose={() => {
          setIsAlbumModalOpen(false)
          setEditingAlbum(null)
        }}
        onSave={handleSaveAlbum}
        album={editingAlbum}
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
                toDeleteMedia.nomFichier ?? toDeleteMedia.id ?? ''
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
        title={previewMedia?.nomFichier ?? 'Média'}
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
            alt={previewMedia?.nomFichier ?? 'Photo de l’album'}
            className="w-full rounded-xl"
          />
        )}
      </Modal>
    </motion.div>
  )
}
