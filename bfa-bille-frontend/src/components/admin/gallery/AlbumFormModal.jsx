import { useState } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import FormInput from '../../trial/FormInput'
import FormSelect from '../../trial/FormSelect'
import FormTextarea from '../../trial/FormTextarea'
import { GALLERY_THEMES } from './ThemeFilter'

/* ============================================================
   AlbumFormModal — Création / modification d'un album (@EF22)
   ------------------------------------------------------------
   - Champs : titre, description, thème. Pas de date ni de
     couverture (le backend fixe dateCreation et les médias se
     gèrent via MediaUploadModal).
   - Body envoyé au backend : { titre, description?, theme }.
   - Validation à la soumission (titre ≥ 3, thème obligatoire) ;
     les messages 400 du backend sont affichés via `serverError`.
   - Props : open, onClose, onSave(data), album (null = création),
     serverError
   ============================================================ */

const emptyForm = {
  titre: '',
  description: '',
  theme: '',
}

/* Validation miroir du backend (messages exacts). */
function validateField(name, value) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'titre':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 3) return 'Doit contenir au moins 3 caractères.'
      return ''
    case 'theme':
      if (!v) return 'Veuillez sélectionner un thème.'
      return ''
    default:
      return ''
  }
}

export default function AlbumFormModal({
  open,
  onClose,
  onSave,
  album,
  serverError = null,
}) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  /* Réinitialise le formulaire à chaque ouverture (sentinelle 'new'
     pour rester sûr en mode ajout / objet null). */
  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (album ? album.id : 'new')) {
    setOpenedFor(album ? album.id : 'new')
    setForm(
      album
        ? {
            titre: album.titre,
            description: album.description ?? '',
            theme: album.theme,
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
      titre: form.titre.trim(),
      description: form.description.trim() || null,
      theme: form.theme,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={album ? "Modifier l'album" : 'Créer un album'}
      subtitle={
        album
          ? 'Mettez à jour les informations de l’album.'
          : 'Renseignez les informations du nouvel album.'
      }
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="album-form" variant="primary" size="sm">
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="album-form" onSubmit={handleSubmit} noValidate>
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
            placeholder="Ex : Tournoi de fin d’année"
            required
            error={touched.titre ? errors.titre : undefined}
            touched={touched.titre}
            className="sm:col-span-2"
          />
          <FormTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Description courte de l’album…"
            rows={2}
            error={touched.description ? errors.description : undefined}
            touched={touched.description}
            className="sm:col-span-2"
          />
          <FormSelect
            label="Thème"
            name="theme"
            value={form.theme}
            onChange={handleChange}
            onBlur={handleBlur}
            options={GALLERY_THEMES}
            placeholder="Sélectionnez le thème…"
            required
            error={touched.theme ? errors.theme : undefined}
            touched={touched.theme}
          />
        </div>
      </form>
    </Modal>
  )
}
