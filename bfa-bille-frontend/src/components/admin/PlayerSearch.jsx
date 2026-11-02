import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useCategories } from '../../hooks/useCategories'

/* ============================================================
   PlayerSearch — Barre d'outils des joueurs (admin)
   ------------------------------------------------------------
   - Recherche (nom / prénom / poste)
   - Pastilles de catégorie avec effectifs : « Toutes · 86 »,
     « U11 · 21 »… (valeur = id de catégorie, « Tous » = toutes)
   - Filtre de poste (liste déroulante)
   ============================================================ */

const chip = (on) =>
  `inline-flex h-[42px] items-center rounded-[10px] border px-3.5 text-[13px] transition ${
    on
      ? 'border-vert bg-menthe font-semibold text-vert-dark'
      : 'border-[#e3ede6] bg-white font-medium text-[#3b4d42] hover:border-vert/50'
  }`

export default function PlayerSearch({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  poste,
  onPosteChange,
  postes,
  counts,
  totalCount,
}) {
  const { categories } = useCategories()

  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-[14px] border border-[#e3ede6] bg-white p-3">
      <label className="flex h-[42px] flex-[1_1_16rem] items-center gap-2.5 rounded-[10px] border border-[#e3ede6] bg-[#f4f7f5] px-3 focus-within:border-vert">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-sombre/60" />
        <span className="sr-only">Rechercher un joueur</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Nom du joueur…"
          className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
        />
      </label>

      <div role="group" aria-label="Catégorie" className="flex flex-wrap gap-2.5">
        <button
          type="button"
          aria-pressed={category === 'Tous'}
          onClick={() => onCategoryChange('Tous')}
          className={chip(category === 'Tous')}
        >
          Toutes · {totalCount}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={category === String(c.id)}
            onClick={() => onCategoryChange(String(c.id))}
            className={chip(category === String(c.id))}
          >
            {c.nom} · {counts[c.id] ?? 0}
          </button>
        ))}
      </div>

      <select
        value={poste}
        onChange={(e) => onPosteChange(e.target.value)}
        aria-label="Filtrer par poste"
        className="h-[42px] rounded-[10px] border border-[#e3ede6] bg-white px-3 text-[13px] font-medium text-[#3b4d42] outline-none focus:border-vert"
      >
        <option value="Tous">Poste : tous</option>
        {postes.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  )
}
