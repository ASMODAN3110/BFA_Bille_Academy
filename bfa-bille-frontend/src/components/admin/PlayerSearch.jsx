import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import { useCategories } from '../../hooks/useCategories'

/* ============================================================
   PlayerSearch — Recherche et filtres des joueurs
   ------------------------------------------------------------
   - Champ de recherche (nom / prénom / poste)
   - Filtre catégorie (GET /api/categories, valeur = id)
   - Compteur de résultats
   ============================================================ */

const selectClasses =
  'w-full cursor-pointer appearance-none rounded-xl border-2 border-clair bg-white px-4 py-2.5 pr-9 text-sm text-sombre transition focus:border-dore focus:outline-none focus:ring-2 focus:ring-dore/40 sm:w-auto'

export default function PlayerSearch({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  resultCount,
  totalCount,
}) {
  const { categories } = useCategories()

  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Recherche */}
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sombre/75"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher un joueur ou un poste…"
            aria-label="Rechercher un joueur"
            className="w-full rounded-xl border-2 border-clair bg-white py-2.5 pl-11 pr-4 text-sm text-sombre placeholder:text-sombre/75 transition focus:border-dore focus:outline-none focus:ring-2 focus:ring-dore/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filtrer par catégorie"
            className={selectClasses}
          >
            <option value="Tous">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-3 text-xs text-sombre/75">
        {resultCount} joueur{resultCount > 1 ? 's' : ''} affiché
        {resultCount > 1 ? 's' : ''} sur {totalCount}
      </p>
    </Card>
  )
}
