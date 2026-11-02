import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { parseLocalDate } from '../../utils/dateUtils'

/* ============================================================
   ResultsTable — « Derniers matchs » (admin)
   ------------------------------------------------------------
   - Une ligne par rencontre : date, équipe A, score, équipe B,
     pastille V / N / D du point de vue de la BFA, actions
   - Sur téléphone la ligne passe sur deux niveaux (match puis
     actions) pour ne rien tronquer
   ============================================================ */

// Le seed envoie « BFA U9 » / « BFA U15 » / « BFA U17 » (jamais « BFA »
// seul) : on teste donc .includes('BFA'), pas === 'BFA'.
export function bfaResult(r) {
  if (r.equipeA.includes('BFA') && r.equipeB.includes('BFA')) return 'nul'
  const isHome = r.equipeA.includes('BFA')
  const our = isHome ? r.scoreA : r.scoreB
  const theirs = isHome ? r.scoreB : r.scoreA
  if (our > theirs) return 'victoire'
  if (our < theirs) return 'defaite'
  return 'nul'
}

const PILL = {
  victoire: { letter: 'V', label: 'Victoire', cls: 'bg-[#dcefe2] text-vert-dark' },
  nul: { letter: 'N', label: 'Nul', cls: 'bg-[#eceff0] text-[#4a5750]' },
  defaite: { letter: 'D', label: 'Défaite', cls: 'bg-[#fbe4e1] text-[#9c2a20]' },
}

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

const formatShortDate = (iso) =>
  parseLocalDate(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

export default function ResultsTable({ results, onEdit, onDelete }) {
  if (results.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <FontAwesomeIcon icon={faFutbol} className="mx-auto h-10 w-10 text-sombre/20" />
        <p className="mt-3 font-bold text-sombre/75">Aucun match pour cette sélection.</p>
      </div>
    )
  }

  return (
    <ul>
      {results.map((r) => {
        const pill = PILL[bfaResult(r)]
        const isBfa = (name) => name.includes('BFA')
        return (
          <li
            key={r.id}
            className="flex flex-wrap items-center gap-x-3.5 gap-y-2 border-t border-[#eef3ef] px-4 py-3.5 text-sm sm:px-[18px]"
          >
            <span className="w-14 shrink-0 text-[13px] text-sombre/75">
              {formatShortDate(r.date)}
            </span>
            <div className="flex min-w-0 flex-1 basis-64 items-center gap-3.5">
              <b
                className={`min-w-0 flex-1 text-right ${isBfa(r.equipeA) ? 'font-semibold' : 'font-normal'}`}
              >
                {r.equipeA}
              </b>
              <span className="min-w-[70px] text-center font-display text-[26px] font-bold tabular-nums leading-none">
                {r.scoreA} – {r.scoreB}
              </span>
              <span className={`min-w-0 flex-1 ${isBfa(r.equipeB) ? 'font-semibold' : ''}`}>
                {r.equipeB}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${pill.cls}`}
                title={`${pill.label} · ${r.type} · ${r.categorie}`}
                aria-label={pill.label}
              >
                {pill.letter}
              </span>
              <button
                type="button"
                onClick={() => onEdit(r)}
                aria-label={`Modifier ${r.equipeA} – ${r.equipeB}`}
                className={`${actionButtonClasses} text-vert hover:bg-vert/10`}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(r)}
                aria-label={`Supprimer ${r.equipeA} – ${r.equipeB}`}
                className={`${actionButtonClasses} text-erreur hover:bg-erreur/10`}
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
