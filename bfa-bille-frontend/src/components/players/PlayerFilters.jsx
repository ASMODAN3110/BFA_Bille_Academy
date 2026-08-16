import Button from '../ui/Button'

/* ============================================================
   PlayerFilters — Filtres par catégorie (Tous | U9 | U15 | U17)
   ------------------------------------------------------------
   - `categories` : ['Tous', ...{ id, nom, ageMin, ageMax }] depuis
     l'API (voir usePlayerFilter)
   - `active` / `onChange` : 'Tous' | categorie.id
   - Nombre de joueurs par catégorie affiché en badge
   ============================================================ */

export default function PlayerFilters({ categories, counts, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les joueurs par catégorie"
      className="mb-8 flex flex-wrap items-center justify-center gap-3"
    >
      {categories.map((category) => {
        const isTous = category === 'Tous'
        const id = isTous ? 'Tous' : category.id
        const label = isTous ? 'Tous' : category.nom
        const isActive = active === id
        return (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={isActive ? 'filter-active' : 'filter'}
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            role="tab"
            aria-selected={isActive}
            className="rounded-full px-5"
          >
            {label}
            {counts[id] != null && (
              <span
                className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                  isActive ? 'bg-dore text-vert-dark' : 'bg-clair text-sombre'
                }`}
              >
                {counts[id]}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}
