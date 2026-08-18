import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { api } from '../utils/api'
import { normalizeProduct, normalizeQuote } from '../utils/shopAdapter'

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
  const [products, setProducts] = useState([])
  const [quotes, setQuotes] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('Tous')
  const [stockFilter, setStockFilter] = useState('Tous')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverError, setServerError] = useState(null)

  /* Route /admin/products/add → ouvre le formulaire d'ajout. */
  useEffect(() => {
    if (autoAdd) {
      setSelectedProduct(null)
      setIsModalOpen(true)
    }
  }, [autoAdd])

  /* Chargement des listes (produits + devis) depuis le backend. */
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/admin/products?limit=100', { auth: true })
      setProducts((data?.data?.items ?? []).map(normalizeProduct))
    } catch (err) {
      setError(err?.message || 'Impossible de charger les produits.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadQuotes = useCallback(async () => {
    try {
      const data = await api('/admin/quotes?limit=100', { auth: true })
      setQuotes((data?.data?.items ?? []).map(normalizeQuote))
    } catch (err) {
      setError(err?.message || 'Impossible de charger les demandes de devis.')
    }
  }, [])

  useEffect(() => {
    loadProducts()
    loadQuotes()
  }, [loadProducts, loadQuotes])

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
    setServerError(null)
    setIsModalOpen(true)
  }

  const openEdit = (product) => {
    setSelectedProduct(product)
    setServerError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (data) => {
    setServerError(null)
    try {
      if (selectedProduct) {
        const res = await api(`/admin/products/${selectedProduct.id}`, {
          method: 'PUT',
          body: data,
          auth: true,
        })
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id ? normalizeProduct(res.data) : p,
          ),
        )
      } else {
        const res = await api('/admin/products', {
          method: 'POST',
          body: data,
          auth: true,
        })
        setProducts((prev) => [normalizeProduct(res.data), ...prev])
      }
      setIsModalOpen(false)
      setSelectedProduct(null)
    } catch (err) {
      setServerError(err?.message || "Une erreur est survenue à l'enregistrement.")
    }
  }

  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    setIsDeleteConfirmOpen(false)
    api(`/admin/products/${id}`, { method: 'DELETE', auth: true })
      .then(() => setProducts((prev) => prev.filter((p) => p.id !== id)))
      .catch((err) => setError(err?.message || 'Impossible de supprimer le produit.'))
  }

  /* -------------------- Devis -------------------- */

  const handleToggleTraite = async (quote) => {
    if (quote.estTraite) return // l'API ne marque que vers « traité » (pas de retour arrière)
    try {
      await api(`/admin/quotes/${quote.id}/treat`, { method: 'PUT', auth: true })
      setQuotes((prev) =>
        prev.map((q) => (q.id === quote.id ? { ...q, estTraite: true } : q)),
      )
    } catch (err) {
      setError(err?.message || 'Impossible de mettre à jour la demande.')
    }
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

      {loading ? (
        <p className="text-center text-sm text-sombre/60">
          Chargement de la boutique…
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
        >
          {error}
        </div>
      ) : (
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
      )}

      <QuoteRequests quotes={quotes} onToggleTraite={handleToggleTraite} />

      <ProductFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSave}
        product={selectedProduct}
        serverError={serverError}
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
