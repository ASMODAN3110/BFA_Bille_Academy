import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import BlogFilters from '../components/blog/BlogFilters'
import BlogGrid from '../components/blog/BlogGrid'
import Pagination from '../components/ui/Pagination'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'
import { parseLocalDate } from '../utils/dateUtils'
import { api } from '../utils/api'
import { normalizeArticle } from '../utils/blogAdapter'

/* ============================================================
   Blog — Page « Blog d'actualités » (/blog)
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
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
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

  // Nombre d'articles publiés par catégorie (pour les badges).
  const counts = useMemo(() => {
    const published = blogPosts.filter((post) => post.estPublie)
    const result = { Tous: published.length }
    for (const categorie of CATEGORIES.slice(1)) {
      result[categorie] = published.filter(
        (post) => post.categorie === categorie,
      ).length
    }
    return result
  }, [blogPosts])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const visiblePosts = filteredPosts.slice(
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
    <section id="blog" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Blog d'Actualités"
            subtitle="Dernières nouvelles, résultats de matchs, portraits de joueurs et communiqués du club."
          />
        </motion.div>

        {loading ? (
          <p className="mb-8 text-center text-sm text-sombre/60">
            Chargement des articles…
          </p>
        ) : error ? (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
          >
            {error}
          </div>
        ) : (
          <>
            <BlogFilters
              categories={CATEGORIES}
              counts={counts}
              active={selectedCategory}
              onChange={handleCategoryChange}
            />

            <p className="mb-8 text-center text-sm text-sombre/60">
              {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}{' '}
              publié{filteredPosts.length > 1 ? 's' : ''}
              {selectedCategory !== 'Tous' && ` · catégorie ${selectedCategory}`}
            </p>

            {/* Grille — re-animée (fade-in) à chaque changement de filtre ou de page */}
            <div id="grille-articles" className="scroll-mt-24">
              <motion.div
                key={`${selectedCategory}-${safePage}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <BlogGrid posts={visiblePosts} />
              </motion.div>
            </div>

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-12"
            />
          </>
        )}
      </div>
    </section>
  )
}
