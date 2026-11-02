/* ============================================================
   PlayerFilters — Barre d'outils de l'annuaire (maquette Claude Design)
   ------------------------------------------------------------
   - Recherche par nom / prénom
   - Filtre par catégorie : ['Tous', ...{ id, nom, ageMin, ageMax }]
   - Filtre par poste : ['Tous', 'Gardien', 'Défenseur', …]
   Pastilles arrondies, la pastille active est pleine verte.
   ============================================================ */

const chipClasses = (active) =>
  `inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 ${
    active
      ? 'border-vert bg-vert text-white'
      : 'border-[#cfe6d6] bg-white text-sombre/80 hover:border-vert hover:text-vert'
  }`

export default function PlayerFilters({
  search,
  onSearch,
  categories,
  active,
  onChange,
  postes,
  poste,
  onPoste,
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <div className="min-w-0 max-w-[420px] flex-[1_1_320px]">
        <label htmlFor="player-search" className="mb-1.5 block text-sm font-semibold">
          Rechercher un joueur
        </label>
        <input
          id="player-search"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Nom du joueur"
          autoComplete="off"
          className="min-h-12 w-full rounded-xl border border-[#cfe6d6] bg-white px-4 text-[15px] text-[#14231a] placeholder:text-sombre/50 focus:border-vert focus:outline-none focus:ring-4 focus:ring-vert/15"
        />
      </div>

      <div>
        <div className="mb-1.5 text-sm font-semibold" id="filtre-categorie">
          Catégorie
        </div>
        <div
          role="tablist"
          aria-labelledby="filtre-categorie"
          className="flex flex-wrap gap-2"
        >
          {categories.map((category) => {
            const isTous = category === 'Tous'
            const id = isTous ? 'Tous' : category.id
            const isActive = active === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(id)}
                className={chipClasses(isActive)}
              >
                {isTous ? 'Toutes' : category.nom}
              </button>
            )
          })}
        </div>
      </div>

      {postes.length > 2 && (
        <div>
          <div className="mb-1.5 text-sm font-semibold" id="filtre-poste">
            Poste
          </div>
          <div
            role="tablist"
            aria-labelledby="filtre-poste"
            className="flex flex-wrap gap-2"
          >
            {postes.map((p) => {
              const isActive = poste === p
              return (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onPoste(p)}
                  className={chipClasses(isActive)}
                >
                  {p === 'Tous' ? 'Tous' : p}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
