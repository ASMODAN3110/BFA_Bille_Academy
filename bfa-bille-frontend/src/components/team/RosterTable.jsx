import Table from '../ui/Table'
import Badge from '../ui/Badge'

/* ============================================================
   RosterTable — Tableau de l'effectif avec statuts
   ------------------------------------------------------------
   Colonnes : joueur, poste, statut (Badge SELECTED / MVP).
   ============================================================ */

const COLUMNS = [
  { key: 'nom', label: 'Player Name' },
  { key: 'poste', label: 'Position' },
  {
    key: 'statut',
    label: 'Status',
    render: (row) => (
      <Badge variant={row.statut === 'MVP' ? 'mvp' : 'selected'}>
        {row.statut}
      </Badge>
    ),
  },
]

export default function RosterTable({ effectif }) {
  return <Table columns={COLUMNS} rows={effectif} rowKey="nom" />
}
