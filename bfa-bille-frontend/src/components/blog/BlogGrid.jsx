import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import BlogCard from './BlogCard'
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation'

/* ============================================================
   BlogGrid — Grille des articles du blog
   ------------------------------------------------------------
   - 2 colonnes desktop, 1 colonne tablette / mobile
   - Cascade d'apparition (staggerContainer / staggerItem)
   - État vide lorsqu'aucun article ne correspond aux filtres
   ============================================================ */

export default function BlogGrid({ posts }) {
  if (posts.length === 0) {
    return (
      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-md rounded-2xl border border-dashed border-dore/40 bg-white px-6 py-14 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clair text-dore-dark">
          <FontAwesomeIcon icon={faNewspaper} className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-bold text-sombre">
          Aucun article dans cette catégorie
        </h3>
        <p className="mt-2 text-sm text-sombre/60">
          Le club publiera prochainement de nouveaux articles. Revenez bientôt !
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-8 md:grid-cols-2"
    >
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </motion.div>
  )
}
