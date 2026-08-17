import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBagShopping,
  faCalendarDays,
  faFileLines,
  faGaugeHigh,
  faGear,
  faImages,
  faNewspaper,
  faRightFromBracket,
  faTrophy,
  faUserCheck,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import useAuth from '../../hooks/useAuth'
import logo from '../../assets/logo-removebg-preview.png'

/* ============================================================
   Sidebar — Barre latérale du back-office
   ------------------------------------------------------------
   - Fond blanc, liens vers tous les modules de gestion (@EF51),
     lien actif mis en évidence (fond vert + texte doré)
   - Bouton « Déconnexion » en bas de la barre latérale (@EF49)
   - Desktop : colonne fixe ; mobile / tablette : overlay coulissé
     (transition 0,3 s) avec fond assombri cliquable
   ============================================================ */

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: faGaugeHigh },
  { to: '/admin/players', label: 'Équipes', icon: faUsers },
  { to: '/admin/calendar', label: 'Calendrier', icon: faCalendarDays },
  { to: '/admin/trials', label: 'Essais', icon: faUserCheck },
  { to: '/admin/gallery', label: 'Galerie', icon: faImages },
  { to: '/admin/team-sheets', label: 'Fiches techniques', icon: faFileLines },
  { to: '/admin/blog', label: 'Blog', icon: faNewspaper },
  { to: '/admin/results', label: 'Résultats', icon: faTrophy },
  { to: '/admin/shop', label: 'Boutique', icon: faBagShopping },
  { to: '/admin/settings', label: 'Paramètres', icon: faGear },
]

const linkClasses = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200',
    isActive
      ? 'bg-vert text-dore'
      : 'text-sombre/60 hover:bg-clair hover:text-vert',
  ].join(' ')

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()

  const handleLogout = () => {
    onClose()
    logout()
  }

  return (
    <>
      {/* Fond assombri (mobile / tablette) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-vert-dark/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-white text-sombre shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-clair px-5 py-4">
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="Logo BFA Bille Academy"
              className="h-10 w-10 object-contain"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold text-vert">BFA Admin</span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-sombre/50">
                Back-office
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sombre/60 transition hover:bg-clair hover:text-vert lg:hidden"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/dashboard'}
              className={linkClasses}
              onClick={onClose}
            >
              <FontAwesomeIcon icon={item.icon} className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Déconnexion */}
        <div className="border-t border-clair p-4">
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Déconnexion"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-dore px-4 py-2.5 text-sm font-semibold text-dore transition-all duration-300 ease-out hover:bg-dore hover:text-vert-dark active:scale-95"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
