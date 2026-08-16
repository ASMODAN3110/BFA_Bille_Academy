import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormSelect from '../trial/FormSelect'
import { categories } from '../../data/categories'

/* ============================================================
   PlayerForm — Formulaire ajout / modification d'un joueur
   ------------------------------------------------------------
   - Modale (Modal) avec validation des champs
   - Props : open, onClose, onSave(playerData), player (ou null)
   ============================================================ */

const STATUSES = ['Actif', 'MVP', 'Blessé']
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
  poste: '',
  age: '',
  categorie: '',
  statut: 'Actif',
  photo: '',
  dateArrivee: '',
}

function validateField(name, value) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'nom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'prenom':
      if (v === '') return ''
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'poste':
      if (!v) return 'Ce champ est obligatoire.'
      return ''
    case 'age': {
      if (v === '') return 'Ce champ est obligatoire.'
      const age = Number(v)
      if (!Number.isInteger(age)) return 'Doit être un nombre entier.'
      if (age < 5 || age > 19) return 'Doit être compris entre 5 et 19 ans.'
      return ''
    }
    case 'categorie':
      if (!v) return 'Veuillez sélectionner une catégorie.'
      return ''
    case 'dateArrivee':
      return ''
    default:
      return ''
  }
}

export default function PlayerForm({ open, onClose, onSave, player }) {
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
            poste: player.poste,
            age: String(player.age),
            categorie: player.categorie,
            statut: player.statut ?? 'Actif',
            photo: player.photo ?? '',
            dateArrivee: player.dateArrivee ?? '',
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

    const photo = form.photo.trim()
    onSave({
      id: player?.id ?? Date.now(),
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      poste: form.poste.trim(),
      age: Number(form.age),
      categorie: form.categorie,
      statut: form.statut,
      photo:
        photo ||
        `https://i.pravatar.cc/400?img=${(Date.now() % 60) + 1}`,
      dateArrivee: form.dateArrivee || undefined,
      stats: player?.stats ?? { matches: 0, buts: 0, passes: 0 },
    })
  }

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
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : Martin"
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
            placeholder="Ex : Léo"
            error={touched.prenom ? errors.prenom : undefined}
            touched={touched.prenom}
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
          <FormInput
            label="Âge"
            name="age"
            type="number"
            min="5"
            max="19"
            value={form.age}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : 16"
            required
            error={touched.age ? errors.age : undefined}
            touched={touched.age}
          />
          <FormSelect
            label="Catégorie"
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            onBlur={handleBlur}
            options={categories}
            placeholder="Sélectionnez la catégorie…"
            required
            error={touched.categorie ? errors.categorie : undefined}
            touched={touched.categorie}
          />
          <FormSelect
            label="Statut"
            name="statut"
            value={form.statut}
            onChange={handleChange}
            onBlur={handleBlur}
            options={STATUSES}
            error={touched.statut ? errors.statut : undefined}
            touched={touched.statut}
          />
          <FormInput
            label="Photo (URL)"
            name="photo"
            value={form.photo}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://…"
            error={touched.photo ? errors.photo : undefined}
            touched={touched.photo}
          />
          <FormInput
            label="Date d’arrivée"
            name="dateArrivee"
            type="date"
            value={form.dateArrivee}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.dateArrivee ? errors.dateArrivee : undefined}
            touched={touched.dateArrivee}
          />
        </div>
      </form>
    </Modal>
  )
}
