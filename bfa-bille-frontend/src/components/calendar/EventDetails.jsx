import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faCalendar,
  faClock,
  faMapLocationDot,
  faLayerGroup,
  faFutbol,
  faShieldHalved,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons'
import { parseLocalDate, formatDateLong } from '../../utils/dateUtils'

/* ============================================================
   EventDetails — Modale de détails d'un événement
   ------------------------------------------------------------
   Titre, date complète, horaire, lieu, catégorie et type.
   Fermeture : bouton ✕, clic sur le fond, touche Échap.
   Ouverture / fermeture animées (fade-in + scale).
   ============================================================ */

const TYPE_STYLE = {
  Match: 'bg-dore/15 text-dore-dark',
  'Entraînement': 'bg-vert/10 text-vert',
}

export default function EventDetails({ event, onClose }) {
  // Touche Échap + verrouillage du scroll de la page
  useEffect(() => {
    if (!event) return undefined

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [event, onClose])

  return (
    <AnimatePresence>
      {event && (
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
            aria-label={`Détails de l'événement ${event.titre}`}
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Bandeau */}
            <div className="relative bg-vert px-6 py-6 md:px-8">
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer les détails"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-dore hover:text-vert-dark"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${TYPE_STYLE[event.type] ?? 'bg-white/15 text-white'}`}
              >
                {event.type}
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">
                {event.titre}
              </h3>
            </div>

            {/* Détails */}
            <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
              <div className="rounded-xl bg-clair p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sombre/50">
                  <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 text-dore-dark" />
                  Date
                </p>
                <p className="mt-2 font-bold capitalize text-sombre">
                  {formatDateLong(parseLocalDate(event.date))}
                </p>
              </div>

              <div className="rounded-xl bg-clair p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sombre/50">
                  <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-dore-dark" />
                  Horaire
                </p>
                <p className="mt-2 font-bold text-sombre">{event.heure}</p>
              </div>

              <div className="rounded-xl bg-clair p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sombre/50">
                  <FontAwesomeIcon icon={faMapLocationDot} className="h-4 w-4 text-dore-dark" />
                  Lieu
                </p>
                <p className="mt-2 font-bold text-sombre">{event.lieu}</p>
              </div>

              <div className="rounded-xl bg-clair p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sombre/50">
                  <FontAwesomeIcon icon={faLayerGroup} className="h-4 w-4 text-dore-dark" />
                  Catégorie
                </p>
                <p className="mt-2 font-bold text-sombre">{event.categorie}</p>
              </div>

              {/* Détails selon le type : MATCH → équipes, ENTRAINEMENT → objectif */}
              {event.type === 'Match' && (
                <div className="rounded-xl bg-dore/10 p-4 md:col-span-2">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sombre/50">
                    <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4 text-dore-dark" />
                    Rencontre
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-extrabold text-sombre">
                      {event.equipeA || '—'}{' '}
                      <span className="text-dore-dark">vs</span>{' '}
                      {event.equipeB || '—'}
                    </p>
                    <div className="flex items-center gap-2">
                      {event.typeMatch && (
                        <span className="rounded-full bg-dore px-3 py-1 text-xs font-bold text-vert-dark">
                          {event.typeMatch === 'CHAMPIONNAT'
                            ? 'Championnat'
                            : 'Amical'}
                        </span>
                      )}
                      {event.scoreA != null && event.scoreB != null && (
                        <span className="rounded-full bg-vert px-3 py-1 text-xs font-bold text-white">
                          {event.scoreA} – {event.scoreB}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {event.type === 'Entraînement' && (
                <div className="rounded-xl bg-vert/10 p-4 md:col-span-2">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sombre/50">
                    <FontAwesomeIcon icon={faBullseye} className="h-4 w-4 text-vert" />
                    Entraînement
                  </p>
                  {event.objectif ? (
                    <p className="mt-2 text-sm font-medium text-sombre">
                      {event.objectif}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-sombre/60">
                      Objectif non précisé.
                    </p>
                  )}
                  {event.duree != null && (
                    <p className="mt-2 text-sm font-bold text-vert">
                      Durée : {event.duree} min
                    </p>
                  )}
                </div>
              )}

              {/* Rappel */}
              <div className="flex items-center gap-3 rounded-xl bg-vert p-4 text-white md:col-span-2">
                <FontAwesomeIcon icon={faFutbol} className="h-6 w-6 shrink-0 text-dore" />
                <p className="text-sm text-white/90">
                  Venez nombreux encourager nos jeunes talents — {event.titre} !
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
