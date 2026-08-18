import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StatsGrid from '../components/admin/StatsGrid'
import RecentRequests from '../components/admin/RecentRequests'
import RecentArticles from '../components/admin/RecentArticles'
import UpcomingEvents from '../components/admin/UpcomingEvents'
import ActivityTimeline from '../components/admin/ActivityTimeline'
import QuickActions from '../components/admin/QuickActions'
import { api } from '../utils/api'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminDashboard — Tableau de bord back-office (/admin/dashboard)
   ------------------------------------------------------------
   - Statistiques récapitulatives (@EF50) issues de l'API
     GET /admin/dashboard (protégée : Bearer token). Sur 401,
     le wrapper purge la session et redirige vers /admin.
   - Module 9 : l'objet `data` est GROUPÉ par module
     (players/articles/trials/events/products + recentTrials/
     recentArticles/upcomingEvents). StatsGrid lit les compteurs
     imbriqués ; les sections « récentes » viennent du même appel.
   - Demandes d'essai récentes + derniers articles + prochains
     événements + timeline d'activité + actions rapides (@EF51).
   ============================================================ */

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    api('/admin/dashboard', { auth: true })
      .then((data) => {
        if (active) setStats(data?.data ?? null)
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Erreur de chargement.')
      })
    return () => {
      active = false
    }
  }, [])

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

      {/* Statistiques réelles (GET /admin/dashboard) */}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Impossible de charger les statistiques — {error}
        </div>
      ) : stats === null ? (
        <div className="rounded-2xl border border-clair bg-white px-4 py-8 text-center text-sm text-sombre/50">
          Chargement des statistiques…
        </div>
      ) : (
        <>
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RecentRequests />
            <RecentArticles articles={stats.recentArticles ?? []} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <UpcomingEvents events={stats.upcomingEvents ?? []} />
            <ActivityTimeline />
          </div>
        </>
      )}

      <QuickActions />
    </motion.div>
  )
}
