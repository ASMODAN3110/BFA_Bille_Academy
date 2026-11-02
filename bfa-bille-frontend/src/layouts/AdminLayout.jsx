import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../components/admin/Sidebar'
import { TAB_ITEMS, findNavEntry } from '../components/admin/adminNav'
import useAuth from '../hooks/useAuth'
import { api } from '../utils/api'

/* ============================================================
   AdminLayout — Layout protégé du back-office
   ------------------------------------------------------------
   - Sidebar groupée (fixe sur desktop, tiroir sur mobile / tablette)
   - En-tête : bouton menu (mobile), fil d'Ariane, avatar
   - Mobile : barre d'onglets en bas (Accueil, Joueurs, Agenda, Essais,
     Plus) — « Plus » ouvre le menu complet
   - Pastille « essais en attente » alimentée par GET /admin/dashboard
   - Le contenu des pages admin s'affiche via <Outlet />
   - La route parente est protégée par <ProtectedRoute> (@EF48)
   ============================================================ */

const tabClasses = ({ isActive }) =>
  `relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
    isActive ? 'font-semibold text-vert' : 'text-sombre/70'
  }`

function initials(user) {
  const source = (user?.nom || user?.email || 'A').trim()
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('')
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pending, setPending] = useState(0)
  const { user } = useAuth()
  const { pathname } = useLocation()
  const entry = findNavEntry(pathname)

  useEffect(() => {
    let active = true
    api('/admin/dashboard', { auth: true })
      .then((d) => {
        if (active) setPending(d?.data?.trials?.pending ?? 0)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-[#f4f7f5]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pending={pending} />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* En-tête */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e3ede6] bg-white/95 px-4 py-2.5 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e3ede6] text-sombre transition hover:bg-menthe lg:hidden"
          >
            <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
          </button>
          <nav aria-label="Fil d'Ariane" className="min-w-0 truncate text-sm text-sombre/70">
            {entry.group && (
              <>
                {entry.group}
                <span className="mx-1.5">/</span>
              </>
            )}
            <b className="font-semibold text-[#14231a]">{entry.label}</b>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right text-xs leading-tight sm:block">
              <p className="font-semibold text-[#14231a]">{user?.nom || 'Administrateur'}</p>
              <p className="text-sombre/65">{user?.role === 'SUPER_ADMIN' ? 'Super admin' : 'Admin'}</p>
            </div>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-menthe text-sm font-bold text-vert-dark"
              aria-hidden="true"
            >
              {initials(user)}
            </span>
          </div>
        </header>

        {/* Page courante */}
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Barre d'onglets mobile */}
      <nav
        aria-label="Navigation rapide"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[#e3ede6] bg-white px-1 pb-[env(safe-area-inset-bottom)] pt-1 lg:hidden"
      >
        {TAB_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={tabClasses}>
            <span className="relative">
              <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
              {item.badge === 'trials' && pending > 0 && (
                <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-dore px-1 text-center text-[10px] font-bold leading-4 text-[#3d2f05]">
                  {pending}
                </span>
              )}
            </span>
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-sombre/70"
        >
          <FontAwesomeIcon icon={faEllipsis} className="h-5 w-5" />
          Plus
        </button>
      </nav>
    </div>
  )
}
