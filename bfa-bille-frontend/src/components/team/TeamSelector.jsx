import Button from '../ui/Button'

/* ============================================================
   TeamSelector — Sélecteur de catégorie (U9 | U15 | U17)
   ------------------------------------------------------------
   Boutons `Button` (variantes filter / filter-active) ; le
   bouton actif est en vert foncé.
   ============================================================ */

export default function TeamSelector({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Choisir une catégorie"
      className="flex flex-wrap items-center justify-center gap-3"
    >
      {categories.map((category) => {
        const isActive = active === category
        return (
          <Button
            key={category}
            type="button"
            variant={isActive ? 'filter-active' : 'filter'}
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            role="tab"
            aria-selected={isActive}
            className="min-w-20 rounded-full px-8"
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}
