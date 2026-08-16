import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Table from '../ui/Table'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   ResultsTable — Tableau des résultats (admin)
   ------------------------------------------------------------
   - Colonnes : Date, Équipes, Score, Catégorie, Type,
     Actions (Modifier / Supprimer)
   ============================================================ */

const TYPE_BADGE = {
  Championnat: 'mvp',
  Amical: 'success',
}

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

export default function ResultsTable({ results, onEdit, onDelete }) {
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (row) => formatDateCard(parseLocalDate(row.date)),
    },
    {
      key: 'match',
      label: 'Match',
      render: (row) => (
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              row.equipeA === 'BFA'
                ? 'bg-vert/10 text-vert'
                : 'bg-clair text-sombre/70'
            }`}
          >
            {row.equipeA}
          </span>
          <span className="text-xs text-sombre/50">contre</span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              row.equipeB === 'BFA'
                ? 'bg-vert/10 text-vert'
                : 'bg-clair text-sombre/70'
            }`}
          >
            {row.equipeB}
          </span>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (row) => (
        <span className="inline-flex items-center rounded-lg border border-dore/40 bg-dore/10 px-3 py-1 font-extrabold tabular-nums text-dore-dark">
          {row.scoreA} – {row.scoreB}
        </span>
      ),
    },
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
            aria-label={`Modifier ${row.equipeA} – ${row.equipeB}`}
            className={`${actionButtonClasses} text-vert hover:bg-vert/10`}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            aria-label={`Supprimer ${row.equipeA} – ${row.equipeB}`}
            className={`${actionButtonClasses} text-erreur hover:bg-erreur/10`}
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (results.length === 0) {
    return (
      <Card className="p-10 text-center">
        <FontAwesomeIcon
          icon={faFutbol}
          className="mx-auto h-10 w-10 text-sombre/20"
        />
        <p className="mt-3 font-bold text-sombre/70">
          Aucun résultat pour le moment.
        </p>
        <p className="mt-1 text-sm text-sombre/50">
          Les résultats seront chargés depuis le backend.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-5">
      <Table columns={columns} rows={results} rowKey="id" />
    </Card>
  )
}
