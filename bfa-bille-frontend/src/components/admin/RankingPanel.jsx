import { useEffect, useState } from 'react'
import { api } from '../../utils/api'

/* ============================================================
   RankingPanel — « Classement {catégorie} » (admin/résultats)
   ------------------------------------------------------------
   - GET /api/rankings/:categorieId (public), recalculé côté
     backend à chaque écriture de résultat : `refreshKey` force
     un rechargement après un ajout / une modification
   - La ligne de la BFA est mise en avant
   ============================================================ */

export default function RankingPanel({ categorie, refreshKey = 0 }) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    api(`/api/rankings/${categorie.id}`)
      .then((res) => {
        if (!active) return
        setItems(res?.data?.items ?? [])
        setError(false)
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => {
      active = false
    }
  }, [categorie.id, refreshKey])

  return (
    <section className="min-w-0 flex-1 basis-80 overflow-hidden rounded-2xl border border-[#e3ede6] bg-white">
      <h2 className="px-[18px] py-4 text-base font-bold">Classement {categorie.nom}</h2>
      {error ? (
        <p className="px-[18px] pb-5 text-sm text-erreur">Classement indisponible.</p>
      ) : items === null ? (
        <p className="px-[18px] pb-5 text-sm text-sombre/75">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="px-[18px] pb-5 text-sm text-sombre/75">
          Aucun match enregistré dans cette catégorie.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafcfa] text-left text-xs uppercase text-sombre/70">
              <th scope="col" className="px-[18px] py-2.5 font-semibold">#</th>
              <th scope="col" className="py-2.5 font-semibold">Équipe</th>
              <th scope="col" className="py-2.5 font-semibold">J</th>
              <th scope="col" className="px-[18px] py-2.5 font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l) => {
              const bfa = l.equipe.includes('BFA')
              return (
                <tr
                  key={l.equipe}
                  className={`border-t border-[#eef3ef] ${bfa ? 'bg-[#f1f8f3]' : ''}`}
                >
                  <td className={`px-[18px] py-2.5 ${bfa ? 'font-bold' : ''}`}>{l.position}</td>
                  <td className={`py-2.5 ${bfa ? 'font-semibold' : ''}`}>{l.equipe}</td>
                  <td className="py-2.5">{l.matchsJoues}</td>
                  <td className="px-[18px] py-2.5 font-bold">{l.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}
