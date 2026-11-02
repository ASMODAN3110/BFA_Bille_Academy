import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { staggerItem } from '../../hooks/useScrollAnimation'

/* ============================================================
   StatCard — Carte de chiffre clé du tableau de bord
   ------------------------------------------------------------
   - Libellé, grande valeur (Barlow Condensed), pastille de détail
   - Petite icône sur fond menthe (accent passé en prop)
   ============================================================ */

export default function StatCard({ label, value, subtitle, icon, tone = 'default' }) {
  const chip =
    tone === 'warn'
      ? 'bg-[#fff3c9] text-dore-dark'
      : tone === 'bad'
        ? 'bg-red-50 text-red-700'
        : 'bg-menthe text-vert-dark'

  return (
    <motion.div
      variants={staggerItem}
      className="flex h-full flex-col gap-2 rounded-2xl border border-[#e3ede6] bg-white p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-sombre/75">{label}</p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-menthe text-vert">
          <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="font-display text-4xl font-bold leading-none tabular-nums text-[#14231a] sm:text-[44px]">
        {value}
      </p>
      <p className={`w-fit max-w-full rounded-lg px-2.5 py-0.5 text-xs font-semibold leading-snug ${chip}`}>
        {subtitle}
      </p>
    </motion.div>
  )
}
