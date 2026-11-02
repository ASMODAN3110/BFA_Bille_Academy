import { useMemo, useState } from 'react'

/* ============================================================
   usePlayerFilter — Recherche, filtres et compteurs des joueurs
   ------------------------------------------------------------
   - `players`    : joueurs du backend (p. ex. GET /api/players)
   - `categories` : catégories du backend (GET /api/categories),
     objets { id, nom, ageMin, ageMax } — ordre de l'API
   - `selectedCategory` : 'Tous' | categorie.id
   - `selectedPoste`    : 'Tous' | poste (Gardien, Défenseur…)
   - `search`           : texte libre (nom ou prénom, sans accents
     ni casse)
   - `counts` : nombre de joueurs par catégorie (par id)
   - Le tri est déjà fait côté serveur (nom puis prénom) :
     aucun tri client nécessaire.
   ============================================================ */

const POSTE_ORDER = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant']

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export default function usePlayerFilter(players, categories = []) {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedPoste, setSelectedPoste] = useState('Tous')
  const [search, setSearch] = useState('')

  // « Tous » + catégories dans l'ordre fourni par l'API (U9, U15, U17).
  const categoryList = useMemo(() => ['Tous', ...categories], [categories])

  // « Tous » + postes présents dans l'effectif (ordre usuel, puis les autres)
  const posteList = useMemo(() => {
    const present = [...new Set(players.map((p) => p.poste).filter(Boolean))]
    present.sort((a, b) => {
      const ia = POSTE_ORDER.indexOf(a)
      const ib = POSTE_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b, 'fr')
    })
    return ['Tous', ...present]
  }, [players])

  // Nombre de joueurs par catégorie
  const counts = useMemo(() => {
    const acc = { Tous: players.length }
    for (const player of players) {
      const id = player.categorie?.id
      if (id != null) acc[id] = (acc[id] ?? 0) + 1
    }
    return acc
  }, [players])

  // Joueurs correspondant aux trois filtres (ordre serveur conservé)
  const filteredPlayers = useMemo(() => {
    const q = normalize(search)
    return players.filter((p) => {
      if (selectedCategory !== 'Tous' && p.categorie?.id !== selectedCategory) return false
      if (selectedPoste !== 'Tous' && p.poste !== selectedPoste) return false
      if (q && !normalize(`${p.prenom} ${p.nom} ${p.nom} ${p.prenom}`).includes(q)) return false
      return true
    })
  }, [players, selectedCategory, selectedPoste, search])

  return {
    categories: categoryList,
    postes: posteList,
    counts,
    selectedCategory,
    setSelectedCategory,
    selectedPoste,
    setSelectedPoste,
    search,
    setSearch,
    filteredPlayers,
  }
}
