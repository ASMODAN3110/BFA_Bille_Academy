import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import BlogCard from './BlogCard'

/* ============================================================
   BlogGrid — Grille des articles du blog (maquette Claude Design)
   ------------------------------------------------------------
   Colonnes automatiques (cartes de 300 px minimum). État vide lorsqu'aucun
   article ne correspond aux filtres.
   ============================================================ */

export default function BlogGrid({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-[20px] border border-dashed border-dore/40 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-menthe text-vert">
          <FontAwesomeIcon icon={faNewspaper} className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[#14231a]">
          Aucun article dans cette catégorie
        </h3>
        <p className="mt-2 text-sm text-sombre/75">
          Le club publiera prochainement de nouveaux articles. Revenez bientôt !
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
