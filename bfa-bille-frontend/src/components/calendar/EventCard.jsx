import { parseLocalDate } from '../../utils/dateUtils'

/* ============================================================
   EventCard — Carte d'un événement (cliquable) — maquette Claude Design
   ------------------------------------------------------------
   Pastille de type (Match = menthe, Entraînement = gris, autre = doré),
   catégorie, titre, puis « date · heure · lieu ». Un clic (ou Entrée /
   Espace) ouvre le détail.
   ============================================================ */

const TYPE_TAG = {
  Match: 'bg-menthe text-[#0f6b33]',
  Entraînement: 'bg-[#eef2ef] text-sombre/80',
}

export default function EventCard({ event, onSelect }) {
  const date = parseLocalDate(event.date)
  const dateLabel = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      aria-label={`Détails de l'événement ${event.titre}`}
      className="group w-full rounded-[20px] border border-[#e3ede6] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-vert/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${TYPE_TAG[event.type] ?? 'bg-[#fff4cc] text-dore-dark'}`}
        >
          {event.type}
        </span>
        <span className="rounded-full bg-[#eef2ef] px-3 py-1 text-xs font-semibold text-sombre/80">
          {event.categorie}
        </span>
      </div>
      <h3 className="mt-2.5 text-[19px] font-semibold leading-snug text-[#14231a] transition-colors group-hover:text-vert">
        {event.titre}
      </h3>
      <p className="mt-1 text-sm text-sombre/70">
        {[dateLabel, event.heure, event.lieu].filter(Boolean).join(' · ')}
      </p>
    </button>
  )
}
