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
  useRevealOnce,
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
  const { ref, initial, animate } = useRevealOnce('valeurs')

  return (
    <section id="valeurs" className="bg-[#fafcfa] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Nos Piliers"
          align="left"
          decor={false}
          subtitle="Les valeurs qui guident chaque joueur, chaque entraîneur, chaque entraînement."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial={initial}
          animate={animate}
          className="grid gap-8 md:grid-cols-3"
        >
          {values.map((value) => (
            <motion.div key={value.id} variants={staggerItem}>
              <Card variant="elevated" className="h-full rounded-[20px] border-[#e3ede6] p-7 shadow-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-menthe text-vert">
                  <FontAwesomeIcon
                    icon={VALUE_ICONS[value.icon]}
                    className="h-6 w-6"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#14231a]">
                  {value.title}
                </h3>
                <p className="mt-2 leading-relaxed text-sombre/80">
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
