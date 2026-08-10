import { useState } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import FormTextarea from '../../trial/FormTextarea'

/* ============================================================
   TrialRefuseModal — Motif de refus d'une demande (@EF19)
   ------------------------------------------------------------
   - Le motif est obligatoire (min. 5 caractères)
   - Validation à la soumission, erreur avec animation shake
   - Appel de onConfirm(motif) puis fermeture
   ============================================================ */

export default function TrialRefuseModal({ open, onClose, trial, onConfirm }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  /* Réinitialise le formulaire à chaque ouverture (sentinelle 'new'
     pour rester sûr en mode ajout / objet null). */
  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (trial ? trial.id : 'new')) {
    setOpenedFor(trial ? trial.id : 'new')
    setReason('')
    setError('')
    setTouched(false)
  }
  if (!open && openedFor !== null) setOpenedFor(null)

  const validate = (value) => {
    const v = value.trim()
    if (!v) return 'Le motif de refus est obligatoire.'
    if (v.length < 5) return 'Motif trop court (5 caractères minimum).'
    return ''
  }

  const handleChange = (e) => {
    setReason(e.target.value)
    if (touched) setError(validate(e.target.value))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    const nextError = validate(reason)
    setError(nextError)
    if (nextError) return
    onConfirm(trial, reason.trim())
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Refuser la candidature"
      subtitle={
        trial ? `Motif du refus pour ${trial.prenom} ${trial.nom}` : undefined
      }
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="refuse-form" variant="danger" size="sm">
            Confirmer le refus
          </Button>
        </>
      }
    >
      <form id="refuse-form" onSubmit={handleSubmit} noValidate>
        <p className="mb-4 text-sm text-sombre/70">
          Cette action passera la candidature en statut « Refusé ». Indiquez un
          motif : il sera enregistré avec la demande et pourra servir à
          informer le candidat.
        </p>
        <FormTextarea
          label="Motif du refus"
          name="refuseReason"
          value={reason}
          onChange={handleChange}
          placeholder="Ex : Effectif complet au poste visé…"
          rows={3}
          required
          error={touched ? error : undefined}
          touched={touched}
        />
      </form>
    </Modal>
  )
}
