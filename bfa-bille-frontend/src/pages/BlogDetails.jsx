import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import BlogCard from '../components/blog/BlogCard'
import { parseLocalDate, formatDateCard } from '../utils/dateUtils'
import { api } from '../utils/api'
import { normalizeArticle } from '../utils/blogAdapter'

/* ============================================================
   BlogDetails — Détail d'un article du blog (/blog/:id), maquette Claude Design
   ------------------------------------------------------------
   - Bandeau : fil d'ariane, « CATÉGORIE · DATE », titre, auteur et
     temps de lecture estimé
   - Image de couverture, contenu complet rendu en HTML (WYSIWYG),
     boutons de partage (WhatsApp, Facebook, copier le lien)
   - « À lire aussi » : 3 autres articles publiés
   - GET /api/blog/:id renvoie 404 pour un brouillon ou un article
     inexistant → « Article introuvable ».
   ============================================================ */

/** Temps de lecture estimé (≈ 200 mots / minute) à partir du HTML. */
const readingMinutes = (html) => {
  const words = String(html ?? '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const chipClasses =
  'inline-flex min-h-10 items-center rounded-full border border-[#cfe6d6] bg-white px-4 text-sm font-medium text-sombre/80 transition-colors hover:border-vert hover:text-vert focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40'

export default function BlogDetails() {
  const { id } = useParams()
  const postId = Number(id)

  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'notfound' | 'error'
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  // Remonte en haut de page à l'arrivée.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [postId])

  useEffect(() => {
    let active = true
    setStatus('loading')
    setError(null)
    api(`/api/blog/${postId}`)
      .then((data) => {
        if (!active) return
        setPost(normalizeArticle(data.data))
        setStatus('ready')
      })
      .catch((err) => {
        if (!active) return
        if (err.status === 404) setStatus('notfound')
        else {
          setError(err?.message || 'Impossible de charger l’article.')
          setStatus('error')
        }
      })
    return () => {
      active = false
    }
  }, [postId])

  /* « À lire aussi » : 3 autres articles publiés, les plus récents (échec silencieux). */
  useEffect(() => {
    let active = true
    api('/api/blog?limit=100')
      .then((data) => {
        if (!active) return
        const others = (data?.data?.items ?? [])
          .map(normalizeArticle)
          .filter((a) => a.estPublie && a.id !== postId)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 3)
        setRelated(others)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [postId])

  if (status === 'loading') {
    return (
      <section className="bg-[#fafcfa] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm text-sombre/75">Chargement de l’article…</p>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="bg-[#fafcfa] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div
            role="alert"
            className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
          >
            {error}
          </div>
          <div className="mt-8">
            <Button to="/blog" variant="outline">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
              Retour au blog
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'notfound') {
    return (
      <>
        <PageHero
          crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Blog', to: '/blog' }, { label: 'Article introuvable' }]}
          title="Article introuvable"
          lead="Cet article n'existe pas ou n'est pas encore publié."
        >
          <div className="mt-8">
            <Button to="/blog" variant="primary">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
              Retour au blog
            </Button>
          </div>
        </PageHero>
      </>
    )
  }

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = encodeURIComponent(`${post.titre} — ${url}`)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* presse-papiers indisponible : on ne fait rien */
    }
  }

  return (
    <>
      <header className="bg-gradient-to-br from-menthe via-[#f6fbf7] to-[#fff8e1] py-12 md:py-14">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <nav aria-label="Fil d'ariane" className="mb-3.5 text-[13px] text-sombre/70">
            <Link to="/blog" className="transition-colors hover:text-vert">
              Blog
            </Link>{' '}
            / <span aria-current="page">{post.titre}</span>
          </nav>
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-dore-dark">
            {post.categorie} · {formatDateCard(parseLocalDate(post.date))}
          </span>
          <h1 className="mt-2.5 font-display text-5xl font-extrabold leading-none tracking-tight text-[#14231a] md:text-6xl">
            {post.titre}
          </h1>
          <p className="mt-4 text-sm text-sombre/70">
            Par {post.auteur} · {readingMinutes(post.contenu)} min de lecture
          </p>
        </div>
      </header>

      <article className="bg-[#fafcfa]">
        <div className="mx-auto max-w-[860px] px-4 pb-14 pt-10 sm:px-6">
          <div className="h-[260px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#cfe6d6] to-menthe md:h-[380px]">
            <img
              src={post.image}
              alt={`Illustration de l'article : ${post.titre}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
              className="h-full w-full object-cover"
            />
          </div>

          <div
            className="prose-blog mt-10 text-lg leading-[1.8] text-[#2b4033]"
            dangerouslySetInnerHTML={{ __html: post.contenu }}
          />

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-[#e3ede6] pt-6">
            <span className="text-sm font-semibold">Partager</span>
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className={chipClasses}
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer"
              className={chipClasses}
            >
              Facebook
            </a>
            <button type="button" onClick={copyLink} className={chipClasses}>
              {copied ? 'Lien copié ✓' : 'Copier le lien'}
            </button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-display text-3xl font-bold leading-none text-[#14231a] md:text-4xl">
              À lire aussi
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
