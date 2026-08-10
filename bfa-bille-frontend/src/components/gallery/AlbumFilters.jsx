import Button from '../ui/Button'

/* ============================================================
   AlbumFilters — Filtres des albums (Tous | Entraînements |
   Matchs | Événements)
   ------------------------------------------------------------
   Boutons `Button` (variantes filter / filter-active) avec le
   nombre d'albums par thème affiché en badge.
   ============================================================ */

export default function AlbumFilters({ themes, counts, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les albums par thème"
      className="mb-8 flex flex-wrap items-center justify-center gap-3"
    >
      {themes.map((theme) => {
        const isActive = active === theme
        return (
          <Button
            key={theme}
            type="button"
            size="sm"
            variant={isActive ? 'filter-active' : 'filter'}
            onClick={() => onChange(theme)}
            aria-pressed={isActive}
            role="tab"
            aria-selected={isActive}
            className="rounded-full px-5"
          >
            {theme}
            {counts[theme] != null && (
              <span
                className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                  isActive ? 'bg-dore text-vert-dark' : 'bg-clair text-sombre'
                }`}
              >
                {counts[theme]}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}
