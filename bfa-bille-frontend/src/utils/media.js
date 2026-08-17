/* ============================================================
   media — Upload / suppression de médias via le backend (S3/MinIO)
   ------------------------------------------------------------
   Principe : le navigateur n'écrit jamais directement sur MinIO.
   Tout passe par les routes protégées du backend (/admin/media/*)
   qui renvoient { key, url }. L'URL publique retournée est ensuite
   stockée telle quelle dans les champs photo / image des entités
   (joueurs, blog, boutique). Les albums de la galerie passent, eux,
   par POST /admin/albums/:id/media (Module 4) — voir albumAdapter.
   L'affichage charge directement l'URL MinIO (bucket en lecture
   publique — aucune auth côté <img>).
   ============================================================ */

import { api } from './api'

/** Upload d'un fichier unique → { key, url }. */
export async function uploadMedia(file, dossier) {
  const form = new FormData()
  form.append('file', file) // champ attendu par /admin/media/upload
  form.append('dossier', dossier) // joueurs | blog | boutique
  const res = await api('/admin/media/upload', {
    method: 'POST',
    body: form,
    auth: true,
  })
  return res.data // { key, url }
}
