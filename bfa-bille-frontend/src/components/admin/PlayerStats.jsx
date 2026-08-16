import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol, faUsers } from '@fortawesome/free-solid-svg-icons'
import StatCard from './StatCard'
import { useCategories } from '../../hooks/useCategories'

/* ============================================================
   PlayerStats — Statistiques des joueurs (admin)
   ------------------------------------------------------------
   - Total + une carte par catégorie (GET /api/categories) —
     le statut (Actif/MVP/Blessé) n'existe plus côté backend.
   ============================================================ */

const statsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const ACCENTS = ['bg-succes', 'bg-dore', 'bg-erreur', 'bg-vert']

export default function PlayerStats({ players }) {
  const { categories } = useCategories()
  const total = players.length

  const cards = [
    {
      label: 'Total joueurs',
      value: total,
      subtitle: 'toutes catégories',
      icon: faUsers,
      accent: 'bg-vert',
    },
    ...categories.map((cat, i) => ({
      label: cat.nom,
      value: players.filter((p) => p.categorie?.id === cat.id).length,
      subtitle: `${cat.ageMin}–${cat.ageMax} ans`,
      icon: faFutbol,
      accent: ACCENTS[i % ACCENTS.length],
    })),
  ]

  return (
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
  )
}
