import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import FileUpload from '../../ui/FileUpload'
import { uploadManyMedia } from '../../../utils/media'

/* ============================================================
   MediaUploadModal — Import de médias dans un album (@EF23)
   ------------------------------------------------------------
   - <FileUpload /> : drag & drop, validation formats (JPG, PNG,
     MP4, WEBM) et taille max 10 Mo, aperçu, progression simulée
   - L'import réel passe par le backend : POST /admin/media/upload-many
     (FormData) → URLs MinIO publiques remontées à onUpload
   - La barre de progression n'est pas le vrai upload (fetch
     n'expose pas la progression) — acceptable pour l'instant.
   - Props : open, onClose, album, onUpload([{type,url,nomFichier}])
   ============================================================ */

export default function MediaUploadModal({ open, onClose, album, onUpload }) {
  const [addedCount, setAddedCount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  /* Réinitialise le compteur à chaque changement d'album. */
  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (album ? album.id : 'new')) {
    setOpenedFor(album ? album.id : 'new')
    setAddedCount(0)
    setUploadError(null)
  }
  if (!open && openedFor !== null) setOpenedFor(null)

  const handleUpload = async (files) => {
    if (uploading) return
    setUploading(true)
    setUploadError(null)
    try {
      const medias = await uploadManyMedia(
        files.map((f) => f.file),
        'galerie',
      )
      /* Remonte les URLs réelles (pas les aperçus data URL). Le type
         est reconstruit depuis l'extension MinIO (.mp4/.webm → vidéo). */
      onUpload(
        medias.map((m) => ({
          type:
            m.url.includes('.mp4') || m.url.includes('.webm')
              ? 'video'
              : 'image',
          url: m.url,
          nomFichier: m.url.split('/').pop(),
        })),
      )
      setAddedCount(medias.length)
    } catch (err) {
      setUploadError(err?.message || "Impossible d'importer les médias.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter des médias"
      subtitle={
        album ? `Import de photos / vidéos dans « ${album.titre} »` : undefined
      }
      size="lg"
      footer={
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Fermer
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-vert/5 px-4 py-3">
          <p className="text-sm text-sombre/70">
            Album :{' '}
            <span className="font-bold text-vert">{album?.titre}</span>
          </p>
          <p className="text-sm text-sombre/60">
            {album?.medias.length ?? 0} média(s) déjà présents
          </p>
        </div>

        {addedCount > 0 && (
          <p
            className="flex items-center gap-2 rounded-xl bg-succes/10 px-4 py-3 text-sm font-semibold text-succes"
            role="status"
          >
            <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
            {addedCount} média(s) importé(s) avec succès. Ils apparaissent
            maintenant dans l’album.
          </p>
        )}

        {uploading && (
          <p
            className="flex items-center gap-2 rounded-xl bg-vert/5 px-4 py-3 text-sm font-semibold text-vert"
            role="status"
          >
            <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
            Transfert vers le stockage…
          </p>
        )}

        {uploadError && (
          <p
            role="alert"
            className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
          >
            {uploadError}
          </p>
        )}

        {/* key={addedCount} : remonte un <FileUpload /> vierge après
            chaque import réussi. */}
        <FileUpload key={addedCount} onUpload={handleUpload} />
      </div>
    </Modal>
  )
}
