import { useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarCheck,
  faFutbol,
  faMedal,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import SectionTitle from '../ui/SectionTitle'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ⚠️ Plus de données mock : la section part vide (aucune statistique
   pour le moment). Sera branchée au backend (module « Chiffres clés »). */
const stats = []

/* ============================================================
   Stats — Chiffres clés avec compteur animé
   ------------------------------------------------------------
   Le compteur démarre lorsque la section entre dans le viewport.
   ============================================================ */

const STAT_ICONS = {
  futbol: faFutbol,
  users: faUsers,
  medal: faMedal,
  'calendar-check': faCalendarCheck,
}

/* Petit composant compteur animé (0 → valeur) */
function Counter({ value, isInView }) {
  const nodeRef = useRef(null)

  useEffect(() => {
    if (!isInView) return undefined

    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = String(Math.round(latest))
        }
      },
    })
    return () => controls.stop()
  }, [isInView, value])

  return <span ref={nodeRef}>0</span>
}

export default function Stats() {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.3 })

  // Section masquée tant qu'aucune statistique n'est disponible.
  if (stats.length === 0) return null

  return (
    <section id="stats" className="relative overflow-hidden bg-vert-dark py-20 md:py-24">
      {/* Décor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-dore/10 blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          light
          title="Nos Chiffres Clés"
          subtitle="Le fruit d'un travail exigeant et passionné, saison après saison."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="rounded-2xl border border-dore/20 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:border-dore/50 md:p-8"
            >
              <FontAwesomeIcon
                icon={STAT_ICONS[stat.icon]}
                className="mx-auto h-8 w-8 text-dore"
              />
              <p className="mt-4 text-4xl font-black text-white md:text-5xl">
                <Counter value={stat.value} isInView={isInView} />
                <span className="text-dore">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
