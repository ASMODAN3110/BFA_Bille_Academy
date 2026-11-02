import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGear,
  faRightFromBracket,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import useAuth from '../../hooks/useAuth'
import logo from '../../assets/logo-removebg-preview.png'
import { NAV_GROUPS, SETTINGS_ITEM } from './adminNav'

/* ============================================================
   Sidebar — Barre latérale du back-office
   ------------------------------------------------------------
   - Liens regroupés par domaine (Sportif, Recrutement, Contenu &
     boutique), lien actif en pastille verte (@EF51)
   - Pastille dorée : demandes d'essai en attente (prop `pending`)
   - Bouton « Déconnexion » en bas de la barre latérale (@EF49)
   - Desktop : colonne fixe ; mobile / tablette : tiroir coulissé
     (transition 0,3 s) avec fond assombri cliquable
   ============================================================ */

const linkClasses = ({ isActive }) =>
  [
    'flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium transition-colors duration-200',
    isActive ? 'bg-vert text-white' : 'text-sombre/80 hover:bg-menthe hover:text-vert-dark',
  ].join(' ')

export default function Sidebar({ open, onClose, pending = 0 }) {
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[17.5rem] max-w-[85vw] shrink-0 flex-col border-r border-[#e3ede6] bg-white text-sombre shadow-2xl transition-transform duration-300 lg:w-64 lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menu d'administration"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Logo BFA Bille Academy" className="h-10 w-10 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold text-[#14231a]">Bille Academy</span>
              <span className="text-xs text-sombre/70">Back-office</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-sombre/75 transition hover:bg-menthe hover:text-vert lg:hidden"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Modules">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className="space-y-0.5">
              {group.label && (
                <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-sombre/65">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  className={linkClasses}
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge === 'trials' && pending > 0 && (
                    <span className="rounded-full bg-dore px-2 text-xs font-bold leading-5 text-[#3d2f05]">
                      {pending}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Paramètres + déconnexion */}
        <div className="space-y-1 border-t border-[#e3ede6] p-3">
          <NavLink to={SETTINGS_ITEM.to} className={linkClasses} onClick={onClose}>
            <FontAwesomeIcon icon={faGear} className="h-4 w-4 shrink-0" />
            {SETTINGS_ITEM.label}
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Déconnexion"
            className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium text-sombre/80 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4 shrink-0" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
