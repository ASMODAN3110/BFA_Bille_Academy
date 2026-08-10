import { useMemo, useState } from 'react'

/* ============================================================
   usePlayerFilter — Filtre, tri et compteurs des joueurs
   ------------------------------------------------------------
   - Catégories calculées depuis les données (ordre canonique
     U9, U15, U17) + « Tous »
   - `counts` : nombre de joueurs par catégorie
   - `filteredPlayers` : joueurs de la catégorie sélectionnée,
     triés par ordre alphabétique (nom)
   ============================================================ */

const CATEGORY_ORDER = { U9: 0, U15: 1, U17: 2 }

export default function usePlayerFilter(players) {
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  // Liste des catégories dans un ordre stable
  const categories = useMemo(() => {
    const cats = [...new Set(players.map((p) => p.categorie))]
    cats.sort((a, b) => (CATEGORY_ORDER[a] ?? 9) - (CATEGORY_ORDER[b] ?? 9))
    return ['Tous', ...cats]
  }, [players])

  // Nombre de joueurs par catégorie
  const counts = useMemo(() => {
    const acc = { Tous: players.length }
    for (const player of players) {
      acc[player.categorie] = (acc[player.categorie] ?? 0) + 1
    }
    return acc
  }, [players])

  // Joueurs filtrés + tri alphabétique
  const filteredPlayers = useMemo(() => {
    const list =
      selectedCategory === 'Tous'
        ? players
        : players.filter((p) => p.categorie === selectedCategory)
    return [...list].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  }, [players, selectedCategory])

  return {
    categories,
    counts,
    selectedCategory,
    setSelectedCategory,
    filteredPlayers,
  }
}
