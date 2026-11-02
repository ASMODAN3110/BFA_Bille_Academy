/* ============================================================
   ProductFilters — Filtres du catalogue (maquette Claude Design)
   ------------------------------------------------------------
   Pastilles arrondies : Tous les produits | Nouveautés | catégories.
   La pastille active est pleine verte.
   ============================================================ */

const chipClasses = (active) =>
  `inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 ${
    active
      ? 'border-vert bg-vert text-white'
      : 'border-[#cfe6d6] bg-white text-sombre/80 hover:border-vert hover:text-vert'
  }`

export default function ProductFilters({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les produits par catégorie"
      className="flex flex-wrap items-center gap-2"
    >
      {categories.map((category) => {
        const isActive = active === category
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={chipClasses(isActive)}
          >
            {category === 'Tous' ? 'Tous les produits' : category}
          </button>
        )
      })}
    </div>
  )
}
