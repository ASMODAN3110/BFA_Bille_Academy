/* ============================================================
   ShopFilters — Filtres compacts des produits (barre d'onglets)
   ------------------------------------------------------------
   - Catégorie : Toutes + Vêtements / Équipement / Accessoires
   - Stock : Tous / En stock / Stock faible / Rupture
   - Exporte aussi PRODUCT_CATEGORIES (formulaire produit)
   ------------------------------------------------------------
   Props : categoryFilter, onCategoryChange, stockFilter, onStockChange
   ============================================================ */

export const PRODUCT_CATEGORIES = ['Vêtements', 'Équipement', 'Accessoires']

const STOCK_FILTERS = ['En stock', 'Stock faible', 'Rupture']

const select =
  'h-[38px] rounded-[10px] border border-[#e3ede6] bg-[#f4f7f5] px-2 text-[13px] text-sombre/75 outline-none focus:border-vert'

export default function ShopFilters({
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
}) {
  return (
    <div className="mx-2 my-1.5 flex flex-wrap items-center gap-2 sm:ml-auto">
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filtrer par catégorie"
        className={select}
      >
        <option value="Tous">Catégories</option>
        {PRODUCT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={stockFilter}
        onChange={(e) => onStockChange(e.target.value)}
        aria-label="Filtrer par stock"
        className={select}
      >
        <option value="Tous">Stock</option>
        {STOCK_FILTERS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
