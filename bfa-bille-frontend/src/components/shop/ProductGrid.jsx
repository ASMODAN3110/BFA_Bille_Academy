import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import ProductCard from './ProductCard'
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation'

/* ============================================================
   ProductGrid — Grille des produits de la boutique
   ------------------------------------------------------------
   - 4 colonnes desktop, 2 colonnes tablette, 1 colonne mobile
   - Cascade d'apparition (staggerContainer / staggerItem)
   - État vide lorsqu'aucun produit ne correspond aux filtres
   ============================================================ */

export default function ProductGrid({ products, onQuote }) {
  if (products.length === 0) {
    return (
      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-md rounded-2xl border border-dashed border-dore/40 bg-white px-6 py-14 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clair text-dore-dark">
          <FontAwesomeIcon icon={faCartShopping} className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-bold text-sombre">
          Aucun produit dans cette catégorie
        </h3>
        <p className="mt-2 text-sm text-sombre/60">
          De nouveaux produits dérivés arrivent bientôt dans la boutique.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuote={onQuote} />
      ))}
    </motion.div>
  )
}
