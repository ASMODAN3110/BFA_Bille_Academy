import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faClock, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import SectionTitle from '../ui/SectionTitle'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ⚠️ Plus de données mock : la section part vide (aucun match
   à venir). Sera branchée au backend (module « Calendrier »). */
const matches = []

/* ============================================================
   Matches — Prochains matchs (3)
   ============================================================ */

const formatLongDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function Matches() {
  const { ref, isInView } = useScrollAnimation()

  // Section masquée tant qu'aucun match n'est programmé.
  if (matches.length === 0) return null

  return (
    <section id="matches" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Prochains Matchs"
          subtitle="Venez encourager nos jeunes talents sur le terrain !"
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-3"
        >
          {matches.map((match) => (
            <motion.div key={match.id} variants={staggerItem}>
              <Card variant="elevated" className="flex h-full flex-col p-6">
                {/* Bandeau : type + catégorie */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      match.type === 'Championnat'
                        ? 'bg-dore/15 text-dore-dark'
                        : 'bg-vert/10 text-vert'
                    }`}
                  >
                    {match.type}
                  </span>
                  <span className="rounded-full bg-vert px-3 py-1 text-xs font-bold text-white">
                    {match.category}
                  </span>
                </div>

                {/* Date */}
                <p className="mt-5 flex items-center gap-2 text-sm font-semibold capitalize text-sombre">
                  <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 text-dore-dark" />
                  {formatLongDate(match.date)}
                </p>

                {/* Rencontre */}
                <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-clair px-4 py-4">
                  <span className="flex-1 text-center text-sm font-bold text-sombre">
                    {match.home}
                  </span>
                  <span className="rounded-full bg-vert px-3 py-1 text-xs font-black text-dore">
                    VS
                  </span>
                  <span className="flex-1 text-center text-sm font-bold text-sombre">
                    {match.away}
                  </span>
                </div>

                {/* Heure + lieu */}
                <div className="mt-4 space-y-2 text-sm text-sombre/75">
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-dore-dark" />
                    {match.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapLocationDot} className="h-4 w-4 text-dore-dark" />
                    {match.venue}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-12 text-center">
          <Link
            to="/calendrier"
            className="inline-flex items-center gap-2 font-semibold text-vert underline-offset-4 transition-colors hover:text-dore-dark hover:underline"
          >
            Voir tout le calendrier →
          </Link>
        </p>
      </div>
    </section>
  )
}
