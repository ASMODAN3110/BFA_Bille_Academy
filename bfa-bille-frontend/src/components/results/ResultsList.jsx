import ResultCard from './ResultCard'
import { parseLocalDate } from '../../utils/dateUtils'

/* ============================================================
   ResultsList — Liste des résultats (maquette Claude Design)
   ------------------------------------------------------------
   Une carte par match, du plus récent au plus ancien (la date est
   dans l'en-tête de chaque carte). État vide si aucun résultat.
   ============================================================ */

export default function ResultsList({ results = [] }) {
  if (results.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-dore/40 bg-white px-6 py-12 text-center">
        <p className="text-sm text-sombre/75">
          Aucun résultat dans cette catégorie pour le moment.
        </p>
      </div>
    )
  }

  const sorted = [...results].sort(
    (a, b) => parseLocalDate(b.date) - parseLocalDate(a.date),
  )

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </ul>
  )
}
