import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { categories } from '../../data/categories'

/* ============================================================
   PlayerSearch — Recherche, filtres et export des joueurs
   ------------------------------------------------------------
   - Champ de recherche (nom / poste)
   - Filtre catégorie (U9, U15, U17) + filtre statut
   - Bouton Exporter (CSV)
   - Compteur de résultats
   ============================================================ */

const selectClasses =
  'w-full cursor-pointer appearance-none rounded-xl border-2 border-clair bg-white px-4 py-2.5 pr-9 text-sm text-sombre transition focus:border-dore focus:outline-none focus:ring-2 focus:ring-dore/40 sm:w-auto'

export default function PlayerSearch({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  onExport,
  resultCount,
  totalCount,
}) {
  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Recherche */}
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sombre/40"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher un joueur ou un poste…"
            aria-label="Rechercher un joueur"
            className="w-full rounded-xl border-2 border-clair bg-white py-2.5 pl-11 pr-4 text-sm text-sombre placeholder:text-sombre/40 transition focus:border-dore focus:outline-none focus:ring-2 focus:ring-dore/40"
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
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filtrer par statut"
            className={selectClasses}
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="MVP">MVP</option>
            <option value="Blessé">Blessé</option>
          </select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExport}
            className="shrink-0"
          >
            <FontAwesomeIcon icon={faFileExport} className="h-3.5 w-3.5" />
            Exporter
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-sombre/60">
        {resultCount} joueur{resultCount > 1 ? 's' : ''} affiché
        {resultCount > 1 ? 's' : ''} sur {totalCount}
      </p>
    </Card>
  )
}
