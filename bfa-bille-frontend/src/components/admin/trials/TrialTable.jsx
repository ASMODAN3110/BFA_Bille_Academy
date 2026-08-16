import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import Table from '../../ui/Table'
import TrialActions from './TrialActions'
import { parseLocalDate, formatDateCard } from '../../../utils/dateUtils'

/* ============================================================
   TrialTable — Tableau des demandes d'essai (admin)
   ------------------------------------------------------------
   - Colonnes : Candidat, Âge/Poste, Catégorie, Date, Statut,
     Actions (Valider / Refuser / Voir détails / Supprimer)
   - Sélection par case à cocher (actions groupées)
   - Scroll horizontal automatique sur tablettes/mobiles
   ============================================================ */

const STATUS_VARIANT = {
  'En attente': 'warning',
  Confirmé: 'success',
  Refusé: 'danger',
}

/* Le mock admin stocke parfois le nom complet dans « nom »
   (ex : « Lucas Dupont ») — évite la duplication « Lucas Lucas Dupont ». */
const displayName = (t) =>
  t.prenom && t.nom && t.nom.includes(t.prenom)
    ? t.nom
    : `${t.prenom} ${t.nom}`.trim()

export default function TrialTable({
  trials,
  selectedIds,
  onToggleSelect,
  onConfirm,
  onRefuse,
  onDetails,
  onDelete,
}) {
  const columns = [
    {
      key: 'select',
      label: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => onToggleSelect(row.id)}
          aria-label={`Sélectionner ${row.prenom} ${row.nom}`}
          className="h-4 w-4 accent-vert"
        />
      ),
    },
    {
      key: 'candidat',
      label: 'Candidat',
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vert/10 text-sm font-extrabold text-vert">
            {row.nom.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sombre">
              {displayName(row)}
            </p>
            <p className="truncate text-xs text-sombre/60">
              {row.email ?? row.telephone ?? row.message}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'age',
      label: 'Âge / Poste',
      render: (row) => (
        <div>
          <p className="font-semibold text-sombre">{row.age} ans</p>
          <p className="text-xs text-sombre/60">{row.poste ?? '—'}</p>
        </div>
      ),
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (row) => <Badge variant="selected">{row.categorie}</Badge>,
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) =>
        formatDateCard(
          parseLocalDate(
            row.dateSoumission?.slice(0, 10) ?? row.dateEssai ?? row.dateCandidature,
          ),
        ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.statut] ?? 'default'}>
          {row.statut}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <TrialActions
          trial={row}
          onConfirm={onConfirm}
          onRefuse={onRefuse}
          onDetails={onDetails}
          onDelete={onDelete}
        />
      ),
    },
  ]

  if (trials.length === 0) {
    return (
      <Card className="p-10 text-center">
        <FontAwesomeIcon
          icon={faClipboardList}
          className="mx-auto h-10 w-10 text-sombre/20"
        />
        <p className="mt-3 font-bold text-sombre/70">
          Aucune demande d'essai pour le moment.
        </p>
        <p className="mt-1 text-sm text-sombre/50">
          Les candidatures du formulaire public apparaîtront ici.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-5">
      <Table columns={columns} rows={trials} rowKey="id" />
    </Card>
  )
}
