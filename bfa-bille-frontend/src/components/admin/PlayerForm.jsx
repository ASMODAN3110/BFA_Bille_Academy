import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormSelect from '../trial/FormSelect'
import MediaUploadField from '../ui/MediaUploadField'
import { useCategories } from '../../hooks/useCategories'
import { getAge } from '../../utils/ageUtils'

/* ============================================================
   PlayerForm — Formulaire ajout / modification d'un joueur
   ------------------------------------------------------------
   - Modale (Modal) avec validation des champs.
   - Champs envoyés au backend : nom, prenom, dateNaissance,
     poste, categorieId, photo (null si vide). Pas d'âge, de
     statut, de stats ni de dateArrivee (le backend les ignore).
   - Validation miroir du backend (âge 9-17, tranche de
     catégorie [ageMin, ageMax], prénom obligatoire ≥2).
   - ⚠️ Trou : 11-12 ans n'appartient à aucune catégorie.
   - Props : open, onClose, onSave(playerData), player (ou null),
     serverError (message d'erreur renvoyé par le backend).
   ============================================================ */

const POSTES = [
  'Gardien',
  'Défenseur central',
  'Latéral gauche',
  'Latéral droit',
  'Milieu défensif',
  'Milieu central',
  'Milieu offensif',
  'Ailier droit',
  'Ailier gauche',
  'Attaquant',
]

const emptyForm = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  poste: '',
  categorie: '',
  photo: '',
}

/* Validation miroir du backend (messages exacts @EF4/@EF5). */
function validateField(name, value, categories) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'nom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'prenom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'dateNaissance': {
      if (!v) return 'Ce champ est obligatoire.'
      if (Number.isNaN(Date.parse(v))) return 'Date invalide.'
      if (new Date(v).getTime() > Date.now())
        return 'La date de naissance doit être dans le passé.'
      const age = getAge(v)
      if (age < 9)
        return "L'âge minimum pour intégrer l'académie est de 9 ans."
      if (age > 17)
        return "L'âge maximum pour intégrer l'académie est de 17 ans."
      return ''
    }
    case 'poste':
      if (!v) return 'Ce champ est obligatoire.'
      return ''
    case 'categorie':
      if (!v) return 'Veuillez sélectionner une catégorie.'
      return ''
    case 'photo':
      return ''
    default:
      return ''
  }
}

export default function PlayerForm({
  open,
  onClose,
  onSave,
  player,
  serverError = null,
}) {
  const { categories } = useCategories()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Prépare le formulaire à chaque ouverture (ajout ou modification).
  // « new » sert de sentinelle pour l'ajout (player === null) :
  // sans lui, la préparation se relancerait à chaque rendu (boucle).
  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (player ? player.id : 'new')) {
    setOpenedFor(player ? player.id : 'new')
    setForm(
      player
        ? {
            nom: player.nom,
            prenom: player.prenom ?? '',
            dateNaissance: player.dateNaissance
              ? player.dateNaissance.slice(0, 10)
              : '',
            poste: player.poste,
            categorie:
              player.categorieId != null ? String(player.categorieId) : '',
            photo: player.photo ?? '',
          }
        : emptyForm,
    )
    setErrors({})
    setTouched({})
  }
  if (!open && openedFor !== null) setOpenedFor(null)

  // Âge calculé + catégorie sélectionnée (vérification de tranche @EF4).
  const age =
    form.dateNaissance && !Number.isNaN(Date.parse(form.dateNaissance))
      ? getAge(form.dateNaissance)
      : null
  const selectedCategory = categories.find(
    (c) => String(c.id) === form.categorie,
  )
  const ageCategoryError =
    age != null &&
    selectedCategory &&
    (age < selectedCategory.ageMin || age > selectedCategory.ageMax)
      ? "L'âge du joueur ne correspond pas à la catégorie sélectionnée."
      : null
  const ageTrou = age === 11 || age === 12

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, categories) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, categories) }))
  }

  // Renseigné par le champ média (upload MinIO → URL publique).
  const setPhoto = (value) => setForm((prev) => ({ ...prev, photo: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const allTouched = Object.keys(emptyForm).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)
    const nextErrors = {}
    for (const key of Object.keys(emptyForm)) {
      const error = validateField(key, form[key], categories)
      if (error) nextErrors[key] = error
    }
    if (ageCategoryError && !nextErrors.categorie) {
      nextErrors.categorie = ageCategoryError
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      dateNaissance: form.dateNaissance,
      poste: form.poste.trim(),
      categorieId: Number(form.categorie),
      photo: form.photo.trim() || null,
    })
  }

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.nom,
  }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={player ? 'Modifier le joueur' : 'Ajouter un joueur'}
      subtitle={
        player
          ? 'Mettez à jour les informations de l’académicien.'
          : 'Renseignez les informations du nouvel académicien.'
      }
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="player-form" variant="primary" size="sm">
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="player-form" onSubmit={handleSubmit} noValidate>
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
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : Ngassa"
            required
            error={touched.nom ? errors.nom : undefined}
            touched={touched.nom}
          />
          <FormInput
            label="Prénom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : Yann"
            required
            error={touched.prenom ? errors.prenom : undefined}
            touched={touched.prenom}
          />
          <div>
            <FormInput
              label="Date de naissance"
              name="dateNaissance"
              type="date"
              value={form.dateNaissance}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={touched.dateNaissance ? errors.dateNaissance : undefined}
              touched={touched.dateNaissance}
            />
            {age != null && (
              <p className="mt-1.5 text-xs text-sombre/60">
                Âge calculé : <span className="font-bold text-vert">{age} ans</span>
                {ageTrou && (
                  <span className="mt-1 block text-erreur">
                    ⚠️ Les 11-12 ans ne correspondent à aucune catégorie (U9 9-10
                    · U15 13-15 · U17 16-17).
                  </span>
                )}
              </p>
            )}
          </div>
          <FormSelect
            label="Catégorie"
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            onBlur={handleBlur}
            options={categoryOptions}
            placeholder="Sélectionnez la catégorie…"
            required
            error={
              touched.categorie || touched.dateNaissance
                ? errors.categorie || ageCategoryError || undefined
                : undefined
            }
            touched={touched.categorie}
          />
          <FormSelect
            label="Poste"
            name="poste"
            value={form.poste}
            onChange={handleChange}
            onBlur={handleBlur}
            options={POSTES}
            placeholder="Sélectionnez le poste…"
            required
            error={touched.poste ? errors.poste : undefined}
            touched={touched.poste}
          />
          <MediaUploadField
            label="Photo"
            name="photo"
            value={form.photo}
            onChange={setPhoto}
            onBlur={handleBlur}
            dossier="joueurs"
            error={touched.photo ? errors.photo : undefined}
            touched={touched.photo}
          />
        </div>
      </form>
    </Modal>
  )
}
