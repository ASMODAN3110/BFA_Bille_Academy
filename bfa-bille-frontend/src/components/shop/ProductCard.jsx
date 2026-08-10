import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { staggerItem } from '../../hooks/useScrollAnimation'

/* Formate un prix au format français : 35,00 € */
const formatPrice = (value) =>
  value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' €'

/* ============================================================
   ProductCard — Carte d'un produit dérivé
   ------------------------------------------------------------
   Image (zoom +5 % au survol), badge « NOUVEAU » doré (seulement
   si estNouveau), nom, description, tailles, prix en vert foncé
   et bouton « Devis » (doré) qui ouvre la demande de devis.
   ============================================================ */

export default function ProductCard({ product, onQuote }) {
  return (
    <motion.div variants={staggerItem} className="h-full">
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-vert/15">
        {/* Image */}
        <div className="relative overflow-hidden bg-vert">
          <img
            src={product.image}
            alt={`Produit ${product.nom}`}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge NOUVEAU (pulse subtil) */}
          {product.estNouveau && (
            <span className="absolute left-3 top-3 rounded-full bg-dore px-3 py-1 text-xs font-bold uppercase tracking-wide text-vert-dark shadow animate-pulse">
              Nouveau
            </span>
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-sombre transition-colors duration-300 group-hover:text-vert">
            {product.nom}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sombre/70">
            {product.description}
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-sombre/50">
            Taille : {product.tailles.join(', ')}
          </p>

          <div className="mt-auto pt-4">
            <p className="text-xl font-extrabold tabular-nums text-vert">
              {formatPrice(product.prix)}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onQuote(product)}
              className="mt-3 w-full"
            >
              Devis
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
