import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   BlogSearch — Recherche d'articles
   ------------------------------------------------------------
   - Recherche par titre ou auteur (logique gérée par la page)
   - Props : value, onChange, placeholder
   ============================================================ */

export default function BlogSearch({
  value,
  onChange,
  placeholder = 'Rechercher un article (titre ou auteur)…',
}) {
  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sombre/40"
      />
      <input
        type="search"
        name="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher un article"
        className="w-full rounded-xl border-2 border-clair bg-white py-3 pl-11 pr-4 text-sombre placeholder:text-sombre/40 transition-all duration-200 focus:border-dore focus:outline-none focus:ring-2 focus:ring-dore/40"
      />
    </div>
  )
}
