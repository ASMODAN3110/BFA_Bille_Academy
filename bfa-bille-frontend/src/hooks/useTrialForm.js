import { useState } from 'react'
import { categories } from '../data/mockData'
import { parseLocalDate } from '../utils/dateUtils'

/* ============================================================
   useTrialForm — Logique du formulaire d'inscription aux essais
   ------------------------------------------------------------
   - État local : formData, errors, touched, isSubmitting,
     submitStatus ("idle" | "success" | "error")
   - Validation en temps réel (onChange si erreur déjà affichée,
     onBlur pour marquer le champ comme « touché »)
   - Soumission simulée (setTimeout 1,5 s) + enregistrement dans
     le localStorage (statut "En attente")
   ============================================================ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/

/** Clé localStorage des demandes d'essai. */
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

/* -------------------- Validation par champ ------------------ */
export function validateField(name, value) {
  const v = String(value ?? '').trim()

  switch (name) {
    case 'nom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''

    case 'prenom':
      // Champ optionnel : vide accepté, mais min 2 caractères si rempli.
      if (v === '') return ''
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''

    case 'age': {
      if (v === '') return 'Ce champ est obligatoire.'
      const age = Number(v)
      if (!Number.isInteger(age)) return 'Doit être un nombre entier.'
      if (age < 9 || age > 17) return 'Doit être compris entre 9 et 17 ans.'
      return ''
    }

    case 'categorie':
      if (!v) return 'Veuillez sélectionner une catégorie.'
      if (!categories.includes(v)) return 'Catégorie invalide.'
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
export function validateForm(data) {
  const errors = {}
  for (const key of Object.keys(initialForm)) {
    const error = validateField(key, data[key])
    if (error) errors[key] = error
  }
  return errors
}

/** Date du jour en "YYYY-MM-DD" (local) — pour l'attribut min. */
export function todayISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

export default function useTrialForm() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')

  /* Mise à jour d'un champ + revalidation en temps réel si le
     champ présente déjà une erreur (évite l'erreur avant la
     première interaction). */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  /* Marque le champ comme « touché » et le valide (à la perte de
     focus ou à la soumission). */
  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Marque tous les champs comme touchés + valide l'ensemble.
    const allTouched = Object.keys(initialForm).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)

    const nextErrors = validateForm(formData)
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

    // Soumission simulée (1,5 s) + sauvegarde locale.
    setIsSubmitting(true)
    setSubmitStatus('idle')

    setTimeout(() => {
      try {
        const record = {
          id: Date.now(),
          ...formData,
          statut: 'En attente',
          dateSoumission: new Date().toISOString(),
        }
        const existing = JSON.parse(
          localStorage.getItem(TRIAL_STORAGE_KEY) || '[]',
        )
        existing.push(record)
        localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(existing))
        setSubmitStatus('success')
      } catch {
        setSubmitStatus('error')
      } finally {
        setIsSubmitting(false)
      }
    }, 1500)
  }

  /* Réinitialise entièrement le formulaire. */
  const resetForm = () => {
    setFormData(initialForm)
    setErrors({})
    setTouched({})
    setSubmitStatus('idle')
  }

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    submitStatus,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  }
}
