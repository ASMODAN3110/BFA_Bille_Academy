import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faUsers } from '@fortawesome/free-solid-svg-icons'
import Table from '../ui/Table'
import Pagination from '../ui/Pagination'
import { getAge } from '../../utils/ageUtils'

/* ============================================================
   PlayerTable — Tableau des joueurs (admin)
   ------------------------------------------------------------
   - Colonnes : case, Joueur (avatar + nom + âge), Catégorie,
     Poste, Arrivée, Fiche (complète / photo manquante),
     Actions (Modifier + menu « ⋯ »)
   - Lignes sélectionnées surlignées ; pied « 1–5 sur 86 » +
     pagination carrée (maquette Claude Design)
   - Sur téléphone, `Table` affiche chaque joueur en carte
   ============================================================ */

const initials = (row) =>
  `${row.prenom?.[0] ?? ''}${row.nom?.[0] ?? ''}`.toUpperCase() || '?'

export const playerName = (row) => [row.prenom, row.nom].filter(Boolean).join(' ')

const formatArrivee = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

const checkboxClasses = 'h-[18px] w-[18px] shrink-0 cursor-pointer accent-vert'

export default function PlayerTable({
  players,
  total,
  page,
  pageSize,
  onPageChange,
  selectedIds,
  onToggle,
  onToggleAll,
  onEdit,
  onMenu,
}) {
  const allChecked = players.length > 0 && players.every((p) => selectedIds.includes(p.id))

  const columns = [
    {
      key: 'select',
      label: '',
      header: (
        <input
          type="checkbox"
          checked={allChecked}
          onChange={onToggleAll}
          aria-label="Sélectionner tous les joueurs de la page"
          className={checkboxClasses}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => onToggle(row.id)}
          aria-label={`Sélectionner ${playerName(row)}`}
          className={checkboxClasses}
        />
      ),
    },
    {
      key: 'nom',
      label: 'Joueur',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img
              src={row.photo}
              alt=""
              loading="lazy"
              className="h-[38px] w-[38px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#fff3c9] text-sm font-bold text-dore-dark">
              {initials(row)}
            </div>
          )}
          <div className="min-w-0">
            <b className="block truncate font-semibold">{playerName(row)}</b>
            {row.dateNaissance && (
              <span className="block text-xs text-sombre/75">
                {getAge(row.dateNaissance)} ans
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (row) => (
        <span className="rounded-full bg-menthe px-2.5 py-0.5 text-xs font-semibold text-vert-dark">
          {row.categorie?.nom ?? '—'}
        </span>
      ),
    },
    { key: 'poste', label: 'Poste' },
    {
      key: 'arrivee',
      label: 'Arrivée',
      render: (row) => (
        <span className="text-sombre/75">{formatArrivee(row.dateArrivee)}</span>
      ),
    },
    {
      key: 'fiche',
      label: 'Fiche',
      render: (row) =>
        row.photo ? (
          <span className="text-[13px] font-semibold text-vert-dark">Complète</span>
        ) : (
          <span className="text-[13px] font-semibold text-dore-dark">Photo manquante</span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(row)}
            aria-label={`Modifier ${playerName(row)}`}
            className="min-h-9 rounded-lg px-3 text-sm font-semibold text-vert-dark transition hover:bg-menthe"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={(e) => onMenu(row, e.currentTarget.getBoundingClientRect())}
            aria-label={`Plus d'actions pour ${playerName(row)}`}
            aria-haspopup="menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sombre/70 transition hover:bg-[#f4f7f5]"
          >
            <FontAwesomeIcon icon={faEllipsis} className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-[#e3ede6] bg-white p-10 text-center">
        <FontAwesomeIcon icon={faUsers} className="mx-auto h-10 w-10 text-sombre/20" />
        <p className="mt-3 font-bold text-sombre/75">Aucun joueur pour cette sélection.</p>
      </div>
    )
  }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e3ede6] bg-white">
      <Table
        columns={columns}
        rows={players}
        rowKey="id"
        minWidth={760}
        rowClassName={(row) => (selectedIds.includes(row.id) ? 'bg-[#f1f8f3]' : 'bg-white')}
      />
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#eef3ef] px-4 py-3 text-[13px] text-sombre/75">
        <span>
          {from}–{to} sur {total}
        </span>
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(total / pageSize))}
          onPageChange={onPageChange}
          variant="square"
        />
      </div>
    </div>
  )
}
