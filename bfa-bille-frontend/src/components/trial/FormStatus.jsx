import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   FormStatus — Message de confirmation / d'erreur du formulaire
   ------------------------------------------------------------
   - status "success" : bandeau vert (#4CAF50) avec ✓
   - status "error"   : bandeau rouge (#E53935) avec ✕
   - Apparition animée (fade-in + scale), aria-live pour les
     lecteurs d'écran.
   - Props optionnelles `title` / `text` pour personnaliser le
     message (les textes par défaut concernent les essais).
   ============================================================ */

const VARIANTS = {
  success: {
    role: 'status',
    icon: faCircleCheck,
    iconClass: 'text-succes',
    containerClass: 'border-succes/30 bg-succes/10',
    title: 'Demande enregistrée !',
    text: 'Votre demande d’essai a bien été envoyée. Notre équipe vous contactera rapidement pour confirmer la date de votre essai.',
  },
  error: {
    role: 'alert',
    icon: faCircleXmark,
    iconClass: 'text-erreur',
    containerClass: 'border-erreur/30 bg-erreur/10',
    title: 'Une erreur est survenue',
    text: 'Votre demande n’a pas pu être enregistrée. Merci de réessayer dans quelques instants.',
  },
}

export default function FormStatus({ status, title, text }) {
  const config = VARIANTS[status]
  if (!config) return null

  const finalTitle = title ?? config.title
  const finalText = text ?? config.text

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        role={config.role}
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`mt-6 flex items-start gap-4 rounded-2xl border-2 p-5 ${config.containerClass}`}
      >
        <FontAwesomeIcon
          icon={config.icon}
          className={`mt-0.5 h-8 w-8 shrink-0 ${config.iconClass}`}
        />
        <div>
          <p className={`font-bold ${config.iconClass}`}>{finalTitle}</p>
          <p className="mt-1 text-sm text-sombre/80">{finalText}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
