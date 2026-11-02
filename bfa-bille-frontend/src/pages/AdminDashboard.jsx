import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatsGrid from '../components/admin/StatsGrid'
import RecentRequests from '../components/admin/RecentRequests'
import RecentArticles from '../components/admin/RecentArticles'
import UpcomingEvents from '../components/admin/UpcomingEvents'
import ActivityTimeline from '../components/admin/ActivityTimeline'
import QuickActions from '../components/admin/QuickActions'
import PageHeader from '../components/admin/PageHeader'
import {
  CategoryDonut,
  TrialStatusBar,
  TrialsByMonthChart,
} from '../components/admin/DashboardCharts'
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
     recentArticles/upcomingEvents).
   - Bandeau « À traiter » (essais en attente, produits en rupture),
     chiffres clés, graphiques (essais par mois, joueurs par
     catégorie, statut des demandes), puis listes récentes (@EF51).
   ============================================================ */

function AttentionBanner({ stats }) {
  const pending = stats?.trials?.pending ?? 0
  const outOfStock = stats?.products?.outOfStock ?? 0
  const links = []
  if (pending > 0)
    links.push({ to: '/admin/trials', text: `${pending} demande${pending > 1 ? 's' : ''} d'essai en attente` })
  if (outOfStock > 0)
    links.push({ to: '/admin/shop', text: `${outOfStock} produit${outOfStock > 1 ? 's' : ''} en rupture` })
  if (links.length === 0) return null

  return (
    <section
      aria-label="À traiter"
      className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl border border-[#efdca0] bg-[#fff8e1] px-4 py-3 text-sm text-[#5c470c]"
    >
      <span className="font-semibold">À traiter aujourd'hui</span>
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className="inline-flex min-h-9 items-center border-b border-[#c9a63a] hover:text-[#3d2f05]"
        >
          {l.text}
        </Link>
      ))}
    </section>
  )
}

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
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Tableau de bord"
        subtitle="Aperçu de l'activité de l'académie : effectifs, contenus et demandes récentes."
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Impossible de charger les statistiques — {error}
        </div>
      ) : stats === null ? (
        <div className="rounded-2xl border border-[#e3ede6] bg-white px-4 py-8 text-center text-sm text-sombre/75">
          Chargement des statistiques…
        </div>
      ) : (
        <>
          <AttentionBanner stats={stats} />
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <TrialsByMonthChart data={stats.trials?.byMonth ?? []} />
            </div>
            <div className="space-y-4 sm:space-y-6 xl:col-span-2">
              <CategoryDonut data={stats.players?.byCategory ?? []} />
              <TrialStatusBar trials={stats.trials} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 2xl:grid-cols-2">
            <RecentRequests />
            <RecentArticles articles={stats.recentArticles ?? []} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 2xl:grid-cols-2">
            <UpcomingEvents events={stats.upcomingEvents ?? []} />
            <ActivityTimeline />
          </div>
        </>
      )}

      <QuickActions />
    </motion.div>
  )
}
