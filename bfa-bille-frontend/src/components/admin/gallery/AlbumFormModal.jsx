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
   - Champs : titre, description, thème, date de création,
     image de couverture (URL)
   - La gestion des médias se fait via <MediaUploadModal />
   - Validation à la soumission (titre, thème, date obligatoires)
   - Props : open, onClose, onSave(data), album (null = création)
   ============================================================ */

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop'

const emptyForm = {
  titre: '',
  description: '',
  theme: '',
  date: '',
  coverImage: '',
}

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
    case 'date':
      if (!v) return 'Ce champ est obligatoire.'
      return ''
    default:
      return ''
  }
}

export default function AlbumFormModal({ open, onClose, onSave, album }) {
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
            date: album.dateCreation ?? '',
            coverImage: album.coverImage ?? '',
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
      id: album?.id ?? Date.now(),
      titre: form.titre.trim(),
      description: form.description.trim(),
      theme: form.theme,
      dateCreation: form.date,
      coverImage: form.coverImage.trim() || DEFAULT_COVER,
      medias: album?.medias ?? [],
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
          <FormInput
            label="Date de création"
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
            label="Image de couverture (URL)"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://…"
            error={touched.coverImage ? errors.coverImage : undefined}
            touched={touched.coverImage}
            className="sm:col-span-2"
          />
        </div>
      </form>
    </Modal>
  )
}
