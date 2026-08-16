import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import SectionTitle from '../ui/SectionTitle'
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ⚠️ Plus de données mock : la section part vide (aucune
   actualité). Sera branchée au backend (module « Blog »). */
const news = []

/* ============================================================
   News — Dernières actualités (3 articles)
   ============================================================ */

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function News() {
  const { ref, isInView } = useScrollAnimation()

  // Section masquée tant qu'aucune actualité n'est publiée.
  if (news.length === 0) return null

  return (
    <section id="actualites" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Dernières Actualités"
          subtitle="Suivez la vie de l'académie, les victoires et les grands rendez-vous."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-3"
        >
          {news.map((article) => (
            <motion.div key={article.id} variants={staggerItem}>
              <Card variant="elevated" className="flex h-full flex-col overflow-hidden">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-dore px-3 py-1 text-xs font-bold uppercase tracking-wide text-vert-dark">
                    {article.date.split('-')[1]} / {article.date.split('-')[0]}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-dore-dark">
                    {formatDate(article.date)}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-sombre">
                    {article.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-sombre/70">
                    {article.excerpt}
                  </p>
                  <Link
                    to={article.link}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-vert transition-colors hover:text-dore-dark"
                  >
                    Lire la suite
                    <FontAwesomeIcon icon={faArrowRightLong} className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
