import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import FormInput from '../../trial/FormInput'
import FormSelect from '../../trial/FormSelect'

/* ============================================================
   UserFormModal — Création d'un nouvel administrateur
   ------------------------------------------------------------
   Champs : nom, email, mot de passe (≥ 6), rôle.
   onSave(body) renvoie une promesse (rejette avec le message
   du backend : 409 email déjà pris, 400 validation).
   ============================================================ */

export default function UserFormModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '', role: 'ADMIN' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setMessage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.nom.trim()) next.nom = 'Le nom est requis.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'E-mail invalide.'
    if (form.motDePasse.trim().length < 6) next.motDePasse = 'Au moins 6 caractères.'
    if (Object.keys(next).length > 0) { setErrors(next); return }

    setSaving(true)
    setMessage(null)
    try {
      await onSave({
        nom: form.nom.trim(),
        email: form.email.trim(),
        motDePasse: form.motDePasse,
        role: form.role,
      })
      setForm({ nom: '', email: '', motDePasse: '', role: 'ADMIN' })
      onClose()
    } catch (err) {
      setMessage(err?.message || 'Impossible de créer l\'utilisateur.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvel utilisateur"
      subtitle="Créez un compte administrateur pour le back-office."
      size="md"
      footer={
        <>
          <Button variant="filter" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="user-form" disabled={saving}>
            {saving ? 'Création…' : 'Créer l\'utilisateur'}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <p className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur">
            {message}
          </p>
        )}

        <FormInput
          label="Nom complet"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          error={errors.nom}
          placeholder="Ex : Paul Biya"
          required
        />
        <FormInput
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="utilisateur@bfa-academy.com"
          required
        />
        <FormInput
          label="Mot de passe"
          name="motDePasse"
          type="password"
          value={form.motDePasse}
          onChange={handleChange}
          error={errors.motDePasse}
          placeholder="•••••••• (6 caractères min)"
          required
        />
        <FormSelect
          label="Rôle"
          name="role"
          value={form.role}
          onChange={handleChange}
          options={[
            { value: 'ADMIN', label: 'Admin' },
            { value: 'SUPER_ADMIN', label: 'Super admin' },
          ]}
        />
      </form>
    </Modal>
  )
}
