/* ============================================================
   CategoryFilter — Sélecteur de catégorie (résultats / classements)
   ------------------------------------------------------------
   Pastilles arrondies (maquette Claude Design) ; la pastille active
   est pleine verte. Le même filtre pilote les résultats et les
   classements.
   ============================================================ */

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer par catégorie"
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
            className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 ${
              isActive
                ? 'border-vert bg-vert text-white'
                : 'border-[#cfe6d6] bg-white text-sombre/80 hover:border-vert hover:text-vert'
            }`}
          >
            {category === 'Tous' ? 'Toutes les catégories' : category}
          </button>
        )
      })}
    </div>
  )
}
