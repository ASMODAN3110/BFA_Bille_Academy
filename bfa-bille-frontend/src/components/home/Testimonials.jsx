import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import SectionTitle from '../ui/SectionTitle'
import { testimonials } from '../../data/mockData'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   Testimonials — Témoignages (parents & joueurs)
   ============================================================ */

export default function Testimonials() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="temoignages" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Ils Témoignent"
          subtitle="La parole aux parents, aux joueurs et à ceux qui font vivre l'académie."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.id} variants={staggerItem}>
              <Card variant="elevated" className="flex h-full flex-col p-8">
                {/* Guillemet */}
                <div className="flex items-center justify-between">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="h-8 w-8 text-dore/70"
                  />
                  {/* Étoiles */}
                  <div className="flex gap-1" aria-label={`Note : ${t.rating} sur 5`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className="h-4 w-4 text-dore"
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-5 flex-1 text-sm italic leading-relaxed text-sombre/80">
                  « {t.text} »
                </p>

                {/* Auteur */}
                <div className="mt-6 flex items-center gap-4 border-t border-clair pt-6">
                  <img
                    src={t.image}
                    alt={`Photo de ${t.name}`}
                    loading="lazy"
                    className="h-12 w-12 rounded-full border-2 border-dore object-cover"
                  />
                  <div>
                    <p className="font-bold text-vert">{t.name}</p>
                    <p className="text-xs text-sombre/60">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
