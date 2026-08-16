import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormSelect from '../trial/FormSelect'
import { categories } from '../../data/categories'

/* ============================================================
   EventForm — Formulaire ajout / modification d'un événement
   ------------------------------------------------------------
   - Modale (Modal) avec validation des champs
   - Props : open, onClose, onSave(eventData), event (ou null)
   ============================================================ */

const TYPES = ['Match', 'Entraînement']

const emptyForm = {
  titre: '',
  date: '',
  heureDebut: '',
  heureFin: '',
  lieu: '',
  categorie: '',
  type: '',
}

function validateField(name, value) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'titre':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 3) return 'Doit contenir au moins 3 caractères.'
      return ''
    case 'date':
      if (!v) return 'Ce champ est obligatoire.'
      return ''
    case 'heureDebut':
      if (!v) return 'Ce champ est obligatoire.'
      return ''
    case 'lieu':
      if (!v) return 'Ce champ est obligatoire.'
      return ''
    case 'categorie':
      if (!v) return 'Veuillez sélectionner une catégorie.'
      return ''
    case 'type':
      if (!v) return 'Veuillez sélectionner un type.'
      return ''
    default:
      return ''
  }
}

export default function EventForm({ open, onClose, onSave, event }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (event ? event.id : 'new')) {
    setOpenedFor(event ? event.id : 'new')
    setForm(
      event
        ? {
            titre: event.titre,
            date: event.date,
            heureDebut: event.heureDebut,
            heureFin: event.heureFin ?? '',
            lieu: event.lieu,
            categorie: event.categorie,
            type: event.type,
          }
        : emptyForm,
    )
    setErrors({})
    setTouched({})
  }
  if (!open && openedFor !== null) setOpenedFor(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allTouched = Object.keys(emptyForm).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)
    const nextErrors = {}
    for (const key of Object.keys(emptyForm)) {
      const error = validateField(key, form[key])
      if (error) nextErrors[key] = error
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      id: event?.id ?? Date.now(),
      titre: form.titre.trim(),
      date: form.date,
      heureDebut: form.heureDebut,
      heureFin: form.heureFin || form.heureDebut,
      lieu: form.lieu.trim(),
      categorie: form.categorie,
      type: form.type,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={event ? 'Modifier l’événement' : 'Créer un événement'}
      subtitle={
        event
          ? 'Mettez à jour les informations de l’événement.'
          : 'Renseignez les informations du nouvel événement.'
      }
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="event-form" variant="primary" size="sm">
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="event-form" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Titre"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : Match amical U17"
            required
            error={touched.titre ? errors.titre : undefined}
            touched={touched.titre}
            className="sm:col-span-2"
          />
          <FormInput
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.date ? errors.date : undefined}
            touched={touched.date}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Début"
              name="heureDebut"
              type="time"
              value={form.heureDebut}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={touched.heureDebut ? errors.heureDebut : undefined}
              touched={touched.heureDebut}
            />
            <FormInput
              label="Fin"
              name="heureFin"
              type="time"
              value={form.heureFin}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.heureFin ? errors.heureFin : undefined}
              touched={touched.heureFin}
            />
          </div>
          <FormInput
            label="Lieu"
            name="lieu"
            value={form.lieu}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : Stade principal"
            required
            error={touched.lieu ? errors.lieu : undefined}
            touched={touched.lieu}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Catégorie"
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              onBlur={handleBlur}
              options={categories}
              placeholder="Sélectionnez…"
              required
              error={touched.categorie ? errors.categorie : undefined}
              touched={touched.categorie}
            />
            <FormSelect
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              onBlur={handleBlur}
              options={TYPES}
              placeholder="Sélectionnez…"
              required
              error={touched.type ? errors.type : undefined}
              touched={touched.type}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
