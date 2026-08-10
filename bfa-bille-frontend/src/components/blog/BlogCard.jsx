import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faUserPen,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import { staggerItem } from '../../hooks/useScrollAnimation'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* Couleur du badge par catégorie :
   - Matchs : vert foncé (#006400)
   - Événements : doré (#D4AF37)
   - Portraits : bleu
   - Communiqués : rouge */
const CATEGORY_BADGE = {
  Matchs: 'bg-vert text-white',
  Événements: 'bg-dore text-vert-dark',
  Portraits: 'bg-blue-600 text-white',
  Communiqués: 'bg-red-600 text-white',
}

/* ============================================================
   BlogCard — Carte d'un article du blog
   ------------------------------------------------------------
   Image (zoom +5 % au survol), badge de catégorie, date et
   auteur, titre, extrait et lien « Lire la suite ». Toute la
   carte est cliquable et redirige vers /blog/:id.
   ============================================================ */

export default function BlogCard({ post }) {
  const badgeClasses = CATEGORY_BADGE[post.categorie] ?? 'bg-vert text-white'

  return (
    <motion.div variants={staggerItem} className="h-full">
      <Link to={`/blog/${post.id}`} className="block h-full">
        <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-vert/15">
          {/* Image de couverture */}
          <div className="relative overflow-hidden bg-vert">
            <img
              src={post.image}
              alt={`Illustration de l'article : ${post.titre}`}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badge de catégorie */}
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow backdrop-blur-sm ${badgeClasses}`}
            >
              {post.categorie}
            </span>
          </div>

          {/* Contenu */}
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sombre/60">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="h-3.5 w-3.5 text-dore-dark"
                />
                {formatDateCard(parseLocalDate(post.date))}
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faUserPen}
                  className="h-3.5 w-3.5 text-dore-dark"
                />
                {post.auteur}
              </span>
            </div>

            <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-sombre transition-colors duration-300 group-hover:text-vert">
              {post.titre}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-sombre/70">
              {post.extrait}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-dore-dark transition-all duration-300 group-hover:gap-3 group-hover:text-vert">
              Lire la suite
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
