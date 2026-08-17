import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormSelect from '../trial/FormSelect'

/* ============================================================
   ResultForm — Formulaire ajout / modification d'un résultat
   ------------------------------------------------------------
   - Modale avec validation : date, équipes, scores, catégorie,
     type de rencontre
   - Catégories dynamiques (ids réels du backend, pas de liste
     en dur) : value = String(c.id), envoyé en categorieId à
     l'enregistrement
   ============================================================ */

const TYPES = ['Championnat', 'Amical']

const emptyForm = {
  date: '',
  equipeA: '',
  equipeB: '',
  scoreA: '',
  scoreB: '',
  categorie: '',
  type: '',
}

function validateField(name, value) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'date':
      if (!v) return 'Ce champ est obligatoire.'
      return ''
    case 'equipeA':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'equipeB':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'scoreA':
    case 'scoreB': {
      if (v === '') return 'Ce champ est obligatoire.'
      const score = Number(v)
      if (!Number.isInteger(score)) return 'Doit être un nombre entier.'
      if (score < 0 || score > 99) return 'Doit être entre 0 et 99.'
      return ''
    }
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

export default function ResultForm({ open, onClose, onSave, result, categories = [], serverError }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const categorieOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.nom,
  }))

  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (result ? result.id : 'new')) {
    setOpenedFor(result ? result.id : 'new')
    setForm(
      result
        ? {
            date: result.date,
            equipeA: result.equipeA,
            equipeB: result.equipeB,
            scoreA: String(result.scoreA),
            scoreB: String(result.scoreB),
            categorie: result ? String(result.categorieId ?? '') : '',
            type: result.type,
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
      id: result?.id ?? Date.now(),
      date: form.date,
      equipeA: form.equipeA.trim(),
      equipeB: form.equipeB.trim(),
      scoreA: Number(form.scoreA),
      scoreB: Number(form.scoreB),
      categorie: form.categorie,
      type: form.type,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={result ? 'Modifier le résultat' : 'Ajouter un résultat'}
      subtitle={
        result
          ? 'Mettez à jour les informations de la rencontre.'
          : 'Renseignez les informations de la rencontre.'
      }
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="result-form" variant="primary" size="sm">
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="result-form" onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-2.5 text-sm font-medium text-erreur"
          >
            {serverError}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
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
            <FormSelect
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              onBlur={handleBlur}
              options={TYPES}
              placeholder="…"
              required
              error={touched.type ? errors.type : undefined}
              touched={touched.type}
            />
            <FormSelect
              label="Catégorie"
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              onBlur={handleBlur}
              options={categorieOptions}
              placeholder="…"
              required
              error={touched.categorie ? errors.categorie : undefined}
              touched={touched.categorie}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:col-span-2">
            <div>
              <FormInput
                label="Équipe à domicile"
                name="equipeA"
                value={form.equipeA}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex : BFA"
                required
                error={touched.equipeA ? errors.equipeA : undefined}
                touched={touched.equipeA}
              />
            </div>
            <div>
              <FormInput
                label="Équipe adverse"
                name="equipeB"
                value={form.equipeB}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex : FCR"
                required
                error={touched.equipeB ? errors.equipeB : undefined}
                touched={touched.equipeB}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:col-span-2">
            <FormInput
              label="Score domicile"
              name="scoreA"
              type="number"
              min="0"
              max="99"
              value={form.scoreA}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0"
              required
              error={touched.scoreA ? errors.scoreA : undefined}
              touched={touched.scoreA}
            />
            <FormInput
              label="Score adverse"
              name="scoreB"
              type="number"
              min="0"
              max="99"
              value={form.scoreB}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0"
              required
              error={touched.scoreB ? errors.scoreB : undefined}
              touched={touched.scoreB}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
