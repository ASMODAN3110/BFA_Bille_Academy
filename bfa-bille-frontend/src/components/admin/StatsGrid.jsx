import { motion } from 'framer-motion'
import {
  faBoxOpen,
  faCalendarDays,
  faClipboardList,
  faNewspaper,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import StatCard from './StatCard'
import { dashboardStats } from '../../data/mockData'

/* ============================================================
   StatsGrid — Grille des statistiques récapitulatives (@EF50)
   ------------------------------------------------------------
   - 5 cartes : Joueurs, Articles, Demandes, Événements, Produits
   - 5 colonnes sur grand écran, responsive en dessous
   - Apparition en cascade (0,1 s d'écart entre chaque carte)
   ============================================================ */

const CARDS = [
  { key: 'players', label: 'Joueurs', icon: faUsers, accent: 'bg-vert' },
  {
    key: 'articles',
    label: 'Articles',
    icon: faNewspaper,
    accent: 'bg-dore text-vert-dark',
  },
  {
    key: 'requests',
    label: 'Demandes',
    icon: faClipboardList,
    accent: 'bg-vert-dark',
  },
  {
    key: 'events',
    label: 'Événements',
    icon: faCalendarDays,
    accent: 'bg-dore-dark text-vert-dark',
  },
  { key: 'products', label: 'Produits', icon: faBoxOpen, accent: 'bg-vert-light' },
]

/* Cascade d'apparition : 0,1 s entre chaque carte. */
const statsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export default function StatsGrid() {
  return (
    <motion.div
      variants={statsContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {CARDS.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={dashboardStats[card.key].count}
          subtitle={dashboardStats[card.key].change}
          icon={card.icon}
          accent={card.accent}
        />
      ))}
    </motion.div>
  )
}
