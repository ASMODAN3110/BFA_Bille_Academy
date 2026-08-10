import Modal from './Modal'
import Button from './Button'

/* ============================================================
   ConfirmDialog — Boîte de confirmation (suppression…)
   ------------------------------------------------------------
   - Réutilise Modal (petite taille)
   - Props : open, onClose, onConfirm, title?, message?,
     confirmLabel?, cancelLabel?
   ============================================================ */

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message = 'Cette action est irréversible.',
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-sombre/70">{message}</p>
    </Modal>
  )
}
