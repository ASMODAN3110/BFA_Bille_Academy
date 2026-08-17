import Table from '../ui/Table'

/* ============================================================
   RosterTable — Tableau de l'effectif (sans statut)
   ------------------------------------------------------------
   Colonnes : joueur (Prenom Nom), poste. Le backend n'a pas de
   concept de « statut » : la colonne a été retirée (Module 5).
   L'effectif n'a pas d'id stable et les noms peuvent se répéter
   → clés de lignes par index.
   ============================================================ */

const COLUMNS = [
  { key: 'nom', label: 'Joueur' },
  { key: 'poste', label: 'Poste' },
]

export default function RosterTable({ effectif }) {
  // rowKey "__index__" (absent des lignes) → Table se rabat sur l'index.
  return <Table columns={COLUMNS} rows={effectif} rowKey="__index__" />
}
