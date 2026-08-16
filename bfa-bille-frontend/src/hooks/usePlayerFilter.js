import { useMemo, useState } from 'react'

/* ============================================================
   usePlayerFilter — Filtre et compteurs des joueurs
   ------------------------------------------------------------
   - `players`    : joueurs du backend (p. ex. GET /api/players)
   - `categories` : catégories du backend (GET /api/categories),
     objets { id, nom, ageMin, ageMax } — ordre de l'API
   - `selectedCategory` : 'Tous' | categorie.id
   - `counts` : nombre de joueurs par catégorie (par id)
   - Le tri est déjà fait côté serveur (nom puis prénom) :
     aucun tri client nécessaire.
   ============================================================ */

export default function usePlayerFilter(players, categories = []) {
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  // « Tous » + catégories dans l'ordre fourni par l'API (U9, U15, U17).
  const categoryList = useMemo(() => ['Tous', ...categories], [categories])

  // Nombre de joueurs par catégorie
  const counts = useMemo(() => {
    const acc = { Tous: players.length }
    for (const player of players) {
      const id = player.categorie?.id
      if (id != null) acc[id] = (acc[id] ?? 0) + 1
    }
    return acc
  }, [players])

  // Joueurs de la catégorie sélectionnée (ordre serveur conservé)
  const filteredPlayers = useMemo(() => {
    if (selectedCategory === 'Tous') return players
    return players.filter((p) => p.categorie?.id === selectedCategory)
  }, [players, selectedCategory])

  return {
    categories: categoryList,
    counts,
    selectedCategory,
    setSelectedCategory,
    filteredPlayers,
  }
}
