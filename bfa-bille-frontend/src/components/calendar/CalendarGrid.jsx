import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  toDateKey,
  isSameDay,
} from '../../utils/dateUtils'

/* ============================================================
   CalendarGrid — Grille mensuelle (maquette Claude Design)
   ------------------------------------------------------------
   - Semaine du lundi au dimanche, en-tête vert, 6 semaines
   - Cases des autres mois atténuées ; aujourd'hui = numéro dans
     un rond vert
   - Jours avec événements : pastilles de type (Match / Entr.),
     2 au maximum puis « +n » ; chaque pastille ouvre le détail
   - Mobile : simples points colorés (pas de défilement horizontal)
   La navigation entre les mois est dans la barre d'outils de la page.
   ============================================================ */

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const TYPE_STYLE = {
  Match: { pill: 'bg-menthe text-[#0f6b33]', dot: 'bg-vert', short: 'Match' },
  Entraînement: { pill: 'bg-[#eef2ef] text-sombre/80', dot: 'bg-sombre/50', short: 'Entr.' },
}
const DEFAULT_STYLE = { pill: 'bg-[#fff4cc] text-dore-dark', dot: 'bg-dore', short: 'Événement' }
const styleOf = (type) => TYPE_STYLE[type] ?? DEFAULT_STYLE

const MAX_PILLS = 2

/** Construit les 42 cases (6 semaines, lundi en premier) du mois affiché. */
function buildMonthCells(year, month) {
  const firstDay = (getFirstDayOfMonth(month, year) + 6) % 7 // 0 = lundi
  const daysInMonth = getDaysInMonth(month, year)
  const prevMonth = new Date(year, month - 1, 1)
  const prevDays = getDaysInMonth(prevMonth.getMonth(), prevMonth.getFullYear())

  const cells = []
  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({ day: prevDays - i, current: false, date: new Date(year, month - 1, prevDays - i) })
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d, current: true, date: new Date(year, month, d) })
  }
  let next = 1
  while (cells.length < 42) {
    cells.push({ day: next, current: false, date: new Date(year, month + 1, next) })
    next += 1
  }
  return cells
}

export default function CalendarGrid({ currentDate, eventMap, onSelect }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const cells = useMemo(() => buildMonthCells(year, month), [year, month])

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e3ede6] bg-white">
      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 bg-vert text-center text-[13px] font-semibold text-white">
        {DAY_NAMES.map((name) => (
          <div key={name} className="py-3">
            {name}
          </div>
        ))}
      </div>

      {/* Cases (key = mois pour rejouer la transition de changement de mois) */}
      <motion.div
        key={`${year}-${month}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="grid grid-cols-7"
      >
        {cells.map((cell, i) => {
          const dateKey = toDateKey(cell.date)
          const dayEvents = cell.current ? (eventMap[dateKey] ?? []) : []
          const isToday = cell.current && isSameDay(cell.date, today)
          const extra = dayEvents.length - MAX_PILLS

          return (
            <div
              key={`${dateKey}-${i}`}
              className={`min-h-[64px] border-b border-r border-[#e3ede6] p-1.5 text-[13px] sm:min-h-[96px] sm:p-2 ${
                cell.current ? '' : 'bg-[#fafcfa]'
              } ${(i + 1) % 7 === 0 ? 'border-r-0' : ''} ${i >= 35 ? 'border-b-0' : ''}`}
            >
              <div
                className={
                  isToday
                    ? 'flex h-6 w-6 items-center justify-center rounded-full bg-vert font-bold text-white'
                    : `font-semibold ${cell.current ? 'text-sombre/80' : 'text-sombre/35'}`
                }
              >
                {cell.day}
              </div>

              {/* Mobile : points */}
              {dayEvents.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1 sm:hidden">
                  {dayEvents.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => onSelect(e)}
                      aria-label={`${e.titre}, ${e.type}`}
                      className={`h-3 w-3 rounded-full ${styleOf(e.type).dot}`}
                    />
                  ))}
                </div>
              )}

              {/* Tablette / ordinateur : pastilles */}
              {dayEvents.length > 0 && (
                <div className="mt-1.5 hidden flex-col gap-1 sm:flex">
                  {dayEvents.slice(0, MAX_PILLS).map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => onSelect(e)}
                      title={e.titre}
                      aria-label={`${e.titre}, ${e.type}`}
                      className={`truncate rounded-lg px-2 py-[3px] text-left text-xs font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-vert ${styleOf(e.type).pill}`}
                    >
                      {styleOf(e.type).short}
                    </button>
                  ))}
                  {extra > 0 && (
                    <button
                      type="button"
                      onClick={() => onSelect(dayEvents[MAX_PILLS])}
                      className="px-1 text-left text-xs font-semibold text-sombre/70 hover:text-vert"
                    >
                      +{extra}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
