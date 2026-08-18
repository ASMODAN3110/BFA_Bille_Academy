import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { normalizeEvent } from '../../utils/eventAdapter'
import { formatDateCard, parseLocalDate } from '../../utils/dateUtils'

/* ============================================================
   UpcomingEvents — Prochains événements (tableau de bord)
   ------------------------------------------------------------
   - 5 prochains événements, issus de `stats.upcomingEvents`
     (aucun appel API supplémentaire)
   - `normalizeEvent` (eventAdapter) : date → "YYYY-MM-DD",
     type → libellé, categorie → nom
   ============================================================ */

export default function UpcomingEvents({ events }) {
  const items = (events ?? []).map(normalizeEvent)
  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-sombre">Prochains événements</h2>
          <p className="mt-0.5 text-sm text-sombre/60">
            Les prochaines dates au calendrier.
          </p>
        </div>
        {items.length > 0 && (
          <Button to="/admin/calendar" variant="secondary" size="sm">
            Voir tout
            <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <FontAwesomeIcon icon={faCalendarDays} className="mx-auto h-10 w-10 text-sombre/20" />
          <p className="mt-3 font-bold text-sombre/70">Aucun événement à venir.</p>
        </div>
      ) : (
        <ul className="divide-y divide-clair">
          {items.map((ev) => (
            <li key={ev.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-sombre">{ev.titre}</p>
                <p className="mt-0.5 text-xs text-sombre/60">
                  {ev.categorie} · {ev.lieu}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-vert">
                  {formatDateCard(parseLocalDate(ev.date))}
                </p>
                <p className="text-xs text-sombre/50">{ev.heure}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
