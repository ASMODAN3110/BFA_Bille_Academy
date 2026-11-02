import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useCategories } from '../../../hooks/useCategories'
import { relativeDate } from '../../../utils/dateUtils'

/* ============================================================
   TrialTable — Liste des demandes d'essai (admin)
   ------------------------------------------------------------
   - Onglets par statut (avec compteurs) + recherche + catégorie
   - Une ligne par candidat : avatar, nom, « âge · catégorie »,
     date relative, pastille de statut ; clic = détail à droite
   - Case à cocher pour les actions groupées
   ============================================================ */

export const STATUS_STYLE = {
  'En attente': { label: 'En attente', pill: 'bg-[#fff3c9] text-dore-dark' },
  Confirmé: { label: 'Acceptée', pill: 'bg-[#dcefe2] text-vert-dark' },
  Refusé: { label: 'Refusée', pill: 'bg-[#fbe4e1] text-[#9c2a20]' },
}

/* Le mock admin stocke parfois le nom complet dans « nom »
   (ex : « Lucas Dupont ») — évite la duplication « Lucas Lucas Dupont ». */
export const displayName = (t) =>
  t.prenom && t.nom && t.nom.includes(t.prenom)
    ? t.nom
    : `${t.prenom} ${t.nom}`.trim()

export const initials = (t) =>
  `${(t.prenom || t.nom || '?').charAt(0)}${t.prenom ? (t.nom || '').charAt(0) : ''}`.toUpperCase()

const TABS = [
  { value: 'En attente', label: 'En attente' },
  { value: 'Confirmé', label: 'Acceptées' },
  { value: 'Refusé', label: 'Refusées' },
  { value: 'Tous', label: 'Toutes' },
]

export default function TrialTable({
  trials,
  counts,
  total,
  status,
  onStatusChange,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  selectedIds,
  onToggleSelect,
  activeId,
  onSelect,
  children,
}) {
  const { categories } = useCategories()

  return (
    <section className="min-w-0 flex-[999_1_35rem] overflow-hidden rounded-2xl border border-[#e3ede6] bg-white">
      <div className="flex flex-wrap items-center gap-x-2 border-b border-[#e3ede6] px-2">
        <div role="tablist" aria-label="Statut" className="flex max-w-full overflow-x-auto">
          {TABS.map((t) => {
            const on = status === t.value
            const n = t.value === 'Tous' ? null : counts[t.value]
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onStatusChange(t.value)}
                className={`min-h-11 shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
                  on
                    ? 'border-vert text-vert-dark'
                    : 'border-transparent text-sombre/70 hover:text-sombre'
                }`}
              >
                {t.label}
                {n !== null && ` · ${n}`}
              </button>
            )
          })}
        </div>
        <div className="mx-2 my-1.5 flex min-w-48 flex-1 items-center gap-2 sm:ml-auto sm:flex-none">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filtrer par catégorie"
            className="h-[38px] rounded-[10px] border border-[#e3ede6] bg-[#f4f7f5] px-2 text-[13px] text-sombre/75 outline-none focus:border-vert"
          >
            <option value="Tous">Catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.nom}>
                {c.nom}
              </option>
            ))}
          </select>
          <label className="relative min-w-0 flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sombre/60"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Rechercher…"
              aria-label="Rechercher un candidat"
              className="h-[38px] w-full rounded-[10px] border border-[#e3ede6] bg-[#f4f7f5] pl-9 pr-3 text-[13px] outline-none focus:border-vert sm:w-60"
            />
          </label>
        </div>
      </div>

      {trials.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-sombre/75">
          {total === 0
            ? "Aucune demande d'essai pour le moment."
            : 'Aucune demande pour cette sélection.'}
        </p>
      ) : (
        <ul>
          {trials.map((t) => {
            const st = STATUS_STYLE[t.statut] ?? STATUS_STYLE['En attente']
            const active = t.id === activeId
            return (
              <li
                key={t.id}
                className={`flex items-center gap-1 border-t border-[#eef3ef] pl-3 pr-2 transition first:border-t-0 hover:bg-[#f4f9f6] ${
                  active ? 'bg-[#f1f8f3]' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(t.id)}
                  onChange={() => onToggleSelect(t.id)}
                  aria-label={`Sélectionner ${displayName(t)}`}
                  className="h-4 w-4 shrink-0 accent-vert"
                />
                <button
                  type="button"
                  onClick={() => onSelect(t.id)}
                  aria-current={active}
                  className="flex min-h-[68px] min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 py-3 pl-2 text-left text-sm"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${st.pill}`}
                  >
                    {initials(t)}
                  </span>
                  <span className="min-w-0 flex-1 basis-36">
                    <b className="block truncate font-semibold">{displayName(t)}</b>
                    <span className="block truncate text-xs text-sombre/75">
                      {[`${t.age} ans`, t.categorie, t.poste].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span className="text-[13px] text-sombre/75">
                    {relativeDate(t.dateSoumission)}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.pill}`}>
                    {st.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {children}
    </section>
  )
}
