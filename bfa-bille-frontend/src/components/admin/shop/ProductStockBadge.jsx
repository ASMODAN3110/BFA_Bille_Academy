import Badge from '../../ui/Badge'

/* ============================================================
   ProductStockBadge — Indicateur de stock d'un produit
   ------------------------------------------------------------
   - stock = 0        → « Rupture » (rouge #E53935)
   - stock 1 à 10     → « Stock faible » (orange #FF9800)
   - stock > 10       → « En stock » (vert #4CAF50)
   ------------------------------------------------------------
   Réutilise le composant <Badge /> (variantes success / warning /
   danger) et affiche la quantité pour les états non-rupture.
   ============================================================ */

export default function ProductStockBadge({ stock }) {
  const qty = Number(stock) || 0

  if (qty === 0) {
    return <Badge variant="danger">Rupture</Badge>
  }
  if (qty <= 10) {
    return <Badge variant="warning">Stock faible · {qty}</Badge>
  }
  return <Badge variant="success">En stock · {qty}</Badge>
}
