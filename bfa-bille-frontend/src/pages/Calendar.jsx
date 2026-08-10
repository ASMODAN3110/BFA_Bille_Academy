import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import CalendarGrid from '../components/calendar/CalendarGrid'
import EventFilters from '../components/calendar/EventFilters'
import EventsList from '../components/calendar/EventsList'
import EventDetails from '../components/calendar/EventDetails'
import { events } from '../data/mockData'
import useCalendar from '../hooks/useCalendar'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   Calendar — Page « Calendrier interactif » (/calendrier)
   ------------------------------------------------------------
   - Calendrier mensuel 7×6 avec navigation
   - Filtres catégorie + type
   - Liste des événements du mois
   - Modale de détails au clic sur un événement
   Desktop : calendrier à gauche, liste à droite.
   Tablet / mobile : empilés.
   ============================================================ */

export default function Calendar() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
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

        {/* Calendrier + liste */}
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CalendarGrid
              currentDate={currentDate}
              eventMap={eventMap}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              monthLabel={monthLabel}
            />
          </div>

          <div className="lg:col-span-1">
            <EventsList
              events={filteredEvents}
              monthLabel={monthLabel}
              onSelect={setSelectedEvent}
            />
          </div>
        </div>
      </div>

      {/* Modale de détails d'un événement */}
      <EventDetails
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  )
}
