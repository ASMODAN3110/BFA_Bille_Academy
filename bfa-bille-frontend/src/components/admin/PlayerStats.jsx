import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBandage,
  faCircleCheck,
  faMedal,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import StatCard from './StatCard'
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation'
import { categories } from '../../data/categories'

/* ============================================================
   PlayerStats — Statistiques des joueurs (admin)
   ------------------------------------------------------------
   - Total, Actifs, MVP, Blessés
   - Répartition par catégorie (barres de progression)
   ============================================================ */

const statsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export default function PlayerStats({ players }) {
  const total = players.length
  const actifs = players.filter((p) => p.statut === 'Actif').length
  const mvp = players.filter((p) => p.statut === 'MVP').length
  const blesses = players.filter((p) => p.statut === 'Blessé').length

  const cards = [
    {
      label: 'Total joueurs',
      value: total,
      subtitle: 'toutes catégories',
      icon: faUsers,
      accent: 'bg-vert',
    },
    {
      label: 'Actifs',
      value: actifs,
      subtitle: 'disponibles',
      icon: faCircleCheck,
      accent: 'bg-succes',
    },
    {
      label: 'MVP',
      value: mvp,
      subtitle: 'joueurs clés',
      icon: faMedal,
      accent: 'bg-dore text-vert-dark',
    },
    {
      label: 'Blessés',
      value: blesses,
      subtitle: 'indisponibles',
      icon: faBandage,
      accent: 'bg-erreur',
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        variants={statsContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sombre/50">
            Répartition par catégorie
          </h3>
          <div className="mt-4 space-y-4">
            {categories.map((cat) => {
              const count = players.filter((p) => p.categorie === cat).length
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={cat}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-sombre">{cat}</span>
                    <span className="text-sombre/60">
                      {count} joueur{count > 1 ? 's' : ''} · {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-clair">
                    <motion.div
                      className="h-full rounded-full bg-vert"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
