import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsis,
  faFilePen,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import BlogStatusBadge from './BlogStatusBadge'
import Pagination from '../../ui/Pagination'
import { parseLocalDate } from '../../../utils/dateUtils'

/* ============================================================
   BlogTable — Liste des articles (admin)
   ------------------------------------------------------------
   - Onglets Tous / Publiés / Brouillons (avec compteurs) + recherche
   - Une ligne par article : vignette, titre, « Catégorie · date »,
     pastille de statut, menu « ⋯ » ; clic = édition rapide à droite
   - Pied : « 1–10 sur N » + pagination carrée
   ============================================================ */

const TABS = [
  { value: 'Tous', label: 'Tous' },
  { value: 'Publiés', label: 'Publiés' },
  { value: 'Brouillons', label: 'Brouillons' },
]

const formatDate = (iso) =>
  parseLocalDate(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const subtitle = (post) =>
  `${post.categorie} · ${
    post.estPublie && post.datePublication ? formatDate(post.datePublication) : 'brouillon'
  }`

export default function BlogTable({
  posts,
  counts,
  total,
  page,
  pageSize,
  onPageChange,
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange,
  activeId,
  onSelect,
  onMenu,
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <section className="min-w-0 flex-[999_1_35rem] overflow-hidden rounded-2xl border border-[#e3ede6] bg-white">
      <div className="flex flex-wrap items-center gap-x-2 border-b border-[#e3ede6] px-2">
        <div role="tablist" aria-label="Statut" className="flex max-w-full overflow-x-auto">
          {TABS.map((t) => {
            const on = statusFilter === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onStatusChange(t.value)}
                className={`min-h-11 shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
                  on
                    ? 'border-vert text-vert-dark'
                    : 'border-transparent text-sombre/70 hover:text-sombre'
                }`}
              >
                {t.label} · {counts[t.value]}
              </button>
            )
          })}
        </div>
        <label className="relative mx-2 my-1.5 min-w-48 flex-1 sm:ml-auto sm:flex-none">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sombre/60"
          />
          <span className="sr-only">Rechercher un article</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un article…"
            className="h-[38px] w-full rounded-[10px] border border-[#e3ede6] bg-[#f4f7f5] pl-9 pr-3 text-[13px] outline-none focus:border-vert sm:w-60"
          />
        </label>
      </div>

      {posts.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <FontAwesomeIcon icon={faFilePen} className="mx-auto h-10 w-10 text-sombre/20" />
          <p className="mt-3 text-sm font-bold text-sombre/75">
            Aucun article ne correspond à cette sélection.
          </p>
        </div>
      ) : (
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              className={`flex items-center gap-1 border-t border-[#eef3ef] pr-2 transition first:border-t-0 hover:bg-[#f4f9f6] ${
                post.id === activeId ? 'bg-[#f1f8f3]' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(post.id)}
                aria-current={post.id === activeId}
                className="flex min-h-[84px] min-w-0 flex-1 flex-wrap items-center gap-x-3.5 gap-y-2 py-3 pl-3 text-left text-sm sm:pl-[18px]"
              >
                <img
                  src={post.image}
                  alt=""
                  loading="lazy"
                  className="h-14 w-[84px] shrink-0 rounded-[10px] bg-gradient-to-br from-[#dcefe2] to-[#fff3c9] object-cover"
                />
                <span className="min-w-0 flex-1 basis-40">
                  <b className="line-clamp-2 font-semibold leading-snug">{post.titre}</b>
                  <span className="block text-xs text-sombre/75">{subtitle(post)}</span>
                </span>
                <BlogStatusBadge statut={post.statut} />
              </button>
              <button
                type="button"
                onClick={(e) => onMenu(post, e.currentTarget.getBoundingClientRect())}
                aria-label={`Plus d'actions pour ${post.titre}`}
                aria-haspopup="menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sombre/70 transition hover:bg-[#f4f7f5]"
              >
                <FontAwesomeIcon icon={faEllipsis} className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#eef3ef] px-4 py-3 text-[13px] text-sombre/75">
        <span role="status">
          {total === 0 ? 'Aucun résultat' : `${from}–${to} sur ${total}`}
        </span>
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(total / pageSize))}
          onPageChange={onPageChange}
          variant="square"
        />
      </div>
    </section>
  )
}
