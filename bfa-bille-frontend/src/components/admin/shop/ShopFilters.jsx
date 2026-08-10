import Button from '../../ui/Button'

/* ============================================================
   ShopFilters — Filtres des produits de la boutique
   ------------------------------------------------------------
   - Catégorie : Tous + Vêtements (bleu #2196F3) / Équipement
     (vert #4CAF50) / Accessoires (violet #9C27B0), avec pastille
     colorée + compteur
   - Stock : Tous / En stock / Stock faible / Rupture
   ------------------------------------------------------------
   Props : products, categoryFilter, onCategoryChange,
           stockFilter, onStockChange
   ============================================================ */

export const PRODUCT_CATEGORIES = ['Vêtements', 'Équipement', 'Accessoires']

export const CATEGORY_COLORS = {
  Vêtements: '#2196F3',
  Équipement: '#4CAF50',
  Accessoires: '#9C27B0',
}

const STOCK_FILTERS = ['Tous', 'En stock', 'Stock faible', 'Rupture']

const countByStock = (products, filter) => {
  if (filter === 'Tous') return products.length
  if (filter === 'En stock') return products.filter((p) => (p.stock ?? 0) > 10).length
  if (filter === 'Stock faible')
    return products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length
  return products.filter((p) => (p.stock ?? 0) === 0).length
}

export default function ShopFilters({
  products,
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold uppercase tracking-wider text-sombre/50">
          Catégorie
        </span>
        <Button
          type="button"
          variant={categoryFilter === 'Tous' ? 'filter-active' : 'filter'}
          size="sm"
          onClick={() => onCategoryChange('Tous')}
          aria-pressed={categoryFilter === 'Tous'}
          aria-label="Filtrer par catégorie Toutes"
        >
          Tous
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              categoryFilter === 'Tous'
                ? 'bg-white/20 text-white'
                : 'bg-clair text-sombre/60'
            }`}
          >
            {products.length}
          </span>
        </Button>
        {PRODUCT_CATEGORIES.map((categorie) => {
          const active = categoryFilter === categorie
          const count = products.filter((p) => p.categorie === categorie).length
          return (
            <Button
              key={categorie}
              type="button"
              variant={active ? 'filter-active' : 'filter'}
              size="sm"
              onClick={() => onCategoryChange(categorie)}
              aria-pressed={active}
              aria-label={`Filtrer par catégorie ${categorie}`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[categorie] }}
                aria-hidden="true"
              />
              {categorie}
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-clair text-sombre/60'
                }`}
              >
                {count}
              </span>
            </Button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold uppercase tracking-wider text-sombre/50">
          Stock
        </span>
        {STOCK_FILTERS.map((filter) => {
          const active = stockFilter === filter
          return (
            <Button
              key={filter}
              type="button"
              variant={active ? 'filter-active' : 'filter'}
              size="sm"
              onClick={() => onStockChange(filter)}
              aria-pressed={active}
              aria-label={`Filtrer par stock ${filter}`}
            >
              {filter}
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-clair text-sombre/60'
                }`}
              >
                {countByStock(products, filter)}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
