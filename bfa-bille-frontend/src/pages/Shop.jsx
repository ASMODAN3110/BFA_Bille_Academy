import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import ProductFilters from '../components/shop/ProductFilters'
import ProductGrid from '../components/shop/ProductGrid'
import QuoteForm from '../components/shop/QuoteForm'
import { products } from '../data/mockData'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   Boutique — Page « Boutique et produits dérivés » (/boutique)
   ------------------------------------------------------------
   - Filtres par catégorie (Tous, Nouveautés, Vêtements,
     Accessoires)
   - Grille 4/2/1 colonnes (@EF44)
   - Badge « NOUVEAU » doré sur les produits estNouveau
   - Clic « Devis » → ouvre la modale QuoteForm (produit
     pré-rempli)
   ============================================================ */

const CATEGORIES = ['Tous', 'Nouveautés', 'Vêtements', 'Accessoires']

export default function Shop() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Produits filtrés selon la catégorie sélectionnée.
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Tous') return products
    if (selectedCategory === 'Nouveautés')
      return products.filter((product) => product.estNouveau)
    return products.filter((product) => product.categorie === selectedCategory)
  }, [selectedCategory])

  return (
    <section id="boutique" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Notre Boutique"
            subtitle="T-shirts, survêtements, accessoires et plus encore. Demandez un devis pour composer votre commande aux couleurs de la BFA."
          />
        </motion.div>

        <ProductFilters
          categories={CATEGORIES}
          active={selectedCategory}
          onChange={setSelectedCategory}
        />

        <p className="mb-8 text-center text-sm text-sombre/60">
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? 's' : ''}
          {selectedCategory !== 'Tous' && ` · ${selectedCategory}`}
        </p>

        {/* Grille — re-animée (fade-in) à chaque changement de filtre */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <ProductGrid
            products={filteredProducts}
            onQuote={setSelectedProduct}
          />
        </motion.div>
      </div>

      {/* Modale de demande de devis (toujours montée) */}
      <QuoteForm
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}
