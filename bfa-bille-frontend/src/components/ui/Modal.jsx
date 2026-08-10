import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   Modal — Fenêtre modale réutilisable
   ------------------------------------------------------------
   - Portail document.body + fond assombri cliquable
   - Fermeture par Échap ou par le bouton ✕
   - Verrouillage du scroll de la page (body overflow hidden)
   - Props : open, onClose, title, subtitle?, children, footer?,
     size ('sm' | 'md' | 'lg' | 'xl')
   ============================================================ */

const SIZE_STYLES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          {/* Fond assombri */}
          <motion.div
            className="fixed inset-0 bg-vert-dark/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panneau */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative z-10 my-8 w-full ${SIZE_STYLES[size]} rounded-2xl bg-white shadow-2xl`}
          >
            {/* En-tête */}
            <div className="flex items-start justify-between gap-4 border-b border-clair px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-sombre">{title}</h2>
                {subtitle && (
                  <p className="mt-0.5 text-sm text-sombre/60">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la fenêtre"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sombre/60 transition hover:bg-clair hover:text-vert"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>

            {/* Corps */}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* Pied */}
            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-3 rounded-b-2xl border-t border-clair bg-clair/40 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
