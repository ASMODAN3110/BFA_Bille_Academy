import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Table from '../ui/Table'
import { recentRequests } from '../../data/mockData'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   RecentRequests — Tableau des demandes d'essai récentes
   ------------------------------------------------------------
   - Réutilise `Table` (en-tête vert, lignes alternées, survol
     gris clair) et `Badge` pour les statuts :
       Confirmé → success (vert), En attente → warning (orange),
       Refusé → danger (rouge)
   - Colonne Actions : lien vers la gestion des essais
   ============================================================ */

const STATUS_VARIANT = {
  'Confirmé': 'success',
  'En attente': 'warning',
  'Refusé': 'danger',
}

const COLUMNS = [
  { key: 'name', label: 'Nom du candidat' },
  { key: 'ageGroup', label: 'Catégorie' },
  {
    key: 'dateApplied',
    label: 'Date de candidature',
    render: (row) => formatDateCard(parseLocalDate(row.dateApplied)),
  },
  {
    key: 'status',
    label: 'Statut',
    render: (row) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <Link
        to="/admin/trials"
        aria-label={`Gérer la demande de ${row.name}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-vert/30 bg-vert/10 px-3 py-1.5 text-xs font-bold text-vert transition hover:bg-vert hover:text-dore active:scale-95"
      >
        Gérer
        <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
      </Link>
    ),
  },
]

export default function RecentRequests() {
  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-sombre">Demandes d'essai récentes</h2>
        <p className="mt-0.5 text-sm text-sombre/60">
          Les dernières candidatures reçues pour les essais.
        </p>
      </div>

      <Table columns={COLUMNS} rows={recentRequests} rowKey="id" />
    </Card>
  )
}
