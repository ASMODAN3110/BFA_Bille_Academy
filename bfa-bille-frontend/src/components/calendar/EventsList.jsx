import EventCard from './EventCard'

/* ============================================================
   EventsList — Liste latérale des événements du mois (maquette Claude Design)
   ------------------------------------------------------------
   Filtres déjà appliqués en amont. Une carte par événement ; état
   vide si aucun événement.
   ============================================================ */

export default function EventsList({ events, monthLabel, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl font-bold leading-none text-[#14231a] md:text-4xl">
          Ce mois-ci
        </h2>
        <span className="rounded-full bg-menthe px-3 py-1 text-xs font-semibold text-[#0f6b33]">
          {events.length}
        </span>
      </div>
      <p className="-mt-1 mb-1 text-sm text-sombre/70">{monthLabel}</p>

      {events.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-dore/40 bg-white p-8 text-center">
          <p className="font-semibold text-[#14231a]">Aucun événement pour ce mois</p>
          <p className="mt-1 text-sm text-sombre/75">
            Modifiez les filtres ou changez de mois.
          </p>
        </div>
      ) : (
        events.map((event) => (
          <EventCard key={event.id} event={event} onSelect={onSelect} />
        ))
      )}
    </div>
  )
}
