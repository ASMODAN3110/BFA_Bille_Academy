import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { fetchCategories } from './useCategories'
import { normalizeEvent } from '../utils/eventAdapter'
import { normalizeArticle } from '../utils/blogAdapter'
import { normalizeAlbum } from '../utils/albumAdapter'
import { normalizeProduct } from '../utils/shopAdapter'
import { toDateKey } from '../utils/dateUtils'

/* ============================================================
   useHomeData — Données de la page d'accueil
   ------------------------------------------------------------
   Alimente les sections Matchs, Actualités, Classements, Boutique, Galerie
   et Chiffres clés à partir de l'API publique. Chaque bloc est
   indépendant : si une requête échoue, seul ce bloc reste vide
   (la section correspondante est alors masquée).
   Une seule série de requêtes par session (cache module-level).
   ============================================================ */

const EMPTY = {
  matches: [],
  news: [],
  rankings: [],
  gallery: [],
  products: [],
  stats: [],
}

let cached = null
let inflight = null

const settled = (promise, fallback) => promise.catch(() => fallback)

async function load() {
  const [events, blog, albums, players, categories, results, shop] = await Promise.all([
    settled(api('/api/events?limit=100'), null),
    settled(api('/api/blog?limit=100'), null),
    settled(api('/api/albums?limit=100'), null),
    settled(api('/api/players?limit=1'), null),
    settled(fetchCategories(), []),
    settled(api('/api/results?limit=1'), null),
    settled(api('/api/products?limit=100'), null),
  ])

  /* Prochains matchs : les 3 plus proches à partir d'aujourd'hui */
  const today = toDateKey(new Date())
  const matches = (events?.data?.items ?? [])
    .map(normalizeEvent)
    .filter((e) => e.type === 'Match' && e.date >= today)
    .sort((a, b) => `${a.date} ${a.heure}`.localeCompare(`${b.date} ${b.heure}`))
    .slice(0, 3)
    .map((e) => ({
      id: e.id,
      type: e.typeMatch === 'CHAMPIONNAT' ? 'Championnat' : 'Amical',
      category: e.categorie,
      date: e.date,
      home: e.equipeA ?? 'BFA Bille Academy',
      away: e.equipeB ?? '—',
      time: e.heure,
      venue: e.lieu,
    }))

  /* Actualités : les 3 derniers articles publiés */
  const publies = (blog?.data?.items ?? []).map(normalizeArticle).filter((a) => a.estPublie)
  const news = [...publies]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((a) => ({
      id: a.id,
      title: a.titre,
      excerpt: a.extrait,
      image: a.image,
      date: a.date,
      link: `/blog/${a.id}`,
    }))

  /* Galerie : images des albums, en alternant les albums (1re image de chacun,
     puis 2e image de chacun…) pour varier les légendes ; albums récents d'abord */
  const parAlbum = (albums?.data?.items ?? [])
    .map(normalizeAlbum)
    .sort((a, b) => b.dateCreation.localeCompare(a.dateCreation))
    .map((album) =>
      album.medias
        .filter((m) => m.type === 'image')
        .map((m) => ({ id: `${album.id}-${m.id}`, image: m.url, caption: album.titre })),
    )
  const gallery = []
  const maxParAlbum = Math.max(0, ...parAlbum.map((l) => l.length))
  for (let i = 0; i < maxParAlbum && gallery.length < 8; i++) {
    for (const liste of parAlbum) {
      if (liste[i] && gallery.length < 8) gallery.push(liste[i])
    }
  }

  /* Boutique : produits en stock (pas de rupture), nouveautés d'abord, 5 au plus */
  const products = (shop?.data?.items ?? [])
    .map(normalizeProduct)
    .filter((p) => p.stock > 0)
    .sort((a, b) => Number(b.estNouveau) - Number(a.estNouveau))
    .slice(0, 5)

  /* Classements : top 3 de chaque catégorie qui en a un */
  const tables = await Promise.all(
    categories.map((c) =>
      settled(api(`/api/rankings/${c.id}`), null).then((d) => ({
        category: c.nom,
        teams: (d?.data?.items ?? []).slice(0, 3).map((t) => ({
          position: t.position,
          name: t.equipe,
          points: t.points,
        })),
      })),
    ),
  )
  const rankings = tables.filter((t) => t.teams.length > 0)

  /* Chiffres clés : uniquement ceux réellement disponibles */
  const stats = []
  const nbPlayers = players?.data?.total
  if (nbPlayers > 0) stats.push({ icon: 'users', value: nbPlayers, suffix: '', label: 'Joueurs inscrits' })
  if (categories.length > 0) stats.push({ icon: 'calendar-check', value: categories.length, suffix: '', label: "Catégories d'âge" })
  const nbResults = results?.data?.total
  if (nbResults > 0) stats.push({ icon: 'futbol', value: nbResults, suffix: '', label: 'Matchs joués' })
  if (publies.length > 0) stats.push({ icon: 'medal', value: publies.length, suffix: '', label: 'Articles publiés' })

  return { matches, news, rankings, gallery, products, stats }
}

/** Hook React : { matches, news, rankings, gallery, products, stats }. */
export default function useHomeData() {
  const [data, setData] = useState(cached ?? EMPTY)

  useEffect(() => {
    if (cached) return undefined
    let active = true
    if (!inflight) {
      inflight = load()
        .then((d) => {
          cached = d
          return d
        })
        .finally(() => {
          inflight = null
        })
    }
    inflight.then((d) => {
      if (active) setData(d)
    })
    return () => {
      active = false
    }
  }, [])

  return data
}
