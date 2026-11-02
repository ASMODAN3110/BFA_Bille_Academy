import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/layout/PageHero'
import BlogFeatured from '../components/blog/BlogFeatured'
import BlogFilters from '../components/blog/BlogFilters'
import BlogGrid from '../components/blog/BlogGrid'
import Pagination from '../components/ui/Pagination'
import { parseLocalDate } from '../utils/dateUtils'
import { api } from '../utils/api'
import { normalizeArticle } from '../utils/blogAdapter'

/* ============================================================
   Blog — Page « Blog d'actualités » (/blog), maquette Claude Design
   Article à la une (le plus récent), pastilles de catégorie, grille
   des autres articles, pagination.
   ------------------------------------------------------------
   - Filtres par catégorie (Tous, Matchs, Événements, Portraits,
     Communiqués) avec compteurs d'articles publiés
   - Articles triés par date décroissante (@EF29)
   - Seuls les articles publiés sont affichés
     (estPublie = true)
   - Pagination (6 articles par page)
   - Clic sur un article → /blog/:id (page de détail)
   ============================================================ */

const CATEGORIES = ['Tous', 'Matchs', 'Événements', 'Portraits', 'Communiqués']
const POSTS_PER_PAGE = 6

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let active = true
    api('/api/blog?limit=100')
      .then((data) => {
        if (!active) return
        setBlogPosts((data?.data?.items ?? []).map(normalizeArticle))
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message || 'Impossible de charger les articles.')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Articles publiés, filtrés par catégorie et triés du plus récent
  // au plus ancien.
  const filteredPosts = useMemo(() => {
    const published = blogPosts.filter((post) => post.estPublie)
    const byCategory =
      selectedCategory === 'Tous'
        ? published
        : published.filter((post) => post.categorie === selectedCategory)
    return [...byCategory].sort(
      (a, b) => parseLocalDate(b.date) - parseLocalDate(a.date),
    )
  }, [selectedCategory, blogPosts])

  // Article à la une = le plus récent des articles publiés ; la grille liste les autres.
  const featured = useMemo(
    () =>
      [...blogPosts]
        .filter((post) => post.estPublie)
        .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date))[0] ?? null,
    [blogPosts],
  )
  const gridPosts = useMemo(
    () => filteredPosts.filter((post) => post.id !== featured?.id),
    [filteredPosts, featured],
  )

  const totalPages = Math.max(1, Math.ceil(gridPosts.length / POSTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const visiblePosts = gridPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE,
  )

  const handleCategoryChange = (categorie) => {
    setSelectedCategory(categorie)
    setCurrentPage(1) // on repart sur la première page
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Remonte légèrement vers le haut de la grille.
    const grid = document.getElementById('grille-articles')
    grid?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Blog' }]}
        title="Actualités de l'académie"
        lead="Comptes rendus de matchs, annonces et vie du club."
      />

      <section id="blog" className="bg-[#fafcfa] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="py-10 text-center text-sm text-sombre/75">
              Chargement des articles…
            </p>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
            >
              {error}
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-10">
                  <BlogFeatured post={featured} />
                </div>
              )}

              <BlogFilters
                categories={CATEGORIES}
                active={selectedCategory}
                onChange={handleCategoryChange}
              />

              {/* Grille — re-animée (fondu) à chaque changement de filtre ou de page */}
              <div id="grille-articles" className="mt-7 scroll-mt-24">
                <motion.div
                  key={`${selectedCategory}-${safePage}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {gridPosts.length === 0 && selectedCategory === 'Tous' ? null : (
                    <BlogGrid posts={visiblePosts} />
                  )}
                </motion.div>
              </div>

              <Pagination
                variant="square"
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-10"
              />
            </>
          )}
        </div>
      </section>
    </>
  )
}
