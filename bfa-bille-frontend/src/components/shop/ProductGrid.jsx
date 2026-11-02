import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import ProductCard from './ProductCard'

/* ============================================================
   ProductGrid — Grille des produits (maquette Claude Design)
   ------------------------------------------------------------
   Colonnes automatiques (cartes de 260 px minimum). État vide lorsqu'aucun
   produit ne correspond au filtre.
   ============================================================ */

export default function ProductGrid({ products, onAdd, quantityOf, quoteFull }) {
  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-[20px] border border-dashed border-dore/40 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-menthe text-vert">
          <FontAwesomeIcon icon={faCartShopping} className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[#14231a]">
          Aucun produit dans cette catégorie
        </h3>
        <p className="mt-2 text-sm text-sombre/75">
          De nouveaux produits dérivés arrivent bientôt dans la boutique.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          inQuote={quantityOf(product.id)}
          quoteFull={quoteFull}
        />
      ))}
    </div>
  )
}
