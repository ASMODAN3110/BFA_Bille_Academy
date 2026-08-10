import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../ui/Card'
import { staggerItem } from '../../hooks/useScrollAnimation'

/* ============================================================
   StatCard — Carte de statistique du tableau de bord
   ------------------------------------------------------------
   - Libellé (uppercase), valeur (vert foncé), sous-titre
   - Pastille d'icône colorée (accent passé en prop)
   - Survol : scale 1.02 + ombre renforcée
   ============================================================ */

export default function StatCard({ label, value, subtitle, icon, accent }) {
  return (
    <motion.div variants={staggerItem} className="h-full">
      <Card className="flex h-full items-start justify-between gap-4 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-vert/15">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-sombre/50">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-vert">
            {value}
          </p>
          <p className="mt-1 truncate text-xs text-sombre/60">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${accent}`}
        >
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </div>
      </Card>
    </motion.div>
  )
}
