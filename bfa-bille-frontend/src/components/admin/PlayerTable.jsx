import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faTrash,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Table from '../ui/Table'
import { getAge } from '../../utils/ageUtils'

/* ============================================================
   PlayerTable — Tableau des joueurs (admin)
   ------------------------------------------------------------
   - Colonnes : Joueur (photo/initiales + nom), Catégorie, Poste,
     Âge (calculé depuis dateNaissance), Actions
   - Réutilise `Table` (en-tête vert, lignes alternées)
   ============================================================ */

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

const initials = (row) =>
  `${row.prenom?.[0] ?? ''}${row.nom?.[0] ?? ''}`.toUpperCase() || '?'

export default function PlayerTable({ players, onEdit, onDelete }) {
  const columns = [
    {
      key: 'nom',
      label: 'Joueur',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img
              src={row.photo}
              alt={row.nom}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vert/10 text-xs font-bold text-vert">
              {initials(row)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-sombre">{row.nom}</p>
            <p className="truncate text-xs text-sombre/60">{row.prenom}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (row) => (
        <Badge variant="selected">{row.categorie?.nom ?? '—'}</Badge>
      ),
    },
    { key: 'poste', label: 'Poste' },
    {
      key: 'age',
      label: 'Âge',
      render: (row) =>
        `${row.dateNaissance ? getAge(row.dateNaissance) : '—'} ans`,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row)}
            aria-label={`Modifier ${row.nom}`}
            className={`${actionButtonClasses} text-vert hover:bg-vert/10`}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            aria-label={`Supprimer ${row.nom}`}
            className={`${actionButtonClasses} text-erreur hover:bg-erreur/10`}
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (players.length === 0) {
    return (
      <Card className="p-10 text-center">
        <FontAwesomeIcon
          icon={faUsers}
          className="mx-auto h-10 w-10 text-sombre/20"
        />
        <p className="mt-3 font-bold text-sombre/70">
          Aucun joueur pour le moment.
        </p>
        <p className="mt-1 text-sm text-sombre/50">
          Ajoutez le premier joueur pour l'afficher ici.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-5">
      <Table columns={columns} rows={players} rowKey="id" />
    </Card>
  )
}
