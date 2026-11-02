/* ============================================================
   Table — Tableau réutilisable (responsive)
   ------------------------------------------------------------
   - columns : [{ key, label, render? }]
   - rows    : array d'objets (une ligne par élément)
   - ≥ md : tableau classique, en-tête clair, survol menthe, scroll
     horizontal de secours
   - < md (téléphone) : chaque ligne devient une carte
       · colonne sans libellé (ex. case à cocher) → en tête de carte
       · première colonne libellée → titre de la carte
       · autres colonnes → paires « libellé / valeur »
       · colonne `actions` → pied de carte
   - `minWidth` : largeur minimale du <table> (px) en mode tableau.
   - `col.header` : contenu d'en-tête personnalisé (ex. case « tout cocher »)
   - `rowClassName(row)` : fond de ligne (défaut `bg-white`)
   - `cards={false}` garde le tableau (défilant) même sur mobile.
   ============================================================ */

export default function Table({
  columns = [],
  rows = [],
  rowKey = 'id',
  className = '',
  minWidth = 420,
  cards = true,
  rowClassName,
}) {
  const lead = columns.filter((c) => !c.label && c.key !== 'actions')
  const actions = columns.find((c) => c.key === 'actions')
  const body = columns.filter((c) => c.label && c.key !== 'actions')
  const [title, ...rest] = body

  return (
    <>
      <div className={`${cards ? 'hidden md:block' : ''} overflow-x-auto ${className}`}>
        <table
          className="w-full text-left text-sm"
          style={{ minWidth: `${minWidth}px` }}
        >
          <thead>
            <tr className="border-b border-[#e3ede6] bg-[#fafcfa] text-sombre/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                >
                  {col.header ?? col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef3ef]">
            {rows.map((row, index) => (
              <tr
                key={row[rowKey] ?? index}
                className={`${rowClassName?.(row) ?? 'bg-white'} transition-colors hover:bg-[#f4f9f6]`}
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

      {cards && (
        <ul className="divide-y divide-[#eef3ef] md:hidden">
          {rows.map((row, index) => (
            <li key={row[rowKey] ?? index} className={`space-y-3 px-4 py-4 ${rowClassName?.(row) ?? 'bg-white'}`}>
              <div className="flex items-start gap-3">
                {lead.map((col) => (
                  <div key={col.key} className="shrink-0 pt-1">
                    {col.render ? col.render(row) : row[col.key]}
                  </div>
                ))}
                {title && (
                  <div className="min-w-0 flex-1 text-sm text-sombre">
                    {title.render ? title.render(row) : row[title.key]}
                  </div>
                )}
              </div>

              {rest.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {rest.map((col) => (
                    <div key={col.key} className={`min-w-0 ${col.wide ? 'col-span-2' : ''}`}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-sombre/65">
                        {col.label}
                      </dt>
                      <dd className="mt-0.5 text-sombre">
                        {col.render ? col.render(row) : row[col.key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {actions && (
                <div className="flex justify-end border-t border-[#eef3ef] pt-3">
                  {actions.render ? actions.render(row) : row[actions.key]}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
