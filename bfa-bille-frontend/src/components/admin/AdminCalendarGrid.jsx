import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  toDateKey,
} from '../../utils/dateUtils'

/* ============================================================
   AdminCalendarGrid — Calendrier mensuel du back-office
   ------------------------------------------------------------
   - Carte « Novembre 2026 » : flèches ‹ › et bascule Mois / Liste
   - Légende Match / Entraînement / Autre (couleur + libellé)
   - Grille 7 colonnes : un chip par événement (« U15 · 17h ») ;
     sur téléphone, de simples pastilles colorées (le chip serait
     illisible) — toucher un jour ouvre son premier événement
   - L'événement sélectionné est surligné (panneau d'édition à côté)
   - Vue « Liste » : affiche `children` (tableau des événements)
   ============================================================ */

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const KINDS = {
  Match: { chip: 'bg-[#dcefe2] text-vert-dark', dot: 'bg-vert', text: 'text-vert-dark' },
  Entraînement: { chip: 'bg-[#fff3c9] text-dore-dark', dot: 'bg-dore', text: 'text-dore-dark' },
  Autre: { chip: 'bg-[#e8eef9] text-[#2b4a8a]', dot: 'bg-[#2b4a8a]', text: 'text-[#2b4a8a]' },
}
const kindOf = (e) => KINDS[e.type] ?? KINDS.Autre

/** « U15 · Amical » (match) ou « U15 · 17h » (entraînement / autre). */
function chipLabel(e) {
  const detail =
    e.type === 'Match'
      ? e.typeMatch === 'CHAMPIONNAT'
        ? 'Champ.'
        : 'Amical'
      : (e.heure ?? '').replace(/^(\d{2}):(\d{2})$/, (_, h, m) => (m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`))
  return [e.categorie, detail].filter(Boolean).join(' · ') || e.titre
}

export default function AdminCalendarGrid({
  events,
  currentMonth,
  onPrev,
  onNext,
  view,
  onViewChange,
  selectedId,
  onSelect,
  children,
}) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(month, year)
  const leadingBlanks = (getFirstDayOfMonth(month, year) + 6) % 7
  const todayKey = toDateKey(new Date())

  // Jour → événements du mois affiché
  const eventMap = {}
  events.forEach((e) => {
    const [y, m, d] = e.date.split('-').map(Number)
    if (y === year && m === month + 1) {
      ;(eventMap[d] ??= []).push(e)
    }
  })

  const cells = []
  for (let i = 0; i < leadingBlanks; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)

  const monthLabel = currentMonth
    .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase())

  const navClasses =
    'flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#e3ede6] text-sombre/80 transition hover:bg-[#f4f9f6] active:scale-95'

  return (
    <section className="min-w-0 flex-[999_1_40rem] rounded-2xl border border-[#e3ede6] bg-white p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-bold">{monthLabel}</h2>
        <span className="inline-flex gap-1.5">
          <button type="button" onClick={onPrev} aria-label="Mois précédent" className={navClasses}>
            <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onNext} aria-label="Mois suivant" className={navClasses}>
            <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
          </button>
        </span>
        <div
          role="group"
          aria-label="Affichage"
          className="ml-auto inline-flex rounded-[10px] bg-[#f4f7f5] p-[3px] text-[13px] font-semibold"
        >
          {[
            ['mois', 'Mois'],
            ['liste', 'Liste'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => onViewChange(value)}
              className={`min-h-9 rounded-lg px-3 transition ${
                view === value ? 'bg-white text-vert-dark shadow-sm' : 'text-sombre/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'liste' ? (
        children
      ) : (
        <>
      <ul className="mb-2.5 flex gap-3.5 text-xs text-sombre/75">
        {Object.entries(KINDS).map(([name, k]) => (
          <li key={name} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${k.dot}`} aria-hidden="true" />
            <span className={k.text}>{name}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-7 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sombre/70 sm:text-xs">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 border-b border-r border-[#eef3ef]">
        {cells.map((d, i) => {
          if (d === null) {
            return <div key={`blank-${i}`} className="min-h-14 border-l border-t border-[#eef3ef] sm:min-h-[92px]" />
          }
          const list = eventMap[d] ?? []
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isToday = key === todayKey
          return (
            <div
              key={d}
              onClick={() => list[0] && onSelect(list[0].id)}
              className={`min-h-14 border-l border-t border-[#eef3ef] p-1 text-xs text-sombre/75 sm:min-h-[92px] sm:p-1.5 ${
                list.length ? 'cursor-pointer sm:cursor-default' : ''
              }`}
            >
              <span
                className={
                  isToday
                    ? 'inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-vert px-1 font-bold text-white'
                    : list.length
                      ? 'font-bold text-sombre'
                      : ''
                }
              >
                {d}
              </span>

              {/* Téléphone : pastilles de couleur */}
              <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
                {list.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className={`h-2 w-2 rounded-full ${kindOf(e).dot} ${e.id === selectedId ? 'ring-2 ring-vert/40' : ''}`}
                  />
                ))}
              </div>

              {/* ≥ sm : chips */}
              <div className="hidden sm:block">
                {list.slice(0, 2).map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      onSelect(e.id)
                    }}
                    title={e.titre}
                    aria-label={e.titre}
                    className={`mt-1 block w-full truncate rounded-md px-1.5 py-[3px] text-left text-[11px] font-semibold ${kindOf(e).chip} ${
                      e.id === selectedId ? 'ring-2 ring-vert' : ''
                    }`}
                  >
                    {chipLabel(e)}
                  </button>
                ))}
                {list.length > 2 && (
                  <span className="mt-1 block px-1 text-[11px] font-semibold text-sombre/70">
                    +{list.length - 2} autres
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
        </>
      )}
    </section>
  )
}
