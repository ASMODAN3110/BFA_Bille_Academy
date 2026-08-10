import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   MediaModal — Modale d'affichage des médias d'un album
   ------------------------------------------------------------
   - Coquille générique : fond assombri + boîte animée + bouton ✕
   - Le contenu (grille de médias) est passé via `children`
   - Toujours montée (l'animation de sortie fonctionne)
   ============================================================ */

export default function MediaModal({
  isOpen,
  onClose,
  label = 'Médias de l’album',
  maxWidth = 'max-w-3xl',
  children,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
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

          {/* Contenu */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} overflow-hidden rounded-3xl bg-white shadow-2xl`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer l'album"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-vert text-white shadow-lg transition-colors hover:bg-vert-dark"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
