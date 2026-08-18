import { useState } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import FormInput from '../../trial/FormInput'

/* ============================================================
   ResetPasswordModal — Réinitialisation du mot de passe d'un
   autre administrateur (PUT /admin/users/:id/password).
   onReset(nouveauMotDePasse) renvoie une promesse.
   ============================================================ */

export default function ResetPasswordModal({ open, onClose, admin, onReset }) {
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (nouveauMotDePasse.trim().length < 6) {
      setError('Au moins 6 caractères.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onReset(nouveauMotDePasse)
      setNouveauMotDePasse('')
      onClose()
    } catch (err) {
      setError(err?.message || 'Impossible de réinitialiser le mot de passe.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Réinitialiser le mot de passe"
      subtitle={`Nouveau mot de passe pour ${admin?.nom ?? 'cet utilisateur'}.`}
      size="sm"
      footer={
        <>
          <Button variant="filter" onClick={onClose}>Annuler</Button>
          <Button type="submit" form="reset-form" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Réinitialiser'}
          </Button>
        </>
      }
    >
      <form id="reset-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur">
            {error}
          </p>
        )}
        <FormInput
          label="Nouveau mot de passe"
          name="nouveauMotDePasse"
          type="password"
          value={nouveauMotDePasse}
          onChange={(e) => { setNouveauMotDePasse(e.target.value); setError(null) }}
          placeholder="••••••••"
          required
        />
      </form>
    </Modal>
  )
}
