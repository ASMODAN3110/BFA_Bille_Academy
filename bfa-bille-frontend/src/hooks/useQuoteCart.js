import { useEffect, useState } from 'react'
import { MAX_LIGNES_DEVIS } from '../utils/shopAdapter'

/* ============================================================
   useQuoteCart — « Mon devis » : sélection de produits de la boutique
   ------------------------------------------------------------
   Liste d'articles à demander dans UN SEUL devis. Chaque article :
   { key, productId, nom, image, tailles, taille, quantite, prix }.
   - Même produit + même taille = une seule ligne (quantités additionnées)
   - 20 lignes maximum (limite du backend)
   - Conservée dans le navigateur (localStorage) pour survivre à un
     rechargement ; le stockage peut être indisponible (navigation privée) :
     tout fonctionne alors sans persistance.
   ============================================================ */

const STORAGE_KEY = 'bfa_devis_panier'
const QUANTITE_MAX = 999

const makeKey = (productId, taille) => `${productId}|${taille ?? ''}`

const clampQuantite = (value) =>
  Math.min(QUANTITE_MAX, Math.max(1, Math.trunc(Number(value)) || 1))

/** Lecture défensive : on ignore tout ce qui n'a pas la forme attendue. */
function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((i) => i && Number.isInteger(i.productId) && typeof i.nom === 'string')
      .slice(0, MAX_LIGNES_DEVIS)
      .map((i) => ({
        key: makeKey(i.productId, i.taille),
        productId: i.productId,
        nom: i.nom,
        image: typeof i.image === 'string' ? i.image : '',
        tailles: Array.isArray(i.tailles) ? i.tailles : [],
        taille: typeof i.taille === 'string' ? i.taille : '',
        quantite: clampQuantite(i.quantite),
        prix: Number(i.prix) || 0,
      }))
  } catch {
    return []
  }
}

export default function useQuoteCart() {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* stockage indisponible : on continue sans persistance */
    }
  }, [items])

  /** Ajoute un produit (1re taille par défaut). Renvoie false si la liste est pleine. */
  const add = (product) => {
    const taille = product.tailles?.[0] ?? ''
    const key = makeKey(product.id, taille)
    const existing = items.find((i) => i.key === key)
    if (!existing && items.length >= MAX_LIGNES_DEVIS) return false
    setItems((prev) =>
      prev.some((i) => i.key === key)
        ? prev.map((i) =>
            i.key === key ? { ...i, quantite: clampQuantite(i.quantite + 1) } : i,
          )
        : [
            ...prev,
            {
              key,
              productId: product.id,
              nom: product.nom,
              image: product.image ?? '',
              tailles: product.tailles ?? [],
              taille,
              quantite: 1,
              prix: Number(product.prix) || 0,
            },
          ],
    )
    return true
  }

  /** Modifie la quantité ou la taille d'une ligne (fusion si la même taille existe déjà). */
  const update = (key, patch) =>
    setItems((prev) => {
      const current = prev.find((i) => i.key === key)
      if (!current) return prev
      const next = { ...current, ...patch }
      if (patch.quantite !== undefined) next.quantite = clampQuantite(patch.quantite)
      next.key = makeKey(next.productId, next.taille)

      const others = prev.filter((i) => i.key !== key)
      const twin = others.find((i) => i.key === next.key)
      if (!twin) return prev.map((i) => (i.key === key ? next : i))
      // Même produit + même taille déjà présents : on fusionne les deux lignes.
      return others.map((i) =>
        i.key === twin.key
          ? { ...twin, quantite: clampQuantite(twin.quantite + next.quantite) }
          : i,
      )
    })

  const remove = (key) => setItems((prev) => prev.filter((i) => i.key !== key))

  /** Ne garde que les produits encore proposés (ids fournis) ; renvoie le nombre de lignes retirées. */
  const retainOnly = (availableIds) => {
    const removed = items.filter((i) => !availableIds.has(i.productId)).length
    if (removed > 0) setItems((prev) => prev.filter((i) => availableIds.has(i.productId)))
    return removed
  }
  const clear = () => setItems([])

  /** Quantité totale d'un produit dans la sélection (toutes tailles confondues). */
  const quantityOf = (productId) =>
    items.filter((i) => i.productId === productId).reduce((t, i) => t + i.quantite, 0)

  return {
    items,
    count: items.length,
    isFull: items.length >= MAX_LIGNES_DEVIS,
    add,
    update,
    remove,
    retainOnly,
    clear,
    quantityOf,
  }
}
