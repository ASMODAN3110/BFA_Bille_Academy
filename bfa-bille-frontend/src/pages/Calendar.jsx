import { useEffect, useState } from 'react'
import PageHero from '../components/layout/PageHero'
import CalendarGrid from '../components/calendar/CalendarGrid'
import EventFilters from '../components/calendar/EventFilters'
import EventsList from '../components/calendar/EventsList'
import EventDetails from '../components/calendar/EventDetails'
import useCalendar from '../hooks/useCalendar'
import { api } from '../utils/api'
import { normalizeEvent } from '../utils/eventAdapter'

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
    <>
      <PageHero
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Calendrier' }]}
        title="Calendrier interactif"
        lead="Suivez les entraînements, les matchs et les événements de l'académie."
      />

      <section id="calendrier" className="bg-[#fafcfa] py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Barre d'outils : filtres à gauche, navigation du mois à droite */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <EventFilters
              categories={categories}
              types={types}
              selectedCategory={selectedCategory}
              selectedType={selectedType}
              onCategoryChange={setSelectedCategory}
              onTypeChange={setSelectedType}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousMonth}
                aria-label="Mois précédent"
                className="flex h-11 w-11 items-center justify-center rounded-lg border-[1.5px] border-[#14231a] bg-white text-lg font-semibold transition-colors hover:bg-[#14231a] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40"
              >
                <span aria-hidden="true">←</span>
              </button>
              <h2
                aria-live="polite"
                className="min-w-40 text-center text-[19px] font-semibold text-[#14231a]"
              >
                {monthLabel}
              </h2>
              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="Mois suivant"
                className="flex h-11 w-11 items-center justify-center rounded-lg border-[1.5px] border-[#14231a] bg-white text-lg font-semibold transition-colors hover:bg-[#14231a] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-sombre/75">
              Chargement des événements…
            </p>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
            >
              {error}
            </div>
          ) : (
            /* Grille du mois + liste latérale (maquette : ~2/3 – 1/3).
               min-w-0 sur les colonnes : évite le débordement horizontal
               sur mobile. */
            <div className="flex flex-wrap items-start gap-8">
              <div className="min-w-0 flex-[2_1_640px]">
                <CalendarGrid
                  currentDate={currentDate}
                  eventMap={eventMap}
                  onSelect={setSelectedEvent}
                />
              </div>
              <aside className="min-w-0 flex-[1_1_300px]">
                <EventsList
                  events={filteredEvents}
                  monthLabel={monthLabel}
                  onSelect={setSelectedEvent}
                />
              </aside>
            </div>
          )}
        </div>
      </section>

      {/* Modale de détails d'un événement */}
      <EventDetails
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}
