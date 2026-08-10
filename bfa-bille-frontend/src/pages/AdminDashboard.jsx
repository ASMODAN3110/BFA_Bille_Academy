import { motion } from 'framer-motion'
import StatsGrid from '../components/admin/StatsGrid'
import RecentRequests from '../components/admin/RecentRequests'
import QuickActions from '../components/admin/QuickActions'
import SystemStatus from '../components/admin/SystemStatus'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminDashboard — Tableau de bord back-office (/admin/dashboard)
   ------------------------------------------------------------
   - Statistiques récapitulatives (@EF50)
   - Demandes d'essai récentes
   - Actions rapides (@EF51) + statut du système
   ============================================================ */

export default function AdminDashboard() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* En-tête de page */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-vert md:text-3xl">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-sombre/60">
          Aperçu de l'activité de l'académie : effectifs, contenus et demandes
          récentes.
        </p>
      </div>

      <StatsGrid />

      <RecentRequests />

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <SystemStatus />
      </div>
    </motion.div>
  )
}
