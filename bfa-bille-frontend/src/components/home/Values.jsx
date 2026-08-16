import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faShieldHalved,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import SectionTitle from '../ui/SectionTitle'
import { values } from '../../config/site'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   Values — « Nos Piliers »
   ------------------------------------------------------------
   3 cartes : Former · Discipliner · Révéler
   ============================================================ */

const VALUE_ICONS = {
  'graduation-cap': faGraduationCap,
  'shield-halved': faShieldHalved,
  trophy: faTrophy,
}

export default function Values() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="valeurs" className="bg-clair py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Nos Piliers"
          subtitle="Les valeurs qui guident chaque joueur, chaque entraîneur, chaque entraînement."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-3"
        >
          {values.map((value) => (
            <motion.div key={value.id} variants={staggerItem}>
              <Card variant="elevated" className="h-full p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-vert text-dore shadow-lg shadow-vert/20">
                  <FontAwesomeIcon
                    icon={VALUE_ICONS[value.icon]}
                    className="h-7 w-7"
                  />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-vert">
                  {value.title}
                </h3>
                <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-dore" />
                <p className="mt-4 text-sm leading-relaxed text-sombre/75">
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
