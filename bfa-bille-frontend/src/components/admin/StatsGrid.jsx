import { motion } from 'framer-motion'
import {
  faBoxOpen,
  faCalendarDays,
  faClipboardList,
  faNewspaper,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import StatCard from './StatCard'

/* ============================================================
   StatsGrid — Grille des statistiques récapitulatives (@EF50)
   ------------------------------------------------------------
   - 5 cartes : Joueurs, Articles, Demandes, Événements, Produits
   - Les valeurs viennent de l'API GET /admin/dashboard (Module 9) :
     l'objet `data` est GROUPÉ par module (players/articles/trials/
     events/products avec compteurs imbriqués) → chaque carte lit
     `s?.<module>?.<compteur>`. Aucun adapter nécessaire pour les
     5 cartes.
   - 5 colonnes sur grand écran, responsive en dessous
   - Apparition en cascade (0,1 s d'écart entre chaque carte)
   ============================================================ */

const CARDS = [
  {
    key: 'players',
    label: 'Joueurs',
    icon: faUsers,
    accent: 'bg-vert',
    value: (s) => s?.players?.total ?? 0,
    subtitle: (s) => `${s?.players?.byCategory?.length ?? 0} catégorie(s)`,
  },
  {
    key: 'articles',
    label: 'Articles',
    icon: faNewspaper,
    accent: 'bg-dore text-vert-dark',
    value: (s) => s?.articles?.total ?? 0,
    subtitle: (s) => `${s?.articles?.published ?? 0} publié(s)`,
  },
  {
    key: 'trials',
    label: 'Demandes',
    icon: faClipboardList,
    accent: 'bg-vert-dark',
    value: (s) => s?.trials?.total ?? 0,
    subtitle: (s) => `${s?.trials?.pending ?? 0} en attente`,
  },
  {
    key: 'events',
    label: 'Événements',
    icon: faCalendarDays,
    accent: 'bg-dore-dark text-vert-dark',
    value: (s) => s?.events?.total ?? 0,
    subtitle: (s) => `${s?.events?.upcoming ?? 0} à venir`,
  },
  {
    key: 'products',
    label: 'Produits',
    icon: faBoxOpen,
    accent: 'bg-vert-light',
    value: (s) => s?.products?.total ?? 0,
    subtitle: (s) => `${s?.products?.outOfStock ?? 0} en rupture`,
  },
]

/* Cascade d'apparition : 0,1 s entre chaque carte. */
const statsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export default function StatsGrid({ stats }) {
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
          value={card.value(stats)}
          subtitle={card.subtitle(stats)}
          icon={card.icon}
          accent={card.accent}
        />
      ))}
    </motion.div>
  )
}
