import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faUserPen,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '../components/layout/Breadcrumb'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { fadeUp } from '../hooks/useScrollAnimation'
import { parseLocalDate, formatDateCard } from '../utils/dateUtils'

/* ⚠️ Plus de données mock : aucun article. Le cas vide est déjà
   géré plus bas par le pattern « Article introuvable » (!post). */
const blogPosts = []

/* Couleur du badge de catégorie (identique à BlogCard). */
const CATEGORY_BADGE = {
  Matchs: 'bg-vert text-white',
  Événements: 'bg-dore text-vert-dark',
  Portraits: 'bg-blue-600 text-white',
  Communiqués: 'bg-red-600 text-white',
}

/* ============================================================
   BlogDetails — Détail d'un article du blog (/blog/:id)
   ------------------------------------------------------------
   - Fil d'ariane : Accueil › Blog › titre de l'article
   - Image de couverture, badge, date, auteur
   - Contenu complet rendu en HTML (format WYSIWYG)
   - Un article non publié (ou inexistant) n'est pas accessible :
     message « Article introuvable » avec retour au blog.
   ============================================================ */

export default function BlogDetails() {
  const { id } = useParams()
  const postId = Number(id)

  const post = blogPosts.find((p) => p.id === postId && p.estPublie)

  // Remonte en haut de page à l'arrivée.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [postId])

  if (!post) {
    return (
      <section className="bg-clair py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-3xl font-extrabold text-vert md:text-4xl">
              Article introuvable
            </h1>
            <p className="mt-4 text-sombre/70">
              Cet article n'existe pas ou n'est pas encore publié.
            </p>
            <div className="mt-8">
              <Button to="/blog" variant="primary">
                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                Retour au blog
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  const badgeClasses = CATEGORY_BADGE[post.categorie] ?? 'bg-vert text-white'

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.titre },
  ]

  return (
    <section className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="overflow-hidden">
            {/* Image de couverture */}
            <div className="relative">
              <img
                src={post.image}
                alt={`Illustration de l'article : ${post.titre}`}
                className="aspect-[16/7] w-full object-cover"
              />
              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow backdrop-blur-sm ${badgeClasses}`}
              >
                {post.categorie}
              </span>
            </div>

            {/* Corps de l'article */}
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sombre/60">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="h-4 w-4 text-dore-dark"
                  />
                  {formatDateCard(parseLocalDate(post.date))}
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faUserPen}
                    className="h-4 w-4 text-dore-dark"
                  />
                  Par {post.auteur}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-vert md:text-4xl">
                {post.titre}
              </h1>

              <div
                className="prose-blog mt-6 text-[0.975rem] leading-relaxed text-sombre/80"
                dangerouslySetInnerHTML={{ __html: post.contenu }}
              />

              <div className="mt-10 border-t border-clair pt-6">
                <Button to="/blog" variant="outline" size="md">
                  <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                  Retour au blog
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
