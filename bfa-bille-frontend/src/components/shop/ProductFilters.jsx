import Button from '../ui/Button'

/* ============================================================
   ProductFilters — Filtres du catalogue (boutique)
   ------------------------------------------------------------
   Boutons `Button` (variantes filter / filter-active) pour
   choisir entre « Tous », « Nouveautés », « Vêtements » et
   « Accessoires ».
   ============================================================ */

export default function ProductFilters({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les produits par catégorie"
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
          </Button>
        )
      })}
    </div>
  )
}
