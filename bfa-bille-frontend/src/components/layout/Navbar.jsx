import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { navLinks } from '../../data/mockData'
import logo from '../../assets/logo-removebg-preview.png'

/* ============================================================
   Navbar — Barre de navigation sticky
   ------------------------------------------------------------
   - Logo + nom du club (lien vers l'accueil)
   - Liens de navigation (état actif en doré)
   - Bouton Back-office (masqué en variante "public", ex : page
     de connexion)
   - Menu burger pour mobile / tablette
   ============================================================ */

const linkClasses = ({ isActive }) =>
  [
    'px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
    isActive ? 'text-dore-dark' : 'text-sombre/80 hover:text-vert',
  ].join(' ')

export default function Navbar({ variant = 'default' }) {
  const [open, setOpen] = useState(false)
  const isPublic = variant === 'public'

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-clair shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + nom */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Logo BFA Bille Academy"
            className="h-11 w-11 object-contain"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold text-vert">BFA Bille</span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-dore-dark">
              Football Academy
            </span>
          </span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClasses}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isPublic && (
            <Link
              to="/admin"
              className="hidden items-center gap-2 rounded-full border-2 border-dore px-4 py-2 text-sm font-semibold text-dore-dark transition-all duration-300 hover:bg-dore hover:text-vert-dark md:inline-flex"
            >
              <FontAwesomeIcon icon={faUserTie} className="h-3.5 w-3.5" />
              Back-office
            </Link>
          )}

          {/* Burger mobile */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-vert transition hover:bg-clair lg:hidden"
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? 'max-h-[32rem] border-t border-clair' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-vert text-white'
                      : 'text-sombre/80 hover:bg-clair hover:text-vert'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {!isPublic && (
            <li className="mt-2 border-t border-clair pt-3">
              <Link
                to="/admin"
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-lg bg-dore px-4 py-2.5 text-sm font-semibold text-vert-dark"
              >
                <FontAwesomeIcon icon={faUserTie} className="h-4 w-4" />
                Back-office
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}
