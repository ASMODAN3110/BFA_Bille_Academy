import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faEye, faFilePen } from '@fortawesome/free-solid-svg-icons'
import Table from '../../ui/Table'
import Card from '../../ui/Card'
import BlogStatusBadge from './BlogStatusBadge'
import BlogActions from './BlogActions'
import { formatDateCard, parseLocalDate } from '../../../utils/dateUtils'

/* ============================================================
   BlogTable — Tableau des articles du blog
   ------------------------------------------------------------
   - Colonnes : Article / Auteur / Statut / Date / Performance /
     Actions
   - S'appuie sur le composant réutilisable <Table /> (ui/Table)
   - Clic « modifier » → onEdit, « publier/dépublier » →
     onTogglePublish, « supprimer » → onDelete
   ============================================================ */

const dateLabel = (row) => {
  const date = row.datePublication || row.dateModification
  if (!date) return '—'
  return formatDateCard(parseLocalDate(date))
}

const hasBeenModified = (row) =>
  Boolean(
    row.dateModification && row.dateModification !== row.datePublication,
  )

const COLUMNS = (handlers) => [
  {
    key: 'article',
    label: 'Article',
    render: (row) => (
      <div className="flex items-center gap-3">
        <img
          src={row.image}
          alt=""
          loading="lazy"
          className="h-12 w-16 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="line-clamp-2 font-semibold leading-snug text-sombre">
            {row.titre}
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-dore">
            {row.categorie}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'auteur',
    label: 'Auteur',
    render: (row) => (
      <span className="font-medium text-sombre/80">{row.auteur}</span>
    ),
  },
  {
    key: 'statut',
    label: 'Statut',
    render: (row) => <BlogStatusBadge statut={row.statut} />,
  },
  {
    key: 'date',
    label: 'Date',
    render: (row) => (
      <div>
        <p className="font-semibold text-sombre">{dateLabel(row)}</p>
        {hasBeenModified(row) && (
          <p className="mt-0.5 text-xs text-sombre/50">
            Modifié : {formatDateCard(parseLocalDate(row.dateModification))}
          </p>
        )}
      </div>
    ),
  },
  {
    key: 'performance',
    label: 'Performance',
    render: (row) =>
      row.estPublie ? (
        <div className="flex items-center gap-3 text-xs font-semibold text-sombre/60">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5 text-vert" />
            {row.vues ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faComments}
              className="h-3.5 w-3.5 text-dore"
            />
            {row.commentaires ?? 0}
          </span>
        </div>
      ) : (
        <span className="text-sombre/40">—</span>
      ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => <BlogActions {...handlers} post={row} />,
  },
]

export default function BlogTable({ posts, onEdit, onTogglePublish, onDelete }) {
  const handlers = { onEdit, onTogglePublish, onDelete }

  if (posts.length === 0) {
    return (
      <Card className="p-10 text-center">
        <FontAwesomeIcon
          icon={faFilePen}
          className="mx-auto h-10 w-10 text-sombre/20"
        />
        <p className="mt-3 font-bold text-sombre/70">
          Aucun article ne correspond à cette recherche.
        </p>
        <p className="mt-1 text-sm text-sombre/50">
          Modifiez les filtres ou la recherche, ou créez un nouvel article.
        </p>
      </Card>
    )
  }

  return (
    <Table
      columns={COLUMNS(handlers)}
      rows={posts}
      rowKey="id"
      className="rounded-2xl border border-clair bg-white shadow-sm"
    />
  )
}
