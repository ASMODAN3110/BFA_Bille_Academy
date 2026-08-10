import Button from '../ui/Button'

/* ============================================================
   BlogFilters — Filtres par catégorie d'articles
   ------------------------------------------------------------
   Boutons `Button` (variantes filter / filter-active) avec le
   nombre d'articles publiés par catégorie affiché en badge.
   ============================================================ */

export default function BlogFilters({ categories, counts, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les articles par catégorie"
      className="mb-8 flex flex-wrap items-center justify-center gap-3"
    >
      {categories.map((category) => {
        const isActive = active === category
        return (
          <Button
            key={category}
            type="button"
            size="sm"
            variant={isActive ? 'filter-active' : 'filter'}
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            role="tab"
            aria-selected={isActive}
            className="rounded-full px-5"
          >
            {category}
            {counts[category] != null && (
              <span
                className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                  isActive ? 'bg-dore text-vert-dark' : 'bg-clair text-sombre'
                }`}
              >
                {counts[category]}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}
