import { motion } from 'framer-motion'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   ObjectivesList — Objectifs de la saison
   ------------------------------------------------------------
   Liste à puces stylisées avec un point doré, en cascade.
   ============================================================ */

export default function ObjectivesList({ objectifs }) {
  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <motion.ul
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="space-y-3"
    >
      {objectifs.map((objectif, index) => (
        <motion.li
          key={`${objectif}-${index}`}
          variants={staggerItem}
          className="flex items-start gap-3"
        >
          <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-dore" />
          <span className="text-sombre/80">{objectif}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}
