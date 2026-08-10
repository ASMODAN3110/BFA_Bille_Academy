import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import {
  getDaysInMonth,
  getFirstDayOfMonth,
} from '../../utils/dateUtils'

/* ============================================================
   AdminCalendarGrid — Grille mensuelle du back-office
   ------------------------------------------------------------
   - Navigation mois précédent / suivant
   - Cases par jour avec les titres des événements du mois
     (affichés en chips, « +N » si dépassement)
   ============================================================ */

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function AdminCalendarGrid({ events, currentMonth, onPrev, onNext }) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(month, year)
  const leadingBlanks = (getFirstDayOfMonth(month, year) + 6) % 7

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
    'flex h-9 w-9 items-center justify-center rounded-lg text-vert transition hover:bg-clair active:scale-95'

  return (
    <Card className="p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onPrev} aria-label="Mois précédent" className={navClasses}>
          <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
        </button>
        <h3 className="text-base font-extrabold text-vert">{monthLabel}</h3>
        <button type="button" onClick={onNext} aria-label="Mois suivant" className={navClasses}>
          <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-bold uppercase tracking-wider text-sombre/50">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) =>
          d === null ? (
            <div key={`blank-${i}`} />
          ) : (
            <div
              key={d}
              className={`min-h-[4rem] rounded-lg border p-1 ${
                eventMap[d]
                  ? 'border-dore/40 bg-dore/5'
                  : 'border-clair bg-white'
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  eventMap[d] ? 'text-dore-dark' : 'text-sombre/60'
                }`}
              >
                {d}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {(eventMap[d] ?? []).slice(0, 2).map((e) => (
                  <span
                    key={e.id}
                    className="block truncate rounded bg-vert/10 px-1 py-0.5 text-[0.55rem] font-semibold leading-tight text-vert"
                    title={e.titre}
                  >
                    {e.titre}
                  </span>
                ))}
                {(eventMap[d]?.length ?? 0) > 2 && (
                  <span className="block px-1 text-[0.55rem] font-bold text-sombre/50">
                    +{eventMap[d].length - 2} autres
                  </span>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </Card>
  )
}
