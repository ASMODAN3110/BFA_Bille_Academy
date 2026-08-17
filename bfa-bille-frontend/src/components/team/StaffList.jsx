import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   StaffList — Staff technique (lignes de texte)
   ------------------------------------------------------------
   Le backend renvoie le staff en texte multiligne (une personne
   par ligne, « Rôle : Nom ») → chaque ligne est rendue telle quelle
   (ne pas sur-parser : l'admin saisit du texte libre).
   Apparition en cascade (stagger) au scroll.
   ============================================================ */

export default function StaffList({ staff }) {
  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="space-y-3"
    >
      {staff.map((line, index) => (
        <motion.div
          key={`${line}-${index}`}
          variants={staggerItem}
          className="flex items-start gap-4 rounded-2xl border border-clair bg-clair/40 p-4"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert text-white">
            <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-dore" />
          </span>
          <p className="pt-2.5 font-semibold text-sombre">{line}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
