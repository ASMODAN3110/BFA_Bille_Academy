import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleNotch,
  faMinus,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormTextarea from '../trial/FormTextarea'
import FormStatus from '../trial/FormStatus'
import { api } from '../../utils/api'
import { toQuotePayload } from '../../utils/shopAdapter'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/

const initialForm = { nom: '', email: '', telephone: '', message: '' }

const formatPrice = (value) =>
  Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' FCFA'

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
      if (!PHONE_RE.test(v)) return 'Numéro invalide (ex : +237 690 00 00 00).'
      return ''

    default:
      return ''
  }
}

/* ------------------- Une ligne de la sélection ------------------ */
function QuoteLine({ item, onUpdate, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-[#e3ede6] bg-white p-3.5">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#cfe6d6] to-menthe">
        {item.image && !imageFailed && (
          <img
            src={item.image}
            alt=""
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1 basis-40">
        <p className="break-words font-semibold text-[#14231a]">{item.nom}</p>
        <p className="text-sm text-sombre/70">{formatPrice(item.prix)} l&rsquo;unité</p>
      </div>

      {/* Taille : liste si plusieurs choix, sinon simple texte */}
      {item.tailles.length > 1 ? (
        <select
          aria-label={`Taille de ${item.nom}`}
          value={item.taille}
          onChange={(e) => onUpdate(item.key, { taille: e.target.value })}
          className="min-h-10 rounded-xl border-2 border-clair bg-white px-3 text-sm text-sombre focus:border-dore focus:outline-none focus:ring-2 focus:ring-dore/40"
        >
          {item.tailles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      ) : (
        item.taille && <span className="text-sm text-sombre/70">Taille : {item.taille}</span>
      )}

      {/* Quantité */}
      <div className="inline-flex items-center rounded-xl border-2 border-clair">
        <button
          type="button"
          onClick={() => onUpdate(item.key, { quantite: item.quantite - 1 })}
          disabled={item.quantite <= 1}
          aria-label={`Diminuer la quantité de ${item.nom}`}
          className="flex h-10 w-10 items-center justify-center rounded-l-[10px] text-vert transition-colors hover:bg-clair disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="999"
          value={item.quantite}
          onChange={(e) => onUpdate(item.key, { quantite: e.target.value })}
          aria-label={`Quantité de ${item.nom}`}
          className="h-10 w-14 border-x-2 border-clair bg-white text-center text-sm font-semibold tabular-nums text-sombre [appearance:textfield] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dore/40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onUpdate(item.key, { quantite: item.quantite + 1 })}
          aria-label={`Augmenter la quantité de ${item.nom}`}
          className="flex h-10 w-10 items-center justify-center rounded-r-[10px] text-vert transition-colors hover:bg-clair"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.key)}
        aria-label={`Retirer ${item.nom} du devis`}
        className="flex h-10 w-10 items-center justify-center rounded-full text-erreur/80 transition-colors hover:bg-erreur/10 hover:text-erreur"
      >
        <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4" />
      </button>
    </li>
  )
}

/* ============================================================
   QuoteForm — Fenêtre « Mon devis » : tous les articles choisis + un seul formulaire
   ------------------------------------------------------------
   - Modale « toujours montée » : s'ouvre quand `open` est vrai
     (animations d'entrée/sortie via AnimatePresence).
   - Haut : la sélection (taille, quantité, retrait de chaque article,
     total indicatif) ; bas : coordonnées du client (nom, e-mail,
     téléphone obligatoire, message).
   - Envoi : POST /api/quotes avec une ligne par article → UN devis,
     UN e-mail. Après succès, la sélection est vidée (`onSent`).
   - Validation en temps réel, sans focus automatique ni erreur sur un
     champ resté vide avant l'envoi.
   - Échap + clic sur le fond pour fermer, scroll verrouillé.
   ============================================================ */

export default function QuoteForm({ open, items, onUpdate, onRemove, onClose, onSent }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle') // 'idle' | 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('')
  const [sentCount, setSentCount] = useState(0)

  const total = items.reduce((sum, i) => sum + i.prix * i.quantite, 0)

  /* Fermeture : après un envoi réussi, on repart d'un formulaire neuf. */
  const handleClose = () => {
    if (submitStatus === 'success') {
      setFormData(initialForm)
      setErrors({})
      setTouched({})
      setSubmitStatus('idle')
      setSubmitMessage('')
    }
    onClose()
  }

  // Touche Échap + verrouillage du scroll de la page.
  useEffect(() => {
    if (!open) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
    // handleClose dépend de l'état d'envoi : on le relit à chaque rendu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submitStatus, onClose])

  /* Mise à jour d'un champ + revalidation en temps réel si le
     champ présente déjà une erreur. */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  /* Marque le champ comme « touché » et le valide à la perte de focus. */
  const handleBlur = (e) => {
    const { name, value } = e.target

    // Champ jamais renseigné et laissé vide : pas d'erreur « obligatoire »
    // avant l'envoi (sinon cliquer d'un champ à l'autre déclenche des erreurs).
    if (!String(value ?? '').trim() && !touched[name]) return

    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setTouched({ nom: true, email: true, telephone: true, message: true })
    const nextErrors = ['nom', 'email', 'telephone'].reduce((acc, key) => {
      const error = validateField(key, formData[key])
      if (error) acc[key] = error
      return acc
    }, {})
    setErrors(nextErrors)

    const firstField = ['nom', 'email', 'telephone'].find((key) => nextErrors[key])
    if (firstField) {
      const el = document.getElementById(firstField)
      if (el) {
        el.focus()
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    if (items.length === 0) {
      setSubmitStatus('error')
      setSubmitMessage('Ajoutez au moins un article à votre devis.')
      return
    }

    // Envoi réel vers POST /api/quotes (@EF42) — un devis, une ligne par article.
    // Téléphone obligatoire validé plus haut (@EF43).
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')
    try {
      await api('/api/quotes', {
        method: 'POST',
        body: toQuotePayload(formData, items),
      })
      setSentCount(items.length)
      setSubmitStatus('success')
      onSent()
    } catch (err) {
      setSubmitStatus('error')
      setSubmitMessage(err?.message || "Votre demande n'a pas pu être envoyée.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
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
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Contenu — fade-in + scale (0,3 s) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mon devis"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fermer la demande de devis"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sombre shadow-md transition-colors hover:bg-dore hover:text-vert-dark"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            </button>

            <div className="max-h-[88vh] overflow-y-auto p-6 md:p-8">
              {submitStatus === 'success' ? (
                /* ---- Confirmation ---- */
                <div className="py-4 text-center">
                  <FormStatus
                    status="success"
                    title="Demande de devis envoyée !"
                    text={`Votre demande de devis pour ${sentCount} article${sentCount > 1 ? 's' : ''} a été envoyée. Notre équipe vous recontactera rapidement pour établir votre devis.`}
                  />
                  <Button type="button" variant="outline" size="md" onClick={handleClose} className="mt-6">
                    Fermer
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-dore-dark">
                    Demande de devis
                  </p>
                  <h3 className="mt-1 font-display text-4xl font-bold leading-none text-[#14231a]">
                    Mon devis
                  </h3>
                  <p className="mt-2 text-sm text-sombre/75">
                    Réglez la taille et la quantité de chaque article, puis renseignez vos
                    coordonnées : une seule demande pour tout votre devis.
                  </p>

                  {/* ---- Articles ---- */}
                  <h4 className="mt-6 text-sm font-bold uppercase tracking-wider text-vert">
                    Vos articles ({items.length})
                  </h4>
                  {items.length === 0 ? (
                    <div className="mt-3 rounded-2xl border border-dashed border-dore/40 px-5 py-8 text-center">
                      <p className="font-semibold text-[#14231a]">Votre devis est vide.</p>
                      <p className="mt-1 text-sm text-sombre/75">
                        Ajoutez des produits depuis la boutique pour demander un devis.
                      </p>
                      <Button type="button" variant="primary" size="sm" onClick={handleClose} className="mt-4">
                        Choisir des produits
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ul className="mt-3 flex flex-col gap-3">
                        {items.map((item) => (
                          <QuoteLine key={item.key} item={item} onUpdate={onUpdate} onRemove={onRemove} />
                        ))}
                      </ul>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="font-semibold text-[#0f6b33] transition-colors hover:text-vert"
                        >
                          + Ajouter d&rsquo;autres produits
                        </button>
                        <p className="text-sombre/80">
                          Total indicatif :{' '}
                          <span className="font-display text-xl font-extrabold tabular-nums text-vert">
                            {formatPrice(total)}
                          </span>
                        </p>
                      </div>
                    </>
                  )}

                  {/* ---- Coordonnées ---- */}
                  <form onSubmit={handleSubmit} noValidate className="mt-7">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-vert">
                      Vos coordonnées
                    </h4>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting || items.length === 0}
                      className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <FontAwesomeIcon icon={faCircleNotch} className="h-4 w-4 animate-spin" />
                          Envoi en cours…
                        </>
                      ) : (
                        `Envoyer ma demande${items.length > 0 ? ` (${items.length} article${items.length > 1 ? 's' : ''})` : ''}`
                      )}
                    </Button>

                    {submitStatus === 'error' && (
                      <FormStatus status="error" title="Échec de l'envoi" text={submitMessage} />
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
