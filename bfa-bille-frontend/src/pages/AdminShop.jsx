import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import ShopStats from '../components/admin/shop/ShopStats'
import ShopFilters from '../components/admin/shop/ShopFilters'
import ProductTable from '../components/admin/shop/ProductTable'
import ProductFormModal from '../components/admin/shop/ProductFormModal'
import QuoteRequests from '../components/admin/shop/QuoteRequests'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminShop — Gestion de la boutique (/admin/shop)
   ------------------------------------------------------------
   @EF44 Catalogue : liste, filtres (catégorie + stock), stats,
         création / modification d'un produit (validation)
   @EF45 Suppression d'un produit avec confirmation
   @EF46 Demandes de devis : consultation, réponse (mailto),
         marquage « traité »
   ------------------------------------------------------------
   État (conforme au cahier des charges) :
     products, quotes, categoryFilter, stockFilter,
     selectedProduct, isModalOpen, isDeleteConfirmOpen,
     currentPage (itemsPerPage = 10)
   ============================================================ */

const ITEMS_PER_PAGE = 10

const stockLevel = (qty) => {
  if (qty === 0) return 'Rupture'
  if (qty <= 10) return 'Stock faible'
  return 'En stock'
}

export default function AdminShop({ autoAdd = false }) {
  /* ⚠️ Plus de données mock : les listes partent vides. Les produits
     et devis arriveront du backend (GET /admin/produits, /admin/devis)
     quand les endpoints CRUD existeront. */
  const [products, setProducts] = useState([])
  const [quotes, setQuotes] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('Tous')
  const [stockFilter, setStockFilter] = useState('Tous')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [page, setPage] = useState(1)

  /* Route /admin/products/add → ouvre le formulaire d'ajout. */
  useEffect(() => {
    if (autoAdd) {
      setSelectedProduct(null)
      setIsModalOpen(true)
    }
  }, [autoAdd])

  /* Retour à la 1re page dès que les filtres changent. */
  useEffect(() => {
    setPage(1)
  }, [categoryFilter, stockFilter])

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesCategory =
          categoryFilter === 'Tous' || p.categorie === categoryFilter
        const matchesStock =
          stockFilter === 'Tous' || stockLevel(p.stock ?? 0) === stockFilter
        return matchesCategory && matchesStock
      }),
    [products, categoryFilter, stockFilter],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page],
  )

  const start = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const end = Math.min(page * ITEMS_PER_PAGE, filtered.length)

  /* -------------------- Produits -------------------- */

  const openAdd = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const openEdit = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleSave = (data) => {
    setProducts((prev) =>
      selectedProduct
        ? prev.map((p) => (p.id === selectedProduct.id ? data : p))
        : [data, ...prev],
    )
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== toDelete?.id))
    setToDelete(null)
    setIsDeleteConfirmOpen(false)
  }

  /* -------------------- Devis -------------------- */

  const handleToggleTraite = (quote) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quote.id ? { ...q, estTraite: !q.estTraite } : q,
      ),
    )
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Gestion de la boutique"
        subtitle="Gérez votre inventaire et les demandes clients."
        action={
          <Button type="button" onClick={openAdd} className="shrink-0">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Ajouter un produit
          </Button>
        }
      />

      <ShopStats products={products} quotes={quotes} />

      <div className="space-y-4">
        <ShopFilters
          products={products}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          stockFilter={stockFilter}
          onStockChange={setStockFilter}
        />

        <ProductTable
          products={pageItems}
          onEdit={openEdit}
          onDelete={(product) => {
            setToDelete(product)
            setIsDeleteConfirmOpen(true)
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-sombre/60" role="status">
            {filtered.length === 0 ? (
              'Aucun produit.'
            ) : (
              <>
                Affichage{' '}
                <span className="font-bold text-vert">{start}</span>–{end} sur{' '}
                <span className="font-bold text-vert">{filtered.length}</span>{' '}
                produit(s)
              </>
            )}
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <QuoteRequests quotes={quotes} onToggleTraite={handleToggleTraite} />

      <ProductFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSave}
        product={selectedProduct}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => {
          setToDelete(null)
          setIsDeleteConfirmOpen(false)
        }}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.nom ?? ''} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
