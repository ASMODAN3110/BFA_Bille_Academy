import Button from '../ui/Button'

/* ============================================================
   CategoryFilter — Sélecteur de catégorie (résultats/classements)
   ------------------------------------------------------------
   Boutons `Button` (variantes filter / filter-active) pour
   choisir entre « Tous », « U17 A » et « U15 Elite ». Le même
   filtre pilote à la fois les résultats et les classements.
   ============================================================ */

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer par catégorie"
      className="mb-10 flex flex-wrap items-center justify-center gap-3"
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
            className="rounded-full px-6"
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}
