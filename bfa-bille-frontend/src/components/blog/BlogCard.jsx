import { Link } from 'react-router-dom'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   BlogCard — Carte d'un article (maquette Claude Design)
   ------------------------------------------------------------
   Image de 180 px (zoom léger au survol), ligne « CATÉGORIE · DATE »
   en doré, titre, extrait et lien « Lire l'article ». Toute la carte
   est cliquable et mène à /blog/:id.
   ============================================================ */

export default function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group block h-full overflow-hidden rounded-[20px] border border-[#e3ede6] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-vert/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40"
    >
      <div className="h-[180px] overflow-hidden bg-gradient-to-br from-[#cfe6d6] to-menthe">
        <img
          src={post.image}
          alt={`Illustration de l'article : ${post.titre}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-[22px]">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-dore-dark">
          {post.categorie} · {formatDateCard(parseLocalDate(post.date))}
        </span>
        <h3 className="mt-2 line-clamp-2 text-[19px] font-semibold leading-snug text-[#14231a] transition-colors group-hover:text-vert">
          {post.titre}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-sombre/80">
          {post.extrait}
        </p>
      </div>
    </Link>
  )
}
