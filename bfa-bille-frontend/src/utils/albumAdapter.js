/* ============================================================
   albumAdapter — Normalisation des albums du backend (Module 4)
   ------------------------------------------------------------
   Contrat backend :
   - Album = { id, titre, description, dateCreation (ISO UTC),
     theme, medias: [{ id, key, url, type ("image"|"video"), nom }] }
   - theme : l'une des 4 chaînes exactes « Entraînements »,
     « Matchs », « Événements », « Portraits » (filtre + labels).
   Le front consomme `dateCreation` en clé "YYYY-MM-DD" (parseLocalDate
   ne sait pas parser une chaîne ISO complète) et la couverture d'un
   album est la première de ses images (il n'existe pas de coverImage).
   ============================================================ */

/** Liste fixe des thèmes (@EF21) — partagée par le public et l'admin. */
export const ALBUM_THEMES = [
  'Entraînements',
  'Matchs',
  'Événements',
  'Portraits',
]

/** Normalise un album du backend pour l'affichage public/admin. */
export function normalizeAlbum(d) {
  return {
    id: d.id,
    titre: d.titre,
    description: d.description ?? '',
    theme: d.theme,
    dateCreation: String(d.dateCreation ?? '').slice(0, 10),
    medias: Array.isArray(d.medias) ? d.medias : [],
  }
}

/** Couverture d'un album = première image des médias (ou null). */
export function getAlbumCover(album) {
  const firstImage = (album?.medias ?? []).find((m) => m.type === 'image')
  return firstImage?.url ?? null
}
