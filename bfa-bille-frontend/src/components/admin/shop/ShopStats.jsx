import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxesStacked,
  faEnvelopeOpenText,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import StatCard from '../StatCard'
import { staggerContainer } from '../../../hooks/useScrollAnimation'

/* ============================================================
   ShopStats — Cartes de statistiques de la boutique
   ------------------------------------------------------------
   - Total produits      : nombre total de produits au catalogue
     (sous-titre : total des unités en stock)
   - Rupture de stock    : produits avec stock = 0
   - Demandes en attente : demandes de devis non traitées
   ------------------------------------------------------------
   Props : products, quotes
   ============================================================ */

export default function ShopStats({ products, quotes }) {
  const total = products.length
  const totalUnits = products.reduce((sum, p) => sum + (p.stock ?? 0), 0)
  const rupture = products.filter((p) => (p.stock ?? 0) === 0).length
  const stockFaible = products.filter(
    (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10,
  ).length
  const pending = quotes.filter((q) => !q.estTraite).length

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      <StatCard
        label="Total produits"
        value={total}
        subtitle={`${totalUnits} unité(s) en stock`}
        icon={faBoxesStacked}
        accent="bg-vert"
      />
      <StatCard
        label="Rupture de stock"
        value={rupture}
        subtitle={`${stockFaible} produit(s) en stock faible`}
        icon={faTriangleExclamation}
        accent="bg-erreur"
      />
      <StatCard
        label="Demandes en attente"
        value={pending}
        subtitle={`${quotes.length} demande(s) au total`}
        icon={faEnvelopeOpenText}
        accent="bg-dore"
      />
    </motion.div>
  )
}
