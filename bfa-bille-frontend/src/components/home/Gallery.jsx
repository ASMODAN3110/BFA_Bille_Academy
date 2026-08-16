import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faCamera,
} from '@fortawesome/free-solid-svg-icons'
import SectionTitle from '../ui/SectionTitle'
import { useScrollAnimation, fadeIn } from '../../hooks/useScrollAnimation'

/* ⚠️ Plus de données mock : la section part vide (aucune photo).
   Sera branchée au backend (module « Galerie »). */
const gallery = []

/* ============================================================
   Gallery — Carrousel de photos
   ------------------------------------------------------------
   - Défilement automatique toutes les 4 s (pause au survol)
   - Navigation manuelle : flèches + points
   ============================================================ */

const AUTO_DELAY = 4000

export default function Gallery() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = gallery.length

  const goTo = useCallback(
    (i) => setIndex(((i % count) + count) % count),
    [count],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Défilement automatique
  useEffect(() => {
    if (paused) return undefined
    const timer = setInterval(next, AUTO_DELAY)
    return () => clearInterval(timer)
  }, [next, paused])

  const current = gallery[index]

  // Section masquée tant qu'aucune photo n'est disponible
  // (la garde se place APRÈS les hooks : un carrousel vide
  // ferait `current.id` sur undefined et un modulo par 0).
  if (count === 0) return null

  return (
    <section id="galerie" className="bg-clair py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Galerie"
          subtitle="Quelques instants de vie du club, en images."
        />

        <motion.div
          ref={ref}
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="overflow-hidden rounded-3xl border border-clair bg-white shadow-2xl shadow-vert/10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-vert">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id}
                src={current.image}
                alt={current.caption}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Légende */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vert-dark/90 to-transparent p-5 md:p-6">
              <p className="flex items-center gap-2 font-semibold text-white">
                <FontAwesomeIcon icon={faCamera} className="h-4 w-4 text-dore" />
                {current.caption}
              </p>
            </div>

            {/* Compteur */}
            <span className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-white">
              {index + 1} / {count}
            </span>
          </div>

          {/* Barre de contrôle */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Photo précédente"
              className="flex h-11 w-11 items-center justify-center rounded-full text-vert transition hover:bg-clair"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
            </button>

            {/* Points */}
            <div className="flex items-center gap-2">
              {gallery.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Aller à la photo ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-8 bg-dore'
                      : 'w-2.5 bg-vert/25 hover:bg-vert/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Photo suivante"
              className="flex h-11 w-11 items-center justify-center rounded-full text-vert transition hover:bg-clair"
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
