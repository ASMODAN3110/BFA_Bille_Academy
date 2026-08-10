import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import FileUpload from '../../ui/FileUpload'

/* ============================================================
   MediaUploadModal — Import de médias dans un album (@EF23)
   ------------------------------------------------------------
   - <FileUpload /> : drag & drop, validation formats (JPG, PNG,
     MP4, WEBM) et taille max 10 Mo, aperçu, progression
   - Message de succès après chaque import
   - Props : open, onClose, album, onUpload(fichiers)
   ============================================================ */

export default function MediaUploadModal({ open, onClose, album, onUpload }) {
  const [addedCount, setAddedCount] = useState(0)

  /* Réinitialise le compteur à chaque changement d'album. */
  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (album ? album.id : 'new')) {
    setOpenedFor(album ? album.id : 'new')
    setAddedCount(0)
  }
  if (!open && openedFor !== null) setOpenedFor(null)

  const handleUpload = (files) => {
    onUpload(files)
    setAddedCount(files.length)
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

        {/* key={addedCount} : remonte un <FileUpload /> vierge après
            chaque import réussi. */}
        <FileUpload key={addedCount} onUpload={handleUpload} />
      </div>
    </Modal>
  )
}
