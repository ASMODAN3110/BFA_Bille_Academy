/* ============================================================
   ObjectivesList — Objectifs de la saison (maquette Claude Design)
   ------------------------------------------------------------
   Une carte par objectif, précédée d'un numéro dans un rond menthe.
   ============================================================ */

export default function ObjectivesList({ objectifs }) {
  if (objectifs.length === 0) {
    return <p className="text-sm text-sombre/70">Objectifs non renseignés.</p>
  }

  return (
    <ol className="flex flex-col gap-3">
      {objectifs.map((objectif, index) => (
        <li
          key={`${objectif}-${index}`}
          className="flex items-start gap-4 rounded-[20px] border border-[#e3ede6] bg-white px-5 py-[18px]"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-menthe font-bold text-[#0f6b33]"
          >
            {index + 1}
          </span>
          <span className="min-w-0 break-words pt-0.5 leading-relaxed text-sombre/80">
            {objectif}
          </span>
        </li>
      ))}
    </ol>
  )
}
