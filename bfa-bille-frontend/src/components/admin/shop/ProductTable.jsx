import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import Table from '../../ui/Table'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import ProductStockBadge from './ProductStockBadge'
import ProductActions from './ProductActions'
import { CATEGORY_COLORS } from './ShopFilters'

/* ============================================================
   ProductTable — Tableau des produits de la boutique
   ------------------------------------------------------------
   - Colonnes : Produit / Catégorie / Stock / Prix / Actions
   - S'appuie sur le composant réutilisable <Table /> (ui/Table)
   - Badge catégorie coloré, badge « Nouveau » si estNouveau
   - Prix au format français (45,00 €)
   ============================================================ */

const prixFr = (prix) =>
  prix.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'

const categorieBadge = (categorie) => {
  const color = CATEGORY_COLORS[categorie] ?? '#006400'
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {categorie}
    </span>
  )
}

const COLUMNS = (handlers) => [
  {
    key: 'produit',
    label: 'Produit',
    render: (row) => (
      <div className="flex items-center gap-3">
        <img
          src={row.image}
          alt=""
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-semibold leading-snug text-sombre">
            {row.nom}
            {row.estNouveau && <Badge variant="mvp">Nouveau</Badge>}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-sombre/50">
            {row.description}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'categorie',
    label: 'Catégorie',
    render: (row) => categorieBadge(row.categorie),
  },
  {
    key: 'stock',
    label: 'Stock',
    render: (row) => <ProductStockBadge stock={row.stock} />,
  },
  {
    key: 'prix',
    label: 'Prix',
    render: (row) => (
      <span className="font-bold tabular-nums text-vert">{prixFr(row.prix)}</span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => <ProductActions {...handlers} product={row} />,
  },
]

export default function ProductTable({ products, onEdit, onDelete }) {
  const handlers = { onEdit, onDelete }

  if (products.length === 0) {
    return (
      <Card className="p-10 text-center">
        <FontAwesomeIcon
          icon={faBoxesStacked}
          className="mx-auto h-10 w-10 text-sombre/20"
        />
        <p className="mt-3 font-bold text-sombre/70">
          Aucun produit ne correspond à ces filtres.
        </p>
        <p className="mt-1 text-sm text-sombre/50">
          Modifiez les filtres ou ajoutez un nouveau produit.
        </p>
      </Card>
    )
  }

  return (
    <Table
      columns={COLUMNS(handlers)}
      rows={products}
      rowKey="id"
      className="rounded-2xl border border-clair bg-white shadow-sm"
    />
  )
}
