import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Card from '../../ui/Card'
import { useCategories } from '../../../hooks/useCategories'

/* ============================================================
   TrialSearch — Recherche + filtres des demandes d'essai (admin)
   ------------------------------------------------------------
   - Recherche par nom / prénom / e-mail / téléphone
   - Filtres : statut, catégorie, date d'essai
   - Compteur des résultats affichés
   ============================================================ */

const STATUS_OPTIONS = ['En attente', 'Confirmé', 'Refusé']

const selectClasses =
  'w-full rounded-lg border border-clair bg-white px-3 py-2 text-sm text-sombre outline-none transition focus:border-vert focus:ring-2 focus:ring-vert/20'

export default function TrialSearch({
  query,
  onQueryChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  dateFilter,
  onDateFilterChange,
  resultCount,
  totalCount,
}) {
  const { categories } = useCategories()
  return (
    <Card className="p-4 md:p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <div className="relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sombre/40"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher par nom ou e-mail…"
            aria-label="Rechercher un candidat"
            className={`${selectClasses} pl-9`}
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filtrer par statut"
          className={selectClasses}
        >
          <option value="Tous">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filtrer par catégorie"
          className={selectClasses}
        >
          <option value="Tous">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.nom}>
              {c.nom}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          aria-label="Filtrer par date d'essai"
          title="Filtrer par date d'essai"
          className={selectClasses}
        />
      </div>

      <p className="mt-3 text-xs text-sombre/60">
        <span className="font-bold text-vert">{resultCount}</span> demande(s)
        affichée(s) sur {totalCount}
      </p>
    </Card>
  )
}
