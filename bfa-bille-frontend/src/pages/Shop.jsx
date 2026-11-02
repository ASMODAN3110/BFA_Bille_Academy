import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/layout/PageHero'
import ProductFilters from '../components/shop/ProductFilters'
import ProductGrid from '../components/shop/ProductGrid'
import QuoteForm from '../components/shop/QuoteForm'
import QuoteCartButton from '../components/shop/QuoteCartButton'
import useQuoteCart from '../hooks/useQuoteCart'
import { api } from '../utils/api'
import { normalizeProduct } from '../utils/shopAdapter'

/* ============================================================
   Boutique — Page « Boutique officielle » (/boutique), maquette Claude Design
   ------------------------------------------------------------
   - Filtres par catégorie (Tous, Nouveautés, Vêtements,
     Accessoires)
   - Grille 4/2/1 colonnes (@EF44)
   - Badge « NOUVEAU » doré sur les produits estNouveau
   - « Ajouter au devis » : les produits choisis sont réunis dans
     UN SEUL devis (« Mon devis », bouton flottant) ; la fenêtre
     QuoteForm règle taille / quantité de chaque article et envoie
     la demande
   ============================================================ */

const CATEGORIES = ['Tous', 'Nouveautés', 'Vêtements', 'Équipement', 'Accessoires']

export default function Shop() {
  const [products, setProducts] = useState([])
  const [productsLoaded, setProductsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const cart = useQuoteCart()
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const loadProducts = useCallback(async () => {
    try {
      const data = await api('/api/products?limit=100')
      // Les produits en rupture de stock ne sont pas proposés dans la boutique
      // (l'API public les exclut déjà ; ce filtre protège aussi d'un ancien serveur).
      setProducts(
        (data?.data?.items ?? []).map(normalizeProduct).filter((p) => p.stock > 0),
      )
      setProductsLoaded(true)
    } catch (err) {
      setError(err?.message || 'Impossible de charger la boutique.')
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  /* Un produit passé en rupture (ou retiré) alors qu'il était déjà dans « Mon devis »
     (sélection conservée d'une visite à l'autre) en est retiré, avec un message. */
  useEffect(() => {
    if (!productsLoaded) return
    const removed = cart.retainOnly(new Set(products.map((p) => p.id)))
    if (removed > 0)
      setNotice(
        removed > 1
          ? `${removed} produits ne sont plus disponibles : retirés de votre devis.`
          : "Un produit n'est plus disponible : retiré de votre devis.",
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsLoaded, products])

  /* Message bref après un ajout (annoncé aux lecteurs d'écran, disparaît seul). */
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), 2500)
    return () => clearTimeout(timer)
  }, [notice])

  const handleAdd = (product) => {
    setNotice(
      cart.add(product)
        ? `« ${product.nom} » ajouté à votre devis`
        : 'Votre devis est complet (20 articles maximum).',
    )
  }

  // Produits filtrés selon la catégorie sélectionnée.
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Tous') return products
    if (selectedCategory === 'Nouveautés')
      return products.filter((product) => product.estNouveau)
    return products.filter((product) => product.categorie === selectedCategory)
  }, [selectedCategory, products])

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Boutique' }]}
        title="Boutique officielle"
        lead="Maillots et produits dérivés de l'académie. Demandez un devis, nous vous répondons rapidement."
      />

      <section id="boutique" className="bg-[#fafcfa] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductFilters
            categories={CATEGORIES}
            active={selectedCategory}
            onChange={setSelectedCategory}
          />

          <p className="mb-6 mt-8 text-sm text-sombre/75" aria-live="polite">
            {filteredProducts.length} produit
            {filteredProducts.length > 1 ? 's' : ''}
          </p>

          {error && (
            <div
              role="alert"
              className="mb-8 rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
            >
              {error}
            </div>
          )}

          {/* Grille — re-animée (fondu) à chaque changement de filtre */}
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <ProductGrid
              products={filteredProducts}
              onAdd={handleAdd}
              quantityOf={cart.quantityOf}
              quoteFull={cart.isFull}
            />
          </motion.div>
        </div>
      </section>

      {/* Bouton flottant « Mon devis » + fenêtre du devis (toujours montée) */}
      <QuoteCartButton
        count={quoteOpen ? 0 : cart.count}
        notice={quoteOpen ? '' : notice}
        onClick={() => setQuoteOpen(true)}
      />
      <QuoteForm
        open={quoteOpen}
        items={cart.items}
        onUpdate={cart.update}
        onRemove={cart.remove}
        onClose={() => setQuoteOpen(false)}
        onSent={cart.clear}
      />
    </>
  )
}
