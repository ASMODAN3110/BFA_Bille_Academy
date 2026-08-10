import Button from '../ui/Button'

/* ============================================================
   EventFilters — Filtres du calendrier
   ------------------------------------------------------------
   Deux groupes de boutons (variantes filter / filter-active) :
   - Catégories : Tous, U9, U15, U17
   - Types      : Tous, Match, Training
   ============================================================ */

function FilterGroup({ label, options, active, onChange }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
      <span className="w-24 text-sm font-bold uppercase tracking-wider text-sombre/50">
        {label}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {options.map((option) => {
          const isActive = active === option
          return (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={isActive ? 'filter-active' : 'filter'}
              onClick={() => onChange(option)}
              aria-pressed={isActive}
              className="rounded-full px-4"
            >
              {option}
            </Button>
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
    <div className="mb-8 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:gap-10 md:gap-16">
      <FilterGroup
        label="Catégorie"
        options={categories}
        active={selectedCategory}
        onChange={onCategoryChange}
      />
      <FilterGroup
        label="Type"
        options={types}
        active={selectedType}
        onChange={onTypeChange}
      />
    </div>
  )
}
