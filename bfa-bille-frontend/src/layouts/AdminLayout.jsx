import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../components/admin/Sidebar'

/* ============================================================
   AdminLayout — Layout protégé du back-office
   ------------------------------------------------------------
   - Sidebar (fixe sur desktop, overlay hamburger sur mobile /
     tablette) + en-tête admin (titre, avatar, déconnexion)
   - Le contenu des pages admin s'affiche via <Outlet />
   - La route parente est protégée par <ProtectedRoute> (@EF48)
   ============================================================ */

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-clair">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenu principal (décalé à droite de la sidebar fixe sur desktop) */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Page courante */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Bouton menu mobile : la sidebar est masquée sous lg, il faut un accès */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Ouvrir le menu"
        className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-vert text-dore shadow-lg transition hover:bg-vert-dark active:scale-95 lg:hidden"
      >
        <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
      </button>
    </div>
  )
}
