/* ============================================================
   AlbumFilters — Filtres des albums par thème (maquette Claude Design)
   ------------------------------------------------------------
   Pastilles arrondies : Tous les albums | Entraînements | Matchs |
   Événements | Portraits. La pastille active est pleine verte.
   ============================================================ */

const chipClasses = (active) =>
  `inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 ${
    active
      ? 'border-vert bg-vert text-white'
      : 'border-[#cfe6d6] bg-white text-sombre/80 hover:border-vert hover:text-vert'
  }`

export default function AlbumFilters({ themes, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les albums par thème"
      className="flex flex-wrap items-center gap-2"
    >
      {themes.map((theme) => {
        const isActive = active === theme
        return (
          <button
            key={theme}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(theme)}
            className={chipClasses(isActive)}
          >
            {theme === 'Tous' ? 'Tous les albums' : theme}
          </button>
        )
      })}
    </div>
  )
}
