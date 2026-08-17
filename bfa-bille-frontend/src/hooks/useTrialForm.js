import { useState } from 'react'
import { parseLocalDate } from '../utils/dateUtils'
import { api } from '../utils/api'

/* ============================================================
   useTrialForm — Logique du formulaire d'inscription aux essais
   ------------------------------------------------------------
   - État local : formData, errors, touched, isSubmitting,
     submitStatus ("idle" | "success" | "error"), submitError
   - Validation en temps réel (onChange si erreur déjà affichée,
     onBlur pour marquer le champ comme « touché »)
   - Soumission réelle : POST /api/trials (public, sans token) —
     plus de localStorage ni de setTimeout simulé
   - Catégories transmises en paramètre (objets { id, nom, ageMin,
     ageMax } via useCategories() dans TrialForm) : la cohérence
     âge ↔ catégorie est vérifiée, et l'âge 11-12 (non couvert)
     est refusé à la validation (miroir du backend).
   - TRIAL_STORAGE_KEY : conservée pour la migration optionnelle
     des anciennes demandes du localStorage (AdminTrials).
   ============================================================ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/

/** Clé localStorage des anciennes demandes d'essai (migration). */
export const TRIAL_STORAGE_KEY = 'bfa_trial_registrations'

export const initialForm = {
  nom: '',
  prenom: '',
  age: '',
  categorie: '',
  telephone: '',
  email: '',
  dateEssai: '',
  message: '',
}

/* -------------------- Mapping vers le payload backend ------------------ */

/** Payload attendu par POST /api/trials. */
export function toTrialPayload(f) {
  return {
    nomJoueur: String(f.nom ?? '').trim(),
    prenomJoueur: String(f.prenom ?? '').trim(),
    age: Number(f.age),
    telephone: String(f.telephone ?? '').trim(),
    email: String(f.email ?? '').trim(),
    dateEssai: f.dateEssai,
    message: String(f.message ?? '').trim() || null,
  }
}

/* -------------------- Helpers catégories ------------------ */

/** Catégorie couvrant un âge (ou undefined). */
function findCategoryForAge(age, categories) {
  return categories.find((c) => age >= c.ageMin && age <= c.ageMax)
}

/** Incohérence âge ↔ catégorie sélectionnée → message, sinon ''. */
function categorieCoherenceError(ageValue, categorieNom, categories) {
  const age = Number(ageValue)
  if (!Number.isInteger(age) || !categorieNom || categories.length === 0) return ''
  const cat = categories.find((c) => c.nom === categorieNom)
  if (!cat) return ''
  if (age < cat.ageMin || age > cat.ageMax) {
    return `L'âge (${age} ans) ne correspond pas à la catégorie ${cat.nom} (${cat.ageMin}-${cat.ageMax} ans).`
  }
  return ''
}

/* -------------------- Validation par champ ------------------ */
export function validateField(name, value, categories = []) {
  const v = String(value ?? '').trim()

  switch (name) {
    case 'nom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''

    case 'prenom':
      // Obligatoire depuis le module 3 (contrat POST /api/trials).
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''

    case 'age': {
      if (v === '') return 'Ce champ est obligatoire.'
      const age = Number(v)
      if (!Number.isInteger(age)) return 'Doit être un nombre entier.'
      if (age < 9 || age > 17) return 'Doit être compris entre 9 et 17 ans.'
      // Aucune catégorie ne couvre l'âge (ex. trou 11-12) → refusé à
      // la validation pour éviter le 400 du backend au submit.
      if (categories.length > 0 && !findCategoryForAge(age, categories)) {
        return `L'âge indiqué (${age} ans) ne correspond à aucune catégorie existante.`
      }
      return ''
    }

    case 'categorie':
      if (!v) return 'Veuillez sélectionner une catégorie.'
      if (!categories.some((c) => c.nom === v)) return 'Catégorie invalide.'
      return ''

    case 'telephone':
      if (!v) return 'Ce champ est obligatoire.'
      if (!PHONE_RE.test(v))
        return 'Numéro invalide (ex : +237 690 00 00 00).'
      return ''

    case 'email':
      if (!v) return 'Ce champ est obligatoire.'
      if (!EMAIL_RE.test(v)) return 'Adresse invalide (ex : exemple@email.com).'
      return ''

    case 'dateEssai': {
      if (!v) return 'Ce champ est obligatoire.'
      const date = parseLocalDate(v)
      if (Number.isNaN(date.getTime())) return 'Date invalide.'
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (date < today) return 'La date doit être dans le futur.'
      return ''
    }

    case 'message':
      return ''

    default:
      return ''
  }
}

/** Valide l'ensemble du formulaire → objet { champ: message }. */
export function validateForm(data, categories = []) {
  const errors = {}
  for (const key of Object.keys(initialForm)) {
    const error = validateField(key, data[key], categories)
    if (error) errors[key] = error
  }
  // Cohérence croisée âge ↔ catégorie (l'erreur va sur « catégorie »).
  const coherence = categorieCoherenceError(data.age, data.categorie, categories)
  if (coherence) errors.categorie = coherence
  return errors
}

/** Date du jour en "YYYY-MM-DD" (local) — pour l'attribut min. */
export function todayISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

export default function useTrialForm(categories = []) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  /* Revalide la catégorie dès qu'un des deux champs croisés
     (âge / catégorie) change, une fois la catégorie « touchée ».
     La cohérence prime sur l'erreur de base. */
  const resyncCategorie = (age, categorieNom) => {
    const coherence = categorieCoherenceError(age, categorieNom, categories)
    setErrors((prev) => ({
      ...prev,
      categorie: coherence || validateField('categorie', categorieNom, categories),
    }))
  }

  /* Mise à jour d'un champ + revalidation en temps réel si le
     champ présente déjà une erreur (évite l'erreur avant la
     première interaction). */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, categories),
      }))
    }

    // L'âge change → la catégorie sélectionnée peut devenir incohérente.
    if (touched.categorie && (name === 'age' || name === 'categorie')) {
      const nextCategorie = name === 'categorie' ? value : formData.categorie
      const nextAge = name === 'age' ? value : formData.age
      resyncCategorie(nextAge, nextCategorie)
    }
  }

  /* Marque le champ comme « touché » et le valide (à la perte de
     focus ou à la soumission). */
  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, categories),
    }))

    if (name === 'age' || name === 'categorie') {
      const nextCategorie = name === 'categorie' ? value : formData.categorie
      const nextAge = name === 'age' ? value : formData.age
      resyncCategorie(nextAge, nextCategorie)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Marque tous les champs comme touchés + valide l'ensemble.
    const allTouched = Object.keys(initialForm).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)

    const nextErrors = validateForm(formData, categories)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      // Focus sur le premier champ invalide.
      const firstField = Object.keys(initialForm).find((k) => nextErrors[k])
      if (firstField) {
        const el = document.getElementById(firstField)
        if (el) {
          el.focus()
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }

    // Soumission réelle : POST /api/trials (public, sans token).
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError('')
    try {
      await api('/api/trials', { method: 'POST', body: toTrialPayload(formData) })
      setFormData(initialForm)
      setErrors({})
      setTouched({})
      setSubmitStatus('success')
    } catch (err) {
      setSubmitStatus('error')
      setSubmitError(err?.message || "Votre demande n'a pas pu être enregistrée.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* Réinitialise entièrement le formulaire (bouton « Envoyer une
     autre demande ») → retour à l'état idle. */
  const resetForm = () => {
    setFormData(initialForm)
    setErrors({})
    setTouched({})
    setSubmitStatus('idle')
    setSubmitError('')
  }

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    submitStatus,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  }
}
