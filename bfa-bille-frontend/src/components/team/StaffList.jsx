import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   StaffList — Liste du staff technique
   ------------------------------------------------------------
   Cartes verticales : avatar, nom, rôle (vert) et qualification.
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
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {staff.map((member) => (
        <motion.div
          key={member.nom}
          variants={staggerItem}
          className="flex items-start gap-4 rounded-2xl border border-clair bg-clair/40 p-4"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert text-white">
            <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-dore" />
          </span>
          <div>
            <p className="font-bold text-sombre">{member.nom}</p>
            <p className="text-sm font-semibold text-vert">{member.role}</p>
            <p className="mt-1 text-xs text-sombre/60">
              {member.qualification}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
