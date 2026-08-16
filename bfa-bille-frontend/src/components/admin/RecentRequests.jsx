import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInbox } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'

/* ============================================================
   RecentRequests — Tableau des demandes d'essai récentes
   ------------------------------------------------------------
   - ⚠️ Les demandes mock ont été retirées ; le widget affiche un
     état vide en attendant le backend (GET /admin/demandes-essai).
   - Quand le backend fournira les dernières candidatures, on
     réintroduira `Table` + `Badge` (Confirmé → success,
     En attente → warning, Refusé → danger).
   ============================================================ */

export default function RecentRequests() {
  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-sombre">Demandes d'essai récentes</h2>
        <p className="mt-0.5 text-sm text-sombre/60">
          Les dernières candidatures reçues pour les essais.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <FontAwesomeIcon icon={faInbox} className="h-10 w-10 text-sombre/20" />
        <p className="font-bold text-sombre/70">
          Aucune demande récente pour le moment.
        </p>
        <p className="text-sm text-sombre/50">
          Les candidatures apparaîtront ici une fois le backend connecté.
        </p>
      </div>
    </Card>
  )
}
