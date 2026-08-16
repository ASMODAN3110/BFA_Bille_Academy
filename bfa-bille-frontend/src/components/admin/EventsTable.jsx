import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Table from '../ui/Table'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   EventsTable — Tableau des événements (admin calendrier)
   ------------------------------------------------------------
   - Colonnes : Titre, Date, Heure, Lieu, Catégorie, Type,
     Actions (Modifier / Supprimer)
   ============================================================ */

const TYPE_BADGE = {
  Match: 'mvp',
  'Entraînement': 'success',
}

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

export default function EventsTable({ events, onEdit, onDelete }) {
  const columns = [
    { key: 'titre', label: 'Titre' },
    {
      key: 'date',
      label: 'Date',
      render: (row) => formatDateCard(parseLocalDate(row.date)),
    },
    {
      key: 'heure',
      label: 'Heure',
      render: (row) => row.heure,
    },
    { key: 'lieu', label: 'Lieu' },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (row) => <Badge variant="selected">{row.categorie}</Badge>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge variant={TYPE_BADGE[row.type] ?? 'default'}>{row.type}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row)}
            aria-label={`Modifier ${row.titre}`}
            className={`${actionButtonClasses} text-vert hover:bg-vert/10`}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            aria-label={`Supprimer ${row.titre}`}
            className={`${actionButtonClasses} text-erreur hover:bg-erreur/10`}
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (events.length === 0) {
    return (
      <Card className="p-10 text-center">
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="mx-auto h-10 w-10 text-sombre/20"
        />
        <p className="mt-3 font-bold text-sombre/70">
          Aucun événement pour le moment.
        </p>
        <p className="mt-1 text-sm text-sombre/50">
          Créer le premier événement pour l'afficher ici.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-5">
      <Table columns={columns} rows={events} rowKey="id" />
    </Card>
  )
}
