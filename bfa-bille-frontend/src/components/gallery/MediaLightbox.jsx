import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   MediaLightbox — Visionneuse plein écran des médias
   ------------------------------------------------------------
   - Photos et vidéos (lecteur <video> intégré)
   - Navigation par flèches + indicateur de progression (1/15)
   - Rendu dans un portail (document.body) pour passer au-dessus
     de la modale (z-[90] > z-[70])
   - Toujours montée : l'animation de sortie fonctionne
   - Le clavier (Échap / flèches) est géré par AlbumDetails
   ============================================================ */

export default function MediaLightbox({
  open,
  medias = [],
  index = 0,
  onClose,
  onNavigate,
}) {
  const media = medias[index]
  const count = medias.length

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de médias"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex flex-col bg-vert-dark/95 backdrop-blur-sm"
        >
          {/* Barre supérieure */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la visionneuse"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-dore hover:text-vert-dark"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            </button>
          </div>

          {/* Média + navigation desktop */}
          <div className="flex flex-1 items-center justify-center gap-2 px-4 md:gap-4">
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              aria-label="Média précédent"
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-dore hover:text-vert-dark sm:flex"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
            </button>

            <div className="relative flex max-h-[68vh] w-full max-w-4xl items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={media ? media.id : 'empty'}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex max-h-[68vh] w-full items-center justify-center"
                >
                  {media ? (
                    media.type === 'video' ? (
                      <video
                        src={media.url}
                        controls
                        playsInline
                        autoPlay
                        className="max-h-[68vh] w-full rounded-xl bg-black shadow-2xl"
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={`Média ${index + 1}`}
                        className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                      />
                    )
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(1)}
              aria-label="Média suivant"
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-dore hover:text-vert-dark sm:flex"
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
            </button>
          </div>

          {/* Légende + navigation mobile */}
          <div className="flex items-center justify-center gap-4 px-4 py-4">
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              aria-label="Média précédent"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-dore hover:text-vert-dark sm:hidden"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
            </button>
            <span className="text-sm text-white/80">
              {media ? (media.type === 'video' ? 'Vidéo' : 'Photo') : ''}
            </span>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              aria-label="Média suivant"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-dore hover:text-vert-dark sm:hidden"
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
