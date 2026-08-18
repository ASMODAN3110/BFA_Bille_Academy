/* ============================================================
   Table — Tableau réutilisable
   ------------------------------------------------------------
   - columns : [{ key, label, render? }]
   - rows    : array d'objets (une ligne par élément)
   - En-tête vert, lignes alternées, survol gris clair
   - Scroll horizontal automatique sur écrans étroits
   - `minWidth` : largeur minimale du <table> (px). Défaut 420 ;
     passer 0 (ou une petite valeur) pour un tableau 2 colonnes
     qui s'adapte sans scroll (RosterTable).
   ============================================================ */

export default function Table({
  columns = [],
  rows = [],
  rowKey = 'id',
  className = '',
  minWidth = 420,
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className="w-full text-left text-sm"
        style={{ minWidth: `${minWidth}px` }}
      >
        <thead>
          <tr className="bg-vert text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-xs font-bold uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-clair">
          {rows.map((row, index) => (
            <tr
              key={row[rowKey] ?? index}
              className={`transition-colors hover:bg-clair/70 ${
                index % 2 === 1 ? 'bg-clair/40' : 'bg-white'
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sombre">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
