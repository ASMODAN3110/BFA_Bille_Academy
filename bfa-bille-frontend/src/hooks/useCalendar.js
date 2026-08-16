import { useMemo, useState } from 'react'

/* ============================================================
   useCalendar — Logique du calendrier interactif
   ------------------------------------------------------------
   - `currentDate` : mois/année affiché (initialisé au mois du
     premier événement pour que la grille soit pleine)
   - Navigation mois précédent / suivant
   - Filtres par catégorie (U9, U15, U17) et par type
     (Match, Training)
   - `eventMap`  : jour (YYYY-MM-DD) → événements (marqueurs grille)
   - `filteredEvents` : événements du mois après filtres, triés
   ============================================================ */

const CATEGORY_ORDER = { U9: 0, U15: 1, U17: 2 }

export default function useCalendar(events) {
  // Initialise le mois affiché sur celui du premier événement
  const [currentDate, setCurrentDate] = useState(() => {
    if (events.length > 0) {
      const [year, month] = events[0].date.split('-').map(Number)
      return new Date(year, month - 1, 1)
    }
    return new Date()
  })

  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedType, setSelectedType] = useState('Tous')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const goToPreviousMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const goToNextMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  // Catégories et types disponibles (ordre stable)
  const categories = useMemo(() => {
    const cats = [...new Set(events.map((e) => e.categorie))]
    cats.sort((a, b) => (CATEGORY_ORDER[a] ?? 9) - (CATEGORY_ORDER[b] ?? 9))
    return ['Tous', ...cats]
  }, [events])

  const types = useMemo(
    () => ['Tous', ...new Set(events.map((e) => e.type))],
    [events],
  )

  // Événements du mois affiché (avant filtres, pour les compteurs)
  const monthEvents = useMemo(
    () =>
      events.filter((e) => {
        const [year, month] = e.date.split('-').map(Number)
        return (
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth() + 1
        )
      }),
    [events, currentDate],
  )

  // Événements après application des filtres
  const filteredEvents = useMemo(() => {
    return monthEvents
      .filter(
        (e) =>
          (selectedCategory === 'Tous' || e.categorie === selectedCategory) &&
          (selectedType === 'Tous' || e.type === selectedType),
      )
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          (a.heure ?? '').localeCompare(b.heure ?? ''),
      )
  }, [monthEvents, selectedCategory, selectedType])

  // Index jour (YYYY-MM-DD) → événements filtrés (marqueurs de la grille)
  const eventMap = useMemo(() => {
    const map = {}
    for (const e of filteredEvents) {
      ;(map[e.date] ??= []).push(e)
    }
    return map
  }, [filteredEvents])

  const monthLabel = currentDate
    .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase())

  return {
    currentDate,
    goToPreviousMonth,
    goToNextMonth,
    monthLabel,
    categories,
    types,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedEvent,
    setSelectedEvent,
    eventMap,
    filteredEvents,
    monthEvents,
  }
}
