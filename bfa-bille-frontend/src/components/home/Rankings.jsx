import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import SectionTitle from '../ui/SectionTitle'
import { rankings } from '../../data/mockData'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   Rankings — Classements Top 3 (U9, U15, U17)
   ============================================================ */

const POSITION_BADGE = {
  1: 'bg-dore text-vert-dark',
  2: 'bg-vert text-white',
  3: 'bg-clair text-sombre border border-clair',
}

export default function Rankings() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="classements" className="bg-clair py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Classements"
          subtitle="La hiérarchie actuelle dans les trois catégories de l'académie."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-3"
        >
          {rankings.map((table) => (
            <motion.div key={table.category} variants={staggerItem}>
              <Card variant="elevated" className="overflow-hidden">
                {/* En-tête */}
                <div className="flex items-center justify-between bg-vert px-6 py-4">
                  <h3 className="text-xl font-extrabold text-dore">
                    {table.category}
                  </h3>
                  <span className="flex items-center gap-2 rounded-full bg-dore px-3 py-1 text-xs font-bold text-vert-dark">
                    <FontAwesomeIcon icon={faTrophy} className="h-3 w-3" />
                    Top 3
                  </span>
                </div>

                {/* Lignes */}
                <ul className="divide-y divide-clair">
                  {table.teams.map((team) => (
                    <li
                      key={`${table.category}-${team.position}`}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${POSITION_BADGE[team.position]}`}
                      >
                        {team.position}
                      </span>
                      <span className="flex-1 truncate text-sm font-semibold text-sombre">
                        {team.name}
                      </span>
                      <span className="text-sm font-black text-dore-dark">
                        {team.points}
                        <span className="ml-1 text-xs font-medium text-sombre/50">
                          pts
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
