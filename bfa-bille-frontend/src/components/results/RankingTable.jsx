/* ============================================================
   RankingTable — Classement d'une catégorie (maquette Claude Design)
   ------------------------------------------------------------
   Colonnes : # · Équipe · J · G · N · P · Pts, en-tête vert. La ligne
   de la BFA Academy (nom contenant « BFA ») est surlignée en vert pâle.
   ============================================================ */

const HEAD = 'px-3 py-3 text-[13px] font-semibold tracking-[0.04em]'

export default function RankingTable({ title, teams }) {
  return (
    <div>
      {title && (
        <h3 className="mb-3 text-lg font-semibold text-[#14231a]">{title}</h3>
      )}
      <div className="overflow-hidden rounded-[20px] border border-[#e3ede6] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[15px]">
            <thead>
              <tr className="bg-vert text-white">
                <th scope="col" className={`${HEAD} pl-4`}>#</th>
                <th scope="col" className={HEAD}>ÉQUIPE</th>
                <th scope="col" className={`${HEAD} text-center`} title="Matchs joués">J</th>
                <th scope="col" className={`${HEAD} text-center`} title="Victoires">G</th>
                <th scope="col" className={`${HEAD} text-center`} title="Nuls">N</th>
                <th scope="col" className={`${HEAD} text-center`} title="Défaites">P</th>
                <th scope="col" className={`${HEAD} pr-4 text-right`}>PTS</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((row) => {
                const isBfa = String(row.equipe).includes('BFA')
                return (
                  <tr
                    key={row.position}
                    className={`border-b border-[#e3ede6] last:border-b-0 ${
                      isBfa ? 'bg-[#f2faf4] font-semibold' : ''
                    }`}
                  >
                    <td className={`py-3.5 pl-4 pr-3 ${isBfa ? 'font-bold text-vert' : 'text-sombre/70'}`}>
                      {row.position}
                    </td>
                    <td className="px-3 py-3.5">{row.equipe}</td>
                    <td className="px-3 py-3.5 text-center tabular-nums">{row.matchsJoues}</td>
                    <td className="px-3 py-3.5 text-center tabular-nums">{row.victoires}</td>
                    <td className="px-3 py-3.5 text-center tabular-nums">{row.nuls}</td>
                    <td className="px-3 py-3.5 text-center tabular-nums">{row.defaites}</td>
                    <td className="py-3.5 pl-3 pr-4 text-right font-bold tabular-nums">{row.points}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
