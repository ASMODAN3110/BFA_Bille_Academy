import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { staggerItem } from '../../hooks/useScrollAnimation'

/* Badge du type de match :
   - Championnat : vert foncé sur fond vert clair (variante selected)
   - Amical      : doré sur fond doré clair (variante mvp) */
const TYPE_BADGE = {
  Championnat: 'selected',
  Amical: 'mvp',
}

/* ============================================================
   ResultCard — Carte d'un résultat de match
   ------------------------------------------------------------
   Équipes en vert foncé, score en gras et doré ("3 - 0"),
   badge de type (Championnat/Amical) et catégorie. Survol :
   ombre renforcée.
   ============================================================ */

export default function ResultCard({ result }) {
  const badgeVariant = TYPE_BADGE[result.type] ?? 'selected'

  return (
    <motion.div variants={staggerItem}>
      <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-vert/10">
        <div className="flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
          {/* Équipes + score */}
          <div className="flex flex-1 items-center justify-between gap-3 md:justify-center md:gap-8">
            <span className="text-sm font-bold text-vert sm:text-base">
              {result.equipeA}
            </span>
            <span className="whitespace-nowrap text-xl font-extrabold tabular-nums text-dore-dark sm:text-2xl">
              {result.scoreA} - {result.scoreB}
            </span>
            <span className="text-sm font-bold text-vert sm:text-base">
              {result.equipeB}
            </span>
          </div>

          {/* Type + catégorie */}
          <div className="flex items-center justify-between gap-3 md:justify-end md:gap-4">
            <Badge variant={badgeVariant}>{result.type}</Badge>
            <span className="text-xs font-semibold uppercase tracking-wider text-sombre/50">
              {result.categorie}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
