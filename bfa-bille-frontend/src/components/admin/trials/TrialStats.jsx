import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faUserClock,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'
import StatCard from '../StatCard'
import { staggerContainer } from '../../../hooks/useScrollAnimation'

/* ============================================================
   TrialStats — Cartes statistiques des demandes d'essai (admin)
   ------------------------------------------------------------
   - Total, En attente, Confirmés, Refusés (@EF20)
   - Icône colorée + tendance en % du total
   - Apparition en cascade (staggerContainer)
   ============================================================ */

export default function TrialStats({ trials }) {
  const total = trials.length
  const counts = { 'En attente': 0, Confirmé: 0, Refusé: 0 }
  trials.forEach((t) => {
    if (counts[t.statut] !== undefined) counts[t.statut] += 1
  })

  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0)

  const stats = [
    {
      label: 'Total',
      value: total,
      subtitle: 'Candidatures reçues',
      icon: faUsers,
      accent: 'bg-vert',
    },
    {
      label: 'En attente',
      value: counts['En attente'],
      subtitle: `${pct(counts['En attente'])} % du total`,
      icon: faUserClock,
      accent: 'bg-orange-500',
    },
    {
      label: 'Confirmés',
      value: counts.Confirmé,
      subtitle: `${pct(counts.Confirmé)} % du total`,
      icon: faCircleCheck,
      accent: 'bg-succes',
    },
    {
      label: 'Refusés',
      value: counts.Refusé,
      subtitle: `${pct(counts.Refusé)} % du total`,
      icon: faCircleXmark,
      accent: 'bg-erreur',
    },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </motion.div>
  )
}
