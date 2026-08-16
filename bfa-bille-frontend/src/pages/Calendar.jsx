import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import CalendarGrid from '../components/calendar/CalendarGrid'
import EventFilters from '../components/calendar/EventFilters'
import EventsList from '../components/calendar/EventsList'
import EventDetails from '../components/calendar/EventDetails'
import useCalendar from '../hooks/useCalendar'
import { api } from '../utils/api'
import { normalizeEvent } from '../utils/eventAdapter'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   Calendar — Page « Calendrier interactif » (/calendrier)
   ------------------------------------------------------------
   - Calendrier mensuel 7×6 avec navigation
   - Filtres catégorie + type
   - Liste des événements du mois
   - Modale de détails au clic sur un événement
   - Données : GET /api/events (limit=100) → normalisées
   Desktop : calendrier à gauche, liste à droite.
   Tablet / mobile : empilés.
   ============================================================ */

export default function Calendar() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* Chargement depuis le backend (tri date puis heure fait côté serveur). */
  useEffect(() => {
    let active = true
    api('/api/events?limit=100')
      .then((d) => {
        if (!active) return
        setEvents((d?.data?.items ?? []).map(normalizeEvent))
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message || 'Impossible de charger les événements.')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const {
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
  } = useCalendar(events)

  return (
    <section id="calendrier" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Calendrier Interactif"
            subtitle="Suivez les entraînements, les matchs et les événements de l'académie."
          />
        </motion.div>

        <EventFilters
          categories={categories}
          types={types}
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
        />

        {loading ? (
          <p className="mb-8 text-center text-sm text-sombre/60">
            Chargement des événements…
          </p>
        ) : error ? (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
          >
            {error}
          </div>
        ) : (
          <>
            {/* Calendrier + liste.
                ⚠️ min-w-0 sur les enfants de grille : sans lui, le track auto
                d'une grille en 1 colonne prend le min-content le plus large et
                fait exploser la largeur sur mobile (overflow horizontal). */}
            <div className="grid items-start gap-8 lg:grid-cols-3">
              <div className="min-w-0 lg:col-span-2">
                <CalendarGrid
                  currentDate={currentDate}
                  eventMap={eventMap}
                  onPreviousMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                  monthLabel={monthLabel}
                />
              </div>

              <div className="min-w-0 lg:col-span-1">
                <EventsList
                  events={filteredEvents}
                  monthLabel={monthLabel}
                  onSelect={setSelectedEvent}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modale de détails d'un événement */}
      <EventDetails
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  )
}
