/* ============================================================
   EventFilters — Filtres du calendrier (maquette Claude Design)
   ------------------------------------------------------------
   Deux groupes de pastilles arrondies, la pastille active est pleine
   verte :
   - Catégorie : Toutes, U9, U12, U15, U17…
   - Type      : Tous, Match, Entraînement
   ============================================================ */

const chipClasses = (active) =>
  `inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 ${
    active
      ? 'border-vert bg-vert text-white'
      : 'border-[#cfe6d6] bg-white text-sombre/80 hover:border-vert hover:text-vert'
  }`

function FilterGroup({ label, labelId, options, active, onChange, allLabel }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold" id={labelId}>
        {label}
      </div>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = active === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={isActive}
              className={chipClasses(isActive)}
            >
              {option === 'Tous' ? allLabel : option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function EventFilters({
  categories,
  types,
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange,
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
      <FilterGroup
        label="Catégorie"
        labelId="cal-filtre-categorie"
        options={categories}
        active={selectedCategory}
        onChange={onCategoryChange}
        allLabel="Toutes"
      />
      <FilterGroup
        label="Type"
        labelId="cal-filtre-type"
        options={types}
        active={selectedType}
        onChange={onTypeChange}
        allLabel="Tous"
      />
    </div>
  )
}
