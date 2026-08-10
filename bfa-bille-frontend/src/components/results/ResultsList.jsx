import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import ResultCard from './ResultCard'
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   ResultsList — Résultats groupés par date
   ------------------------------------------------------------
   Regroupe les résultats du même jour sous un en-tête de date
   ("12 Oct 2024") avec un filet doré, puis les affiche en
   cascade (staggerContainer / staggerItem). Affiche un état
   vide si aucune liste de résultats n'est fournie.
   ============================================================ */

export default function ResultsList({ results = [] }) {
  // Regroupe par date, puis trie les groupes du plus récent au
  // plus ancien (les plus récents en premier).
  const groups = useMemo(() => {
    const map = {}
    for (const result of results) {
      ;(map[result.date] ??= []).push(result)
    }
    return Object.entries(map).sort(
      (a, b) => parseLocalDate(b[0]) - parseLocalDate(a[0]),
    )
  }, [results])

  if (groups.length === 0) {
    return (
      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-dashed border-dore/40 px-6 py-12 text-center"
      >
        <FontAwesomeIcon icon={faCalendarDays} className="h-8 w-8 text-dore-dark" />
        <p className="mt-3 text-sm text-sombre/60">
          Aucun résultat dans cette catégorie pour le moment.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {groups.map(([date, items]) => (
        <motion.div key={date} variants={staggerItem}>
          {/* En-tête de date */}
          <div className="mb-3 flex items-center gap-3">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="h-4 w-4 shrink-0 text-dore-dark"
            />
            <h4 className="text-sm font-bold text-sombre">
              {formatDateCard(parseLocalDate(date))}
            </h4>
            <span className="h-px flex-1 bg-dore/30" />
          </div>

          {/* Résultats du jour */}
          <div className="space-y-3">
            {items.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
