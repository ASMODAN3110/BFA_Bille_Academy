import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormSelect from '../trial/FormSelect'
import FormTextarea from '../trial/FormTextarea'
import FormStatus from '../trial/FormStatus'
import { api } from '../../utils/api'
import { toQuotePayload } from '../../utils/shopAdapter'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/

/* État initial du formulaire, pré-rempli avec le produit choisi. */
const initialForm = (product) => ({
  nom: '',
  email: '',
  telephone: '',
  produit: product?.nom ?? '',
  quantite: '1',
  taille: product?.tailles?.[0] ?? '',
  message: '',
})

/* -------------------- Validation par champ ------------------ */
function validateField(name, value) {
  const v = String(value ?? '').trim()

  switch (name) {
    case 'nom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''

    case 'email':
      if (!v) return 'Ce champ est obligatoire.'
      if (!EMAIL_RE.test(v)) return 'Adresse invalide (ex : exemple@email.com).'
      return ''

    case 'telephone':
      // Champ obligatoire (@EF43).
      if (!v) return 'Ce champ est obligatoire.'
      if (!PHONE_RE.test(v))
        return 'Numéro invalide (ex : +237 690 00 00 00).'
      return ''

    case 'produit':
      if (!v) return 'Veuillez renseigner le produit.'
      return ''

    case 'quantite': {
      if (v === '') return 'Ce champ est obligatoire.'
      const q = Number(v)
      if (!Number.isInteger(q) || q < 1)
        return 'Doit être un nombre entier supérieur ou égal à 1.'
      return ''
    }

    case 'taille':
      if (!v) return 'Veuillez sélectionner une taille.'
      return ''

    case 'message':
      return ''

    default:
      return ''
  }
}

/* ============================================================
   QuoteForm — Modale de demande de devis (boutique)
   ------------------------------------------------------------
   - Modale « toujours montée » : s'ouvre quand `product` est
     non nul, se referme quand il redevient nul (animations
     d'entrée/sortie fiables via AnimatePresence).
   - Champs : nom, email, téléphone (obligatoire), produit
     (pré-rempli), quantité, taille, message.
   - Validation en temps réel, soumission simulée (1,5 s),
     message de succès puis fermeture.
   - Échap + clic sur le fond pour fermer, scroll verrouillé.
   ============================================================ */

export default function QuoteForm({ product, onClose }) {
  const [formData, setFormData] = useState(() => initialForm(product))
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // Réinitialise et pré-remplit le formulaire à chaque ouverture.
  useEffect(() => {
    if (product) {
      setFormData(initialForm(product))
      setErrors({})
      setTouched({})
      setIsSubmitting(false)
      setSubmitStatus('idle')
      setSubmitMessage('')
    }
  }, [product])

  // Touche Échap + verrouillage du scroll de la page.
  useEffect(() => {
    if (!product) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  /* Mise à jour d'un champ + revalidation en temps réel si le
     champ présente déjà une erreur. */
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)

    const nextErrors = Object.keys(formData).reduce((acc, key) => {
      const error = validateField(key, formData[key])
      if (error) acc[key] = error
      return acc
    }, {})
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(formData).find((key) => nextErrors[key])
      if (firstField) {
        const el = document.getElementById(firstField)
        if (el) {
          el.focus()
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }

    // Envoi réel vers POST /api/quotes (@EF42) — téléphone obligatoire
    // validé plus haut (@EF43).
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')
    try {
      await api('/api/quotes', {
        method: 'POST',
        body: toQuotePayload(formData, product.id),
      })
      setSubmitStatus('success')
    } catch (err) {
      setSubmitStatus('error')
      setSubmitMessage(err?.message || "Votre demande n'a pas pu être envoyée.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        >
          {/* Fond assombri */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-vert-dark/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Contenu — fade-in + scale (0,3 s) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Demande de devis pour ${product.nom}`}
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la demande de devis"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sombre shadow-md transition-colors hover:bg-dore hover:text-vert-dark"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            </button>

            <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-dore-dark">
                Demande de devis
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-vert">
                {product.nom}
              </h3>
              <p className="mt-1 text-sm text-sombre/60">
                Renseignez vos coordonnées : notre équipe vous recontactera
                rapidement pour finaliser votre commande.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    className="sm:col-span-2"
                    label="Nom complet"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Votre nom et prénom"
                    error={errors.nom}
                    touched={touched.nom}
                    required
                    autoFocus
                  />

                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="exemple@email.com"
                    error={errors.email}
                    touched={touched.email}
                    required
                  />

                  <FormInput
                    label="Téléphone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+237 690 00 00 00"
                    error={errors.telephone}
                    touched={touched.telephone}
                    required
                  />

                  <FormInput
                    className="sm:col-span-2"
                    label="Produit"
                    name="produit"
                    value={formData.produit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.produit}
                    touched={touched.produit}
                  />

                  <FormInput
                    label="Quantité"
                    name="quantite"
                    type="number"
                    min="1"
                    value={formData.quantite}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.quantite}
                    touched={touched.quantite}
                    required
                  />

                  <FormSelect
                    label="Taille"
                    name="taille"
                    value={formData.taille}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={product.tailles ?? []}
                    error={errors.taille}
                    touched={touched.taille}
                    required
                  />

                  <FormTextarea
                    className="sm:col-span-2"
                    label="Message (optionnel)"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Précisez vos besoins (personnalisation, livraison…)"
                    rows={3}
                    error={errors.message}
                    touched={touched.message}
                  />
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={isSubmitting}
                  className="mt-6 w-full"
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="h-4 w-4 animate-spin"
                      />
                      Envoi en cours…
                    </>
                  ) : (
                    'Envoyer la demande'
                  )}
                </Button>

                {submitStatus !== 'idle' && (
                  <FormStatus
                    status={submitStatus}
                    title={
                      submitStatus === 'success'
                        ? 'Demande de devis envoyée !'
                        : submitStatus === 'error'
                          ? "Échec de l'envoi"
                          : undefined
                    }
                    text={
                      submitStatus === 'success'
                        ? 'Votre demande de devis a été envoyée. Notre équipe vous recontactera rapidement pour établir votre devis.'
                        : submitStatus === 'error'
                          ? submitMessage
                          : undefined
                    }
                  />
                )}

                {submitStatus === 'success' && (
                  <div className="mt-4 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="px-8"
                    >
                      Fermer
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
