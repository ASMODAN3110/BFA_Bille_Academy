import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  toDateKey,
  isSameDay,
} from '../../utils/dateUtils'

/* ============================================================
   CalendarGrid — Grille mensuelle 7×6
   ------------------------------------------------------------
   - Navigation précédent / suivant (transition fade)
   - Cases des autres mois atténuées, aujourd'hui mis en évidence
   - Point doré en bas à droite sur les jours avec événement(s)
   - Tooltip au survol listant le(s) titre(s) de l'événement
   ============================================================ */

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

/** Construit les 42 cases (6 semaines) du mois affiché. */
function buildMonthCells(year, month) {
  const firstDay = getFirstDayOfMonth(month, year) // 0 = dimanche
  const daysInMonth = getDaysInMonth(month, year)
  const prevMonth = new Date(year, month - 1, 1)
  const prevDays = getDaysInMonth(
    prevMonth.getMonth(),
    prevMonth.getFullYear(),
  )

  const cells = []

  // Jours de fin du mois précédent (atténués)
  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({ day: prevDays - i, current: false, date: new Date(year, month - 1, prevDays - i) })
  }
  // Jours du mois affiché
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d, current: true, date: new Date(year, month, d) })
  }
  // Jours de début du mois suivant (pour compléter 7×6)
  let next = 1
  while (cells.length < 42) {
    cells.push({ day: next, current: false, date: new Date(year, month + 1, next) })
    next += 1
  }

  return cells
}

export default function CalendarGrid({
  currentDate,
  eventMap,
  onPreviousMonth,
  onNextMonth,
  monthLabel,
}) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const cells = useMemo(() => buildMonthCells(year, month), [year, month])

  return (
    <Card className="p-4 sm:p-6">
      {/* En-tête : navigation entre les mois */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPreviousMonth}
          aria-label="Mois précédent"
          className="flex h-10 w-10 items-center justify-center rounded-full text-vert transition hover:bg-clair"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-extrabold text-vert md:text-xl">
          {monthLabel}
        </h3>

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Mois suivant"
          className="flex h-10 w-10 items-center justify-center rounded-full text-vert transition hover:bg-clair"
        >
          <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
        </button>
      </div>

      {/* Grille (key = mois pour rejouer la transition) */}
      <motion.div
        key={`${year}-${month}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1">
          {DAY_NAMES.map((name) => (
            <div
              key={name}
              className="py-2 text-center text-xs font-bold uppercase tracking-wider text-sombre/50"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Cases */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            const dateKey = toDateKey(cell.date)
            const dayEvents = eventMap[dateKey] ?? []
            const isToday = cell.current && isSameDay(cell.date, today)

            return (
              <div
                key={`${dateKey}-${i}`}
                className="group relative aspect-square"
              >
                {/* Case */}
                <div
                  className={`flex h-full w-full items-center justify-center rounded-lg text-sm transition-colors ${
                    isToday
                      ? 'bg-vert font-bold text-white shadow-md'
                      : cell.current
                        ? 'text-sombre hover:bg-clair'
                        : 'text-sombre/25'
                  }`}
                >
                  {cell.day}
                </div>

                {/* Point doré : jour avec événement(s) */}
                {dayEvents.length > 0 && (
                  <span
                    className={`absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-dore ${
                      isToday ? '' : 'group-hover:scale-150'
                    } transition-transform`}
                  />
                )}

                {/* Tooltip au survol */}
                {dayEvents.length > 0 && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-vert-dark px-3 py-2 text-xs text-white shadow-xl group-hover:block">
                    <p className="mb-1 font-bold text-dore">{cell.day} — {dayEvents.length} événement{dayEvents.length > 1 ? 's' : ''}</p>
                    {dayEvents.map((e) => (
                      <p key={e.id} className="py-0.5">
                        {e.titre}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>
    </Card>
  )
}
