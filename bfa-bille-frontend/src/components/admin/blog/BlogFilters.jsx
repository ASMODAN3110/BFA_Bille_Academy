import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'

/* ============================================================
   BlogFilters — Filtres par statut des articles
   ------------------------------------------------------------
   - Onglets : Tous / Publiés / Brouillons (+ compteur chacun)
   - Props : selected, onSelect, articles (pour les compteurs)
   ============================================================ */

const FILTERS = [
  { key: 'Tous' },
  { key: 'Publiés' },
  { key: 'Brouillons' },
]

export default function BlogFilters({ selected, onSelect, articles }) {
  const countFor = (filter) => {
    if (filter === 'Tous') return articles.length
    const isPublie = filter === 'Publiés'
    return articles.filter((a) => a.estPublie === isPublie).length
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((f) => {
        const active = selected === f.key
        return (
          <Button
            key={f.key}
            type="button"
            variant={active ? 'filter-active' : 'filter'}
            size="sm"
            onClick={() => onSelect(f.key)}
            aria-pressed={active}
            className="rounded-full"
          >
            {f.key}
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                active ? 'bg-white/20 text-white' : 'bg-clair text-sombre/60'
              }`}
            >
              {countFor(f.key)}
            </span>
          </Button>
        )
      })}

      <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-sombre/50">
        <FontAwesomeIcon icon={faLayerGroup} className="h-3.5 w-3.5" />
        {articles.length} article(s) au total
      </span>
    </div>
  )
}
