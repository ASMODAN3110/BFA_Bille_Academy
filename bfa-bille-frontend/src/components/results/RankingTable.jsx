import Table from '../ui/Table'

/* ============================================================
   RankingTable — Classement d'une catégorie
   ------------------------------------------------------------
   Colonnes (maquette) : Pos | Team | P | W | D | L | Pts.
   La ligne de la BFA Academy est mise en valeur (texte vert
   foncé), le nombre de points est en gras et doré. Le survol
   des lignes passe en gris clair (géré par le composant Table).
   ============================================================ */

const COLUMNS = [
  {
    key: 'position',
    label: 'Pos',
    render: (row) => (
      <span className="font-bold text-sombre">{row.position}</span>
    ),
  },
  {
    key: 'equipe',
    label: 'Team',
    render: (row) => (
      <span
        className={`font-semibold ${
          row.equipe.includes('BFA') ? 'text-vert' : 'text-sombre'
        }`}
      >
        {row.equipe}
      </span>
    ),
  },
  { key: 'matchsJoues', label: 'P' },
  { key: 'victoires', label: 'W' },
  { key: 'nuls', label: 'D' },
  { key: 'defaites', label: 'L' },
  {
    key: 'points',
    label: 'Pts',
    render: (row) => (
      <span className="font-extrabold tabular-nums text-dore-dark">
        {row.points}
      </span>
    ),
  },
]

export default function RankingTable({ title, teams }) {
  return (
    <div>
      {title && (
        <h4 className="mb-3 text-lg font-extrabold text-vert">{title}</h4>
      )}
      <Table columns={COLUMNS} rows={teams} rowKey="position" />
    </div>
  )
}
