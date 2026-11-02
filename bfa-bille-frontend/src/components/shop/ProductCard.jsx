import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShirt, faCheck } from '@fortawesome/free-solid-svg-icons'
import Button from '../ui/Button'

/* Formate un prix en FCFA : 25 000 FCFA */
const formatPrice = (value) =>
  value.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' FCFA'

/* Pastille de stock : rupture / limité (≤ 10) / en stock */
const stockTag = (stock) => {
  const qty = Number(stock) || 0
  if (qty === 0) return { label: 'Rupture', tone: 'bg-[#fdecea] text-erreur' }
  if (qty <= 10) return { label: 'Stock limité', tone: 'bg-[#fff4cc] text-dore-dark' }
  return { label: 'En stock', tone: 'bg-menthe text-[#0f6b33]' }
}

/* ============================================================
   ProductCard — Carte d'un produit dérivé (maquette Claude Design)
   ------------------------------------------------------------
   Image de 230 px (dégradé si absente ou introuvable), pastille de
   stock en haut à gauche (et « Nouveau » à droite pour un produit
   récent), catégorie, nom, tailles, prix en police display et bouton
   « Ajouter au devis » : les produits choisis sont réunis dans UN SEUL
   devis (voir « Mon devis »). La taille et la quantité se règlent dans le devis.
   ============================================================ */

export default function ProductCard({ product, onAdd, inQuote = 0, quoteFull = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const tag = stockTag(product.stock)

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e3ede6] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-vert/10">
      <div className="relative h-[230px] overflow-hidden bg-gradient-to-br from-[#cfe6d6] to-menthe">
        {product.image && !imageFailed ? (
          <img
            src={product.image}
            alt={`Produit ${product.nom}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FontAwesomeIcon icon={faShirt} className="h-10 w-10 text-vert/30" />
          </div>
        )}
        <span className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-xs font-semibold ${tag.tone}`}>
          {tag.label}
        </span>
        {product.estNouveau && (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-vert px-3 py-1 text-xs font-semibold text-white">
            Nouveau
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="text-sm text-sombre/70">{product.categorie}</span>
        <h3 className="text-[19px] font-semibold leading-snug text-[#14231a]">{product.nom}</h3>
        {product.tailles.length > 0 && (
          <p className="text-sm text-sombre/70">Taille : {product.tailles.join(', ')}</p>
        )}
        <p className="mt-0.5 font-display text-[26px] font-extrabold leading-none tabular-nums text-vert">
          {formatPrice(product.prix)}
        </p>
        <div className="mt-auto pt-3">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onAdd(product)}
            disabled={quoteFull && inQuote === 0}
            className="w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {inQuote > 0 ? 'Ajouter encore' : 'Ajouter au devis'}
          </Button>
          {inQuote > 0 && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#0f6b33]">
              <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5" />
              {inQuote} dans votre devis
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
