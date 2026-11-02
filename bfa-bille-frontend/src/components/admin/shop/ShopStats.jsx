/* ============================================================
   ShopStats — Chiffres de la boutique
   ------------------------------------------------------------
   - Produits, En stock, En rupture (teinte rouge), Devis à
     traiter (teinte dorée) — valeur en Barlow Condensed
   - Props : products, quotes
   ============================================================ */

export default function ShopStats({ products, quotes }) {
  const inStock = products.filter((p) => (p.stock ?? 0) > 0).length
  const rupture = products.length - inStock
  const pending = quotes.filter((q) => !q.estTraite).length

  const stats = [
    { label: 'Produits', value: products.length },
    { label: 'En stock', value: inStock, text: 'text-vert-dark' },
    {
      label: 'En rupture',
      value: rupture,
      box: 'border-[#f3c9c4] bg-[#fffafa]',
      text: 'text-[#9c2a20]',
    },
    {
      label: 'Devis à traiter',
      value: pending,
      box: 'border-[#efdca0] bg-[#fffdf3]',
      text: 'text-dore-dark',
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl border p-4 ${s.box ?? 'border-[#e3ede6] bg-white'}`}
        >
          <p className={`text-[13px] ${s.text ?? 'text-sombre/75'}`}>{s.label}</p>
          <p
            className={`font-display text-[38px] font-bold leading-[1.1] tabular-nums ${s.text ?? 'text-[#14231a]'}`}
          >
            {s.value}
          </p>
        </div>
      ))}
    </section>
  )
}
