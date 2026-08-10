/* ============================================================
   dateUtils — Utilitaires de gestion des dates
   ------------------------------------------------------------
   Toutes les dates sont construites localement (new Date(y, m, d))
   pour éviter les décalages de fuseau horaire liés au parsing
   des chaînes ISO "YYYY-MM-DD".
   ============================================================ */

const MONTHS_SHORT = [
  'JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN',
  'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC',
]

/** Construit une Date locale depuis une chaîne "YYYY-MM-DD". */
export function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Nombre de jours dans un mois (month : 0-11, comme Date). */
export function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate()
}

/** Jour de la semaine du 1er du mois (0 = dimanche … 6 = samedi). */
export function getFirstDayOfMonth(month, year) {
  return new Date(year, month, 1).getDay()
}

/** Formate une date en "08 OCT" (jour + mois abrégé). */
export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  return `${day} ${MONTHS_SHORT[date.getMonth()]}`
}

/** Formate une date en toutes lettres : "mardi 8 octobre 2024". */
export function formatDateLong(date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Formate une date en "12 Oct 2024" (jour + mois abrégé + année). */
export function formatDateCard(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTHS_SHORT[date.getMonth()]
  const monthTitle =
    month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()
  return `${day} ${monthTitle} ${date.getFullYear()}`
}

/** Clé de date au format "YYYY-MM-DD" (pour indexer les événements). */
export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Vérifie que deux dates correspondent au même jour calendaire. */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
