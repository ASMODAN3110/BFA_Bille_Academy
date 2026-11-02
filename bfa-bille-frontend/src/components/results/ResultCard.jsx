import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   ResultCard — Carte d'un résultat de match (maquette Claude Design)
   ------------------------------------------------------------
   En-tête : « date · catégorie · type » et, quand l'équipe BFA est
   identifiable (nom contenant « BFA »), une pastille Victoire (menthe) /
   Nul (grise) / Défaite (dorée). Corps : équipe A (alignée à droite),
   score dans un bloc menthe, équipe B.
   ============================================================ */

/** Issue du match du point de vue de la BFA, ou null si inconnue. */
function outcome(result) {
  const a = String(result.equipeA ?? '').includes('BFA')
  const b = String(result.equipeB ?? '').includes('BFA')
  if (a === b) return null // aucune ou les deux équipes BFA
  const mine = a ? result.scoreA : result.scoreB
  const theirs = a ? result.scoreB : result.scoreA
  if (mine > theirs) return { label: 'Victoire', tone: 'bg-menthe text-[#0f6b33]' }
  if (mine < theirs) return { label: 'Défaite', tone: 'bg-[#fff4cc] text-dore-dark' }
  return { label: 'Nul', tone: 'bg-[#eef2ef] text-sombre/80' }
}

export default function ResultCard({ result }) {
  const issue = outcome(result)

  return (
    <li className="rounded-[20px] border border-[#e3ede6] bg-white px-5 py-[18px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-vert/10">
      <div className="mb-2.5 flex items-center justify-between gap-3 text-sm text-sombre/70">
        <span>
          {[formatDateCard(parseLocalDate(result.date)), result.categorie, result.type]
            .filter(Boolean)
            .join(' · ')}
        </span>
        {issue && (
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${issue.tone}`}>
            {issue.label}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="min-w-0 flex-1 break-words text-right text-sm font-semibold text-[#14231a] sm:text-base">
          {result.equipeA}
        </span>
        <span className="min-w-[88px] shrink-0 rounded-xl bg-[#f2faf4] px-3 py-1.5 text-center font-display text-3xl font-extrabold leading-none tabular-nums text-[#14231a]">
          {result.scoreA} – {result.scoreB}
        </span>
        <span className="min-w-0 flex-1 break-words text-sm font-semibold text-[#14231a] sm:text-base">
          {result.equipeB}
        </span>
      </div>
    </li>
  )
}
