import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AccordionGallery from '../ui/AccordionGallery'
import useHomeData from '../../hooks/useHomeData'
import { useRevealOnce, fadeUp } from '../../hooks/useScrollAnimation'

/* ============================================================
   ShopTeaser — Section « Boutique » de la page d'accueil
   ------------------------------------------------------------
   Aperçu de la boutique en galerie accordéon (AccordionGallery) :
   jusqu'à 5 produits en stock (nouveautés d'abord) ; le produit survolé
   ou touché s'élargit et affiche son nom et son prix. Un clic sur le
   produit ouvert mène à la boutique. Masquée s'il y a moins de 2 produits.
   Apparition une seule fois par chargement de page.
   ============================================================ */

const formatPrice = (value) =>
  Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' FCFA'

function ShopTeaserContent({ products }) {
  const { ref, initial, animate } = useRevealOnce('boutique-accueil')

  const items = products.map((p) => ({
    image: p.image,
    alt: p.nom,
    label: `${p.nom} · ${formatPrice(p.prix)}`,
    link: '/boutique',
  }))

  return (
    <section id="boutique-accueil" className="bg-white py-20 md:py-24">
      <motion.div
        ref={ref}
        variants={fadeUp}
        initial={initial}
        animate={animate}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="font-display text-4xl font-bold leading-none text-[#14231a] md:text-5xl">
            Notre boutique
          </h2>
          <Link
            to="/boutique"
            className="shrink-0 text-[15px] font-semibold text-[#0f6b33] transition-colors hover:text-vert"
          >
            Voir toute la boutique →
          </Link>
        </div>
        <p className="mt-3 max-w-xl text-sombre/75">
          Maillots, ballons et accessoires aux couleurs de l&rsquo;académie. Demandez un
          devis pour composer votre commande.
        </p>

        <div className="mt-8">
          <AccordionGallery
            items={items}
            defaultIndex={Math.min(2, items.length - 1)}
            accentColor="#D4AF37"
            overlayColor="#0b2a17"
            textColor="#ffffff"
            height={460}
            radius={20}
            expandRatio={0.52}
            trigger="hover"
          />
        </div>
      </motion.div>
    </section>
  )
}

/* Les données arrivent après le premier rendu : le contenu (et son
   détecteur de scroll) n'est monté qu'une fois qu'elles sont là. */
export default function ShopTeaser() {
  const { products } = useHomeData()
  if (products.length < 2) return null
  return <ShopTeaserContent products={products} />
}
