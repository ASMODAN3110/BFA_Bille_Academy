import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   Breadcrumb — Fil d'ariane réutilisable
   ------------------------------------------------------------
   items = [{ label, href? }, ...]
   - Les items avec `href` (sauf le dernier) sont des liens.
   - Le dernier item est non cliquable et affiché en doré.
   - Séparateurs dorés « › » entre les niveaux.
   ============================================================ */

export default function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav
      aria-label="Fil d'ariane"
      className={`flex flex-wrap items-center text-sm ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={`${item.label}-${index}`} className="flex items-center">
            {index > 0 && (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mx-2 h-3 w-3 shrink-0 text-dore"
              />
            )}

            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="font-medium text-sombre/60 transition-colors hover:text-vert"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? 'page' : undefined}
                className={
                  isLast
                    ? 'font-bold text-dore-dark'
                    : 'font-medium text-sombre/60'
                }
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
