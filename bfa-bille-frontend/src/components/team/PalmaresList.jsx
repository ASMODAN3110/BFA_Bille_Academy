import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   PalmaresList — Palmarès de la catégorie
   ------------------------------------------------------------
   Icône de trophée, titre en gras, saison et description.
   Apparition en cascade (stagger) au scroll.
   ============================================================ */

export default function PalmaresList({ palmares }) {
  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="space-y-4"
    >
      {palmares.map((item, index) => (
        <motion.div
          key={`${item.titre}-${index}`}
          variants={staggerItem}
          className="flex items-start gap-4 rounded-2xl border border-clair p-4"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dore/15 text-dore-dark">
            <FontAwesomeIcon icon={faTrophy} className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold text-sombre">{item.titre}</p>
            <p className="text-sm font-semibold text-vert">{item.saison}</p>
            <p className="mt-1 text-sm text-sombre/70">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
