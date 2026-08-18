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
   - Liens rapides
   - Coordonnées (adresse, téléphone, email)
   - Réseaux sociaux
   ============================================================ */

const SOCIAL_ICONS = {
  'facebook-f': faFacebookF,
  instagram: faInstagram,
  'x-twitter': faXTwitter,
  youtube: faYoutube,
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-vert-dark text-white">
      <div className="mx-auto max-w-7xl mt-10 pl-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + description + réseaux */}
          <div className="lg:col-span-2 lg:pr-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo BFA Bille Academy"
                className="h-14 w-14 object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold text-dore">BFA Bille</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  Football Academy
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-dore/50 text-dore transition-all duration-300 hover:bg-dore hover:text-vert-dark"
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-dore">
              Liens rapides
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 transition-colors hover:text-dore"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  className="text-white/70 transition-colors hover:text-dore"
                >
                  Back-office
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-dore">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faMapLocationDot}
                  className="mt-1 h-4 w-4 shrink-0 text-dore"
                />
                <span>{club.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4 shrink-0 text-dore" />
                <a href={`tel:${club.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-dore">
                  {club.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-4 w-4 shrink-0 text-dore"
                />
                <a
                  href={`mailto:${club.email}`}
                  className="break-all transition-colors hover:text-dore"
                >
                  {club.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre copyright */}
        <div className="border-t border-white/10 text-center text-xs text-white/50">
          <p>
            © {year} {club.name}. Tous droits réservés. — « {club.tagline} »
          </p>
        </div>
      </div>
    </footer>
  )
}
