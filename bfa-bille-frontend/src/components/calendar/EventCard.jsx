import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import { parseLocalDate, formatDate } from '../../utils/dateUtils'
import { staggerItem } from '../../hooks/useScrollAnimation'

/* ============================================================
   EventCard — Carte d'un événement (cliquable)
   ------------------------------------------------------------
   Badge date (jour + mois), titre, horaire, lieu,
   et badges type (Match = doré / Training = vert) + catégorie.
   ============================================================ */

const TYPE_CHIP = {
  Match: 'bg-dore/15 text-dore-dark',
  'Entraînement': 'bg-vert/10 text-vert',
}

export default function EventCard({ event, onSelect }) {
  const date = parseLocalDate(event.date)
  const day = String(date.getDate()).padStart(2, '0')
  const monthShort = formatDate(date).split(' ')[1]

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(event)
    }
  }

  return (
    <motion.div variants={staggerItem}>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => onSelect(event)}
        onKeyDown={handleKeyDown}
        aria-label={`Détails de l'événement ${event.titre}`}
        className="group cursor-pointer transition-shadow duration-300 hover:shadow-xl"
      >
        <div className="flex items-center gap-4 p-4">
          {/* Badge date */}
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-vert text-white shadow-md shadow-vert/20">
            <span className="text-2xl font-black leading-none text-dore">{day}</span>
            <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider">
              {monthShort}
            </span>
          </div>

          {/* Infos */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold text-sombre transition-colors group-hover:text-vert">
              {event.titre}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-sombre/60">
              <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5 text-dore-dark" />
              {event.heure}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-sombre/60">
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className="h-3.5 w-3.5 text-dore-dark"
              />
              <span className="truncate">{event.lieu}</span>
            </p>
          </div>

          {/* Badges */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span
              className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${TYPE_CHIP[event.type] ?? 'bg-clair text-sombre'}`}
            >
              {event.type}
            </span>
            <span className="rounded-full bg-clair px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-sombre">
              {event.categorie}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
