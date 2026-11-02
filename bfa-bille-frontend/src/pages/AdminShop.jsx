import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import ShopStats from '../components/admin/shop/ShopStats'
import ShopFilters from '../components/admin/shop/ShopFilters'
import ProductTable from '../components/admin/shop/ProductTable'
import ProductFormModal from '../components/admin/shop/ProductFormModal'
import QuoteRequests from '../components/admin/shop/QuoteRequests'
import QuotePanel from '../components/admin/shop/QuotePanel'
import ConfirmDialog from '../components/ui/ConfirmDialog'
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
   Maquette Claude Design : onglets Produits / Devis à gauche, détail
   du devis sélectionné à droite.
   ------------------------------------------------------------
   État (conforme au cahier des charges) :
     products, quotes, categoryFilter, stockFilter,
     selectedProduct, isModalOpen, isDeleteConfirmOpen,
     currentPage (itemsPerPage = 10)
   ============================================================ */

const ITEMS_PER_PAGE = 10

const TABS = [
  { value: 'produits', label: 'Produits' },
  { value: 'devis', label: 'Devis' },
]

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
  const [tab, setTab] = useState('produits')
  const [quoteId, setQuoteId] = useState(null)
  const [menu, setMenu] = useState(null)
  const panelRef = useRef(null)

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

  /* Devis affiché : celui choisi, sinon le premier à traiter, sinon le premier. */
  const activeQuote =
    quotes.find((q) => q.id === quoteId) ??
    quotes.find((q) => !q.estTraite) ??
    quotes[0] ??
    null

  const selectQuote = (id) => {
    setQuoteId(id)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  /* Menu « ⋯ » : se ferme au clic ailleurs, à Échap ou au défilement. */
  useEffect(() => {
    if (!menu) return undefined
    const close = () => setMenu(null)
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('click', close)
    window.addEventListener('scroll', close, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

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
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Boutique"
        subtitle="Produits, stock et demandes de devis."
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Nouveau produit
          </button>
        }
      />

      {loading ? (
        <p className="text-center text-sm text-sombre/75">
          Chargement de la boutique…
        </p>
      ) : (
        <>
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
            >
              {error}
            </div>
          )}

          <ShopStats products={products} quotes={quotes} />

          <div className="flex flex-wrap items-start gap-4">
            <section className="min-w-0 flex-[999_1_32rem] overflow-hidden rounded-2xl border border-[#e3ede6] bg-white">
              <div className="flex flex-wrap items-center gap-x-2 border-b border-[#e3ede6] px-2">
                <div role="tablist" aria-label="Boutique" className="flex">
                  {TABS.map((t) => {
                    const on = tab === t.value
                    const n = t.value === 'produits' ? products.length : quotes.length
                    return (
                      <button
                        key={t.value}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => setTab(t.value)}
                        className={`min-h-11 border-b-2 px-3.5 py-2.5 text-sm font-semibold transition ${
                          on
                            ? 'border-vert text-vert-dark'
                            : 'border-transparent text-sombre/70 hover:text-sombre'
                        }`}
                      >
                        {t.label} · {n}
                      </button>
                    )
                  })}
                </div>
                {tab === 'produits' && (
                  <ShopFilters
                    categoryFilter={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    stockFilter={stockFilter}
                    onStockChange={setStockFilter}
                  />
                )}
              </div>

              {tab === 'produits' ? (
                <ProductTable
                  products={pageItems}
                  total={filtered.length}
                  page={page}
                  pageSize={ITEMS_PER_PAGE}
                  onPageChange={setPage}
                  onEdit={openEdit}
                  onMenu={(product, rect) =>
                    setMenu({ product, top: rect.bottom + 4, right: window.innerWidth - rect.right })
                  }
                />
              ) : (
                <QuoteRequests
                  quotes={quotes}
                  activeId={activeQuote?.id ?? null}
                  onSelect={selectQuote}
                />
              )}
            </section>

            <div ref={panelRef} className="flex min-w-0 flex-1 basis-80 scroll-mt-20">
              <QuotePanel quote={activeQuote} onTreat={handleToggleTraite} />
            </div>
          </div>
        </>
      )}

      {menu && (
        <div
          role="menu"
          style={{ top: menu.top, right: menu.right }}
          className="fixed z-50 min-w-44 rounded-xl border border-[#e3ede6] bg-white p-1.5 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => openEdit(menu.product)}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm transition hover:bg-[#f4f9f6]"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4 text-vert" />
            Modifier
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setToDelete(menu.product)
              setIsDeleteConfirmOpen(true)
            }}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-erreur transition hover:bg-erreur/10"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      )}

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
