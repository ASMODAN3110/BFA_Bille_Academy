/* ============================================================
   TeamPills — Sélecteur de catégorie du site public (U9 | U12 | U15 | U17)
   ------------------------------------------------------------
   Pastilles arrondies (maquette Claude Design) : la catégorie
   active est pleine verte. Posé dans le bandeau de titre.
   ============================================================ */

export default function TeamPills({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Choisir une catégorie"
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
            className={`inline-flex min-h-10 min-w-16 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 ${
              isActive
                ? 'border-vert bg-vert text-white'
                : 'border-[#cfe6d6] bg-white text-sombre/80 hover:border-vert hover:text-vert'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
