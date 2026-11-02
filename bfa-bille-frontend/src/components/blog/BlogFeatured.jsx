import { Link } from 'react-router-dom'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   BlogFeatured — Article à la une (maquette Claude Design)
   ------------------------------------------------------------
   Grande carte horizontale : image à gauche, texte à droite
   (ligne « À LA UNE · CATÉGORIE · DATE », titre, extrait et lien).
   Toute la carte mène à /blog/:id.
   ============================================================ */

export default function BlogFeatured({ post }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group flex flex-wrap overflow-hidden rounded-[20px] border border-[#e3ede6] bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-vert/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40"
    >
      <div className="min-h-[240px] flex-[1_1_380px] overflow-hidden bg-gradient-to-br from-[#cfe6d6] to-menthe">
        <img
          src={post.image}
          alt={`Illustration de l'article : ${post.titre}`}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-[1_1_380px] flex-col justify-center gap-3 p-8 md:p-9">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-dore-dark">
          À la une · {post.categorie} · {formatDateCard(parseLocalDate(post.date))}
        </span>
        <h2 className="font-display text-4xl font-bold leading-[1.05] text-[#14231a]">
          {post.titre}
        </h2>
        <p className="line-clamp-4 leading-relaxed text-sombre/80">{post.extrait}</p>
        <span className="font-semibold text-[#0f6b33] transition-colors group-hover:text-vert">
          Lire l&rsquo;article →
        </span>
      </div>
    </Link>
  )
}
