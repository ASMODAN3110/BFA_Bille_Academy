import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarXmark } from '@fortawesome/free-solid-svg-icons'
import EventCard from './EventCard'
import {
  useScrollAnimation,
  staggerContainer,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   EventsList — Liste des événements du mois affiché
   ------------------------------------------------------------
   Filtres déjà appliqués en amont ; apparition en cascade
   (stagger) au scroll. État vide si aucun événement.
   ============================================================ */

export default function EventsList({ events, monthLabel, onSelect }) {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })

  return (
    <div className="flex h-full flex-col">
      {/* En-tête */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-vert md:text-xl">
          Événements du mois
        </h3>
        <span className="rounded-full bg-dore px-3 py-1 text-xs font-bold text-vert-dark">
          {events.length}
        </span>
      </div>
      <p className="-mt-2 mb-4 text-sm text-sombre/50">{monthLabel}</p>

      {events.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-dore/40 bg-white p-10 text-center">
          <FontAwesomeIcon
            icon={faCalendarXmark}
            className="h-12 w-12 text-dore/60"
          />
          <p className="mt-4 font-semibold text-sombre">
            Aucun événement pour ce mois
          </p>
          <p className="mt-1 text-sm text-sombre/60">
            Modifiez les filtres ou changez de mois.
          </p>
        </div>
      ) : (
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-4"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} onSelect={onSelect} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
