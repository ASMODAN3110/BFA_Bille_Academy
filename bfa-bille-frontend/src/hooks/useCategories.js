import { useEffect, useState } from 'react'
import { api } from '../utils/api'

/* ============================================================
   useCategories — Catégories d'âge depuis GET /api/categories
   ------------------------------------------------------------
   - Une seule requête réseau partagée (cache module-level),
     quel que soit le nombre de composants consommateurs.
   - `categories` : [{ id, nom, ageMin, ageMax }] trié par le
     backend (ageMin croissant → U9, U15, U17).
   - Remplace l'ancienne constante `data/categories.js`.
   ============================================================ */

let cached = null
let inflight = null

/** Récupère les catégories (promesse partagée + cache). */
export async function fetchCategories() {
  if (cached) return cached
  if (!inflight) {
    inflight = api('/api/categories')
      .then((data) => {
        cached = data?.data ?? []
        return cached
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

/** Hook React : { categories, loading, error }. */
export function useCategories() {
  const [categories, setCategories] = useState(cached ?? [])
  const [loading, setLoading] = useState(cached === null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cached) {
      setCategories(cached)
      setLoading(false)
      return
    }
    let active = true
    fetchCategories()
      .then((list) => {
        if (!active) return
        setCategories(list)
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message || 'Impossible de charger les catégories.')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { categories, loading, error }
}
