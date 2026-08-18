import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { formatDateFr } from '../../utils/adminDashboardAdapter'
import { toCategoryLabel } from '../../utils/blogAdapter'

/* ============================================================
   RecentArticles — Derniers articles publiés (tableau de bord)
   ------------------------------------------------------------
   - 5 derniers articles publiés, issus de `stats.recentArticles`
     (aucun appel API supplémentaire : déjà dans /admin/dashboard)
   - Lien « Voir tout » vers /admin/blog
   ============================================================ */

export default function RecentArticles({ articles }) {
  const items = articles ?? []
  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-sombre">Derniers articles</h2>
          <p className="mt-0.5 text-sm text-sombre/60">
            Les derniers contenus publiés au blog.
          </p>
        </div>
        {items.length > 0 && (
          <Button to="/admin/blog" variant="secondary" size="sm">
            Voir tout
            <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <FontAwesomeIcon icon={faNewspaper} className="mx-auto h-10 w-10 text-sombre/20" />
          <p className="mt-3 font-bold text-sombre/70">Aucun article publié.</p>
        </div>
      ) : (
        <ul className="divide-y divide-clair">
          {items.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-sombre">{a.titre}</p>
                <p className="mt-0.5 text-xs text-sombre/60">
                  {a.auteur} · {formatDateFr(a.datePublication)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-clair px-2.5 py-1 text-xs font-bold text-sombre/70">
                {toCategoryLabel(a.categorie)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
