import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faMapLocationDot,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { club, navLinks, socialLinks } from '../../config/site'
import logo from '../../assets/logo-removebg-preview.png'

/* ============================================================
   Footer — Pied de page
   ------------------------------------------------------------
   - Logo + description du club
   - Liens rapides (dont le lien Back-office, masqué en variante
     "public") : il appelle `onOpenLogin` (modale de connexion, ou
     tableau de bord si déjà connecté — géré par AppShell)
   - Coordonnées (adresse, téléphone, email)
   - Réseaux sociaux
   ============================================================ */

const SOCIAL_ICONS = {
  'facebook-f': faFacebookF,
  instagram: faInstagram,
  'x-twitter': faXTwitter,
  youtube: faYoutube,
}

export default function Footer({ variant = 'default', onOpenLogin }) {
  const year = new Date().getFullYear()
  const isPublic = variant === 'public'

  const openBackOffice = (e) => {
    e.preventDefault()
    onOpenLogin?.()
  }

  return (
    <footer className="border-t-4 border-dore bg-menthe text-sombre">
      <div className="mx-auto max-w-7xl mt-5 pl-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + description + réseaux */}
          <div className="lg:col-span-2 lg:pr-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo BFA Bille Academy"
                loading="lazy"
                className="h-14 w-14 object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold text-vert">BFA Bille</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sombre/80">
                  Football Academy
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-sombre/75">
              {club.description}
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-vert/40 text-vert transition-all duration-300 hover:bg-vert hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={SOCIAL_ICONS[social.icon]}
                    className="h-4 w-4"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-dore-dark">
              Liens rapides
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {navLinks.slice(0, 7).map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sombre/75 transition-colors hover:text-vert"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!isPublic && (
                <li>
                  <Link
                    to="/admin"
                    onClick={openBackOffice}
                    className="text-sombre/75 transition-colors hover:text-vert"
                  >
                    Back-office
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-dore-dark">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-sombre/75">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faMapLocationDot}
                  className="mt-1 h-4 w-4 shrink-0 text-vert"
                />
                <span>{club.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4 shrink-0 text-vert" />
                <a href={`tel:${club.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-vert">
                  {club.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-4 w-4 shrink-0 text-vert"
                />
                <a
                  href={`mailto:${club.email}`}
                  className="break-all transition-colors hover:text-vert"
                >
                  {club.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre copyright */}
        <div className="mt-10 border-t border-vert/20 py-5 text-center text-xs text-sombre/75">
          <p>
            © {year} {club.name}. Tous droits réservés. — « {club.tagline} »
          </p>
        </div>
      </div>
    </footer>
  )
}
