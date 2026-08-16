import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormSelect from '../trial/FormSelect'
import { useCategories } from '../../hooks/useCategories'

/* ============================================================
   EventForm — Formulaire ajout / modification d'un événement
   ------------------------------------------------------------
   - Modale (Modal) avec validation des champs.
   - Corps envoyé au backend : { titre, date, heure, lieu, type,
     categorieId } + equipeA/equipeB/typeMatch si MATCH,
     + objectif/duree si ENTRAINEMENT. Pas de id fabriqué.
   - Les dates passées sont autorisées (aucune contrainte future).
   - Props : open, onClose, onSave(eventData), event (ou null),
     serverError (message d'erreur renvoyé par le backend).
   ============================================================ */

const TYPE_OPTIONS = [
  { value: 'MATCH', label: 'Match' },
  { value: 'ENTRAINEMENT', label: 'Entraînement' },
]

const TYPE_MATCH_OPTIONS = [
  { value: 'AMICAL', label: 'Amical' },
  { value: 'CHAMPIONNAT', label: 'Championnat' },
]

/* normalizeEvent convertit le type en libellé (« Match », « Entraînement ») ;
   il faut repasser au code pour pré-remplir le formulaire en édition. */
const TYPE_TO_CODE = { Match: 'MATCH', 'Entraînement': 'ENTRAINEMENT' }

const emptyForm = {
  titre: '',
  date: '',
  heure: '',
  lieu: '',
  categorie: '',
  type: '',
  equipeA: '',
  equipeB: '',
  typeMatch: '',
  objectif: '',
  duree: '',
}

/* Validation miroir du backend (messages exacts). */
function validateField(name, value) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'titre':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 3) return 'Doit contenir au moins 3 caractères.'
      return ''
    case 'date':
      if (!v) return 'Ce champ est obligatoire.'
      if (Number.isNaN(Date.parse(v))) return 'Date invalide.'
      return ''
    case 'heure':
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
    case 'equipeA':
      if (!v) return 'Le nom de la première équipe est obligatoire.'
      return ''
    case 'equipeB':
      if (!v) return 'Le nom de la deuxième équipe est obligatoire.'
      return ''
    default:
      return ''
  }
}

export default function EventForm({ open, onClose, onSave, event, serverError = null }) {
  const { categories } = useCategories()
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
            heure: event.heure ?? '',
            lieu: event.lieu,
            categorie: String(event.categorieId),
            type: TYPE_TO_CODE[event.type] ?? event.type,
            equipeA: event.equipeA ?? '',
            equipeB: event.equipeB ?? '',
            typeMatch: event.typeMatch ?? '',
            objectif: event.objectif ?? '',
            duree: event.duree != null ? String(event.duree) : '',
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
    const isMatchTeam = name === 'equipeA' || name === 'equipeB'
    const error =
      isMatchTeam && form.type !== 'MATCH' ? '' : validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
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
      // equipeA/equipeB ne sont requis que pour un match
      if (key === 'equipeA' || key === 'equipeB') continue
      const error = validateField(key, form[key])
      if (error) nextErrors[key] = error
    }
    if (form.type === 'MATCH') {
      for (const key of ['equipeA', 'equipeB']) {
        const error = validateField(key, form[key])
        if (error) nextErrors[key] = error
      }
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const body = {
      titre: form.titre.trim(),
      date: form.date,
      heure: form.heure,
      lieu: form.lieu.trim(),
      type: form.type,
      categorieId: Number(form.categorie),
    }
    if (form.type === 'MATCH') {
      body.equipeA = form.equipeA.trim()
      body.equipeB = form.equipeB.trim()
      if (form.typeMatch) body.typeMatch = form.typeMatch
    }
    if (form.type === 'ENTRAINEMENT') {
      if (form.objectif.trim()) body.objectif = form.objectif.trim()
      if (form.duree.trim()) body.duree = Number(form.duree)
    }
    onSave(body)
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
        {serverError && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
          >
            {serverError}
          </div>
        )}

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
          <FormInput
            label="Heure"
            name="heure"
            type="time"
            value={form.heure}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.heure ? errors.heure : undefined}
            touched={touched.heure}
          />
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
            className="sm:col-span-2"
          />
          <FormSelect
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            onBlur={handleBlur}
            options={TYPE_OPTIONS}
            placeholder="Sélectionnez…"
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
            options={categories.map((c) => ({ value: String(c.id), label: c.nom }))}
            placeholder="Sélectionnez…"
            required
            error={touched.categorie ? errors.categorie : undefined}
            touched={touched.categorie}
          />

          {/* Champs conditionnels : Match */}
          {form.type === 'MATCH' && (
            <>
              <FormInput
                label="Équipe A"
                name="equipeA"
                value={form.equipeA}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex : BFA U17"
                required
                error={touched.equipeA ? errors.equipeA : undefined}
                touched={touched.equipeA}
              />
              <FormInput
                label="Équipe B"
                name="equipeB"
                value={form.equipeB}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex : AS Dakar"
                required
                error={touched.equipeB ? errors.equipeB : undefined}
                touched={touched.equipeB}
              />
              <FormSelect
                label="Type de match"
                name="typeMatch"
                value={form.typeMatch}
                onChange={handleChange}
                onBlur={handleBlur}
                options={TYPE_MATCH_OPTIONS}
                placeholder="Optionnel…"
                error={touched.typeMatch ? errors.typeMatch : undefined}
                touched={touched.typeMatch}
                className="sm:col-span-2"
              />
            </>
          )}

          {/* Champs conditionnels : Entraînement */}
          {form.type === 'ENTRAINEMENT' && (
            <>
              <FormInput
                label="Objectif"
                name="objectif"
                value={form.objectif}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex : Travail de la passe et du déplacement"
                error={touched.objectif ? errors.objectif : undefined}
                touched={touched.objectif}
                className="sm:col-span-2"
              />
              <FormInput
                label="Durée (minutes)"
                name="duree"
                type="number"
                min="1"
                step="5"
                value={form.duree}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex : 90"
                error={touched.duree ? errors.duree : undefined}
                touched={touched.duree}
                className="sm:col-span-2"
              />
            </>
          )}
        </div>
      </form>
    </Modal>
  )
}
