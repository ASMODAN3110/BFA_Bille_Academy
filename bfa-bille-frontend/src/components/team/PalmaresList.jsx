import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   PalmaresList — Palmarès de la catégorie (maquette Claude Design)
   ------------------------------------------------------------
   Le backend renvoie le palmarès en texte multiligne (une ligne par
   titre). Si une ligne contient une année (20xx), elle est mise en
   pastille dorée devant le texte ; sinon un trophée la remplace.
   ============================================================ */

const YEAR = /\b(19|20)\d{2}(?:\s*[-–/]\s*(?:19|20)?\d{2})?\b/

function PalmaresRow({ line }) {
  const match = line.match(YEAR)
  if (!match) {
    return (
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff4cc] text-dore-dark"
        >
          <FontAwesomeIcon icon={faTrophy} className="h-4 w-4" />
        </span>
        <span className="min-w-0 break-words">{line}</span>
      </div>
    )
  }

  const year = match[0].trim()
  const text = line.replace(match[0], '').replace(/\s{2,}/g, ' ').replace(/[\s(–-]+$/, '').trim()
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 rounded-full bg-[#fff4cc] px-3 py-1 text-xs font-semibold text-dore-dark">
        {year}
      </span>
      <span className="min-w-0 break-words">{text || line}</span>
    </div>
  )
}

export default function PalmaresList({ palmares }) {
  if (palmares.length === 0) {
    return <p className="text-sm text-sombre/70">Palmarès non renseigné.</p>
  }

  return (
    <ul className="flex flex-col gap-3.5 rounded-[20px] border border-[#e3ede6] bg-white p-6">
      {palmares.map((line, index) => (
        <li key={`${line}-${index}`}>
          <PalmaresRow line={line} />
        </li>
      ))}
    </ul>
  )
}
