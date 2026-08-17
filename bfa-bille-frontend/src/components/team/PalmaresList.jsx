import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   PalmaresList — Palmarès de la catégorie (lignes de texte)
   ------------------------------------------------------------
   Le backend renvoie le palmarès en texte multiligne (une ligne
   par titre) → chaque ligne est rendue telle quelle, avec l'icône
   trophée. Apparition en cascade (stagger) au scroll.
   ============================================================ */

export default function PalmaresList({ palmares }) {
  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="space-y-3"
    >
      {palmares.map((line, index) => (
        <motion.div
          key={`${line}-${index}`}
          variants={staggerItem}
          className="flex items-start gap-4 rounded-2xl border border-clair p-4"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dore/15 text-dore-dark">
            <FontAwesomeIcon icon={faTrophy} className="h-6 w-6" />
          </span>
          <p className="pt-3 font-bold text-sombre">{line}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
