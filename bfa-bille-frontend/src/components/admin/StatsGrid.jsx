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
     `s?.<module>?.<compteur>`.
   - `tone` colore la pastille de détail : « warn » s'il y a quelque
     chose à traiter, « bad » pour les ruptures de stock
   - 2 colonnes sur mobile, 5 sur grand écran ; cascade d'apparition
   ============================================================ */

const CARDS = [
  {
    key: 'players',
    label: 'Joueurs',
    icon: faUsers,
    value: (s) => s?.players?.total ?? 0,
    subtitle: (s) => `${s?.players?.byCategory?.length ?? 0} catégorie(s)`,
  },
  {
    key: 'articles',
    label: 'Articles',
    icon: faNewspaper,
    value: (s) => s?.articles?.total ?? 0,
    subtitle: (s) => `${s?.articles?.published ?? 0} publié(s)`,
  },
  {
    key: 'trials',
    label: 'Demandes',
    icon: faClipboardList,
    value: (s) => s?.trials?.total ?? 0,
    subtitle: (s) => `${s?.trials?.pending ?? 0} en attente`,
    tone: (s) => ((s?.trials?.pending ?? 0) > 0 ? 'warn' : 'default'),
  },
  {
    key: 'events',
    label: 'Événements',
    icon: faCalendarDays,
    value: (s) => s?.events?.total ?? 0,
    subtitle: (s) => `${s?.events?.upcoming ?? 0} à venir`,
  },
  {
    key: 'products',
    label: 'Produits',
    icon: faBoxOpen,
    value: (s) => s?.products?.total ?? 0,
    subtitle: (s) => `${s?.products?.outOfStock ?? 0} en rupture`,
    tone: (s) => ((s?.products?.outOfStock ?? 0) > 0 ? 'bad' : 'default'),
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
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5"
    >
      {CARDS.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={card.value(stats)}
          subtitle={card.subtitle(stats)}
          icon={card.icon}
          tone={card.tone?.(stats)}
        />
      ))}
    </motion.div>
  )
}
