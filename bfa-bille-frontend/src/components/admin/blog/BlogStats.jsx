import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faComments,
  faEye,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons'
import StatCard from '../StatCard'

/* ============================================================
   BlogStats — Cartes de statistiques du blog
   ------------------------------------------------------------
   - Vues (30 j)         : total des vues des articles publiés
   - Articles publiés    : nombre d'articles publiés + % du total
   - Nouveaux commentaires : total des commentaires (publiés)
   ------------------------------------------------------------
   Props : articles (tableau complet, filtrage ici)
   ============================================================ */

export default function BlogStats({ articles }) {
  const publishedPosts = articles.filter((a) => a.estPublie)
  const totalVues = publishedPosts.reduce((sum, a) => sum + (a.vues ?? 0), 0)
  const totalCommentaires = publishedPosts.reduce(
    (sum, a) => sum + (a.commentaires ?? 0),
    0,
  )
  const pourcentage = articles.length
    ? Math.round((publishedPosts.length / articles.length) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Vues (30 j)"
        value={totalVues}
        subtitle={`${publishedPosts.length} article(s) publié(s)`}
        icon={faEye}
        accent="bg-vert"
      />
      <StatCard
        label="Articles publiés"
        value={publishedPosts.length}
        subtitle={`${pourcentage} % du total`}
        icon={faNewspaper}
        accent="bg-dore"
      />
      <StatCard
        label="Nouveaux commentaires"
        value={totalCommentaires}
        subtitle="Sur les articles publiés"
        icon={faComments}
        accent="bg-orange-500"
      />
    </div>
  )
}
