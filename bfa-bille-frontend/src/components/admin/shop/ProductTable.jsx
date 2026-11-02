import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesStacked, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../ui/Pagination'

/* ============================================================
   ProductTable — Liste des produits de la boutique
   ------------------------------------------------------------
   - Une ligne par produit : vignette, nom (+ « Nouveau »),
     « Catégorie · 15 000 FCFA », pastille de stock, menu « ⋯ »
   - Pastille : « 24 en stock » (> 10) / « 3 restants » (1 à 10)
     / « Rupture »
   - Pied : « 1–9 sur 9 » + pagination carrée
   ============================================================ */

const prixFr = (prix) =>
  prix.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' FCFA'

function StockPill({ stock }) {
  const qty = Number(stock) || 0
  const [cls, label] =
    qty === 0
      ? ['bg-[#fbe4e1] text-[#9c2a20]', 'Rupture']
      : qty <= 10
        ? ['bg-[#fff3c9] text-dore-dark', `${qty} restant${qty > 1 ? 's' : ''}`]
        : ['bg-[#dcefe2] text-vert-dark', `${qty} en stock`]
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

export default function ProductTable({
  products,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onMenu,
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <>
      {products.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <FontAwesomeIcon icon={faBoxesStacked} className="mx-auto h-10 w-10 text-sombre/20" />
          <p className="mt-3 text-sm font-bold text-sombre/75">
            Aucun produit ne correspond à ces filtres.
          </p>
        </div>
      ) : (
        <ul>
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-1 border-t border-[#eef3ef] pr-2 transition hover:bg-[#f4f9f6]"
            >
              <button
                type="button"
                onClick={() => onEdit(p)}
                aria-label={`Modifier ${p.nom}`}
                className="flex min-h-[72px] min-w-0 flex-1 flex-wrap items-center gap-x-3.5 gap-y-2 py-3 pl-3 text-left text-sm sm:pl-[18px]"
              >
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-[10px] bg-gradient-to-br from-[#dcefe2] to-[#fff3c9] object-cover"
                />
                <span className="min-w-0 flex-1 basis-40">
                  <b className="flex flex-wrap items-center gap-2 font-semibold leading-snug">
                    {p.nom}
                    {p.estNouveau && (
                      <span className="rounded-full bg-[#fff3c9] px-2 py-px text-[11px] font-semibold text-dore-dark">
                        Nouveau
                      </span>
                    )}
                  </b>
                  <span className="block text-xs text-sombre/75">
                    {p.categorie} · {prixFr(p.prix)}
                  </span>
                </span>
                <StockPill stock={p.stock} />
              </button>
              <button
                type="button"
                onClick={(e) => onMenu(p, e.currentTarget.getBoundingClientRect())}
                aria-label={`Plus d'actions pour ${p.nom}`}
                aria-haspopup="menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sombre/70 transition hover:bg-[#f4f7f5]"
              >
                <FontAwesomeIcon icon={faEllipsis} className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#eef3ef] px-4 py-3 text-[13px] text-sombre/75">
        <span role="status">
          {total === 0 ? 'Aucun produit' : `${from}–${to} sur ${total}`}
        </span>
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(total / pageSize))}
          onPageChange={onPageChange}
          variant="square"
        />
      </div>
    </>
  )
}
