/* ============================================================
   media — Upload / suppression de médias via le backend (S3/MinIO)
   ------------------------------------------------------------
   Principe : le navigateur n'écrit jamais directement sur MinIO.
   Tout passe par les routes protégées du backend (/admin/media/*)
   qui renvoient { key, url }. L'URL publique retournée est ensuite
   stockée telle quelle dans les champs photo / image / coverImage /
   medias des entités. L'affichage charge directement l'URL MinIO
   (bucket en lecture publique — aucune auth côté <img>).
   ============================================================ */

import { api } from './api'

/** Upload d'un fichier unique → { key, url }. */
export async function uploadMedia(file, dossier) {
  const form = new FormData()
  form.append('file', file) // champ attendu par /admin/media/upload
  form.append('dossier', dossier) // joueurs | galerie | blog | boutique
  const res = await api('/admin/media/upload', {
    method: 'POST',
    body: form,
    auth: true,
  })
  return res.data // { key, url }
}

/** Upload multiple (albums) → [{ key, url }, ...] (ordre conservé). */
export async function uploadManyMedia(files, dossier) {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  form.append('dossier', dossier)
  const res = await api('/admin/media/upload-many', {
    method: 'POST',
    body: form,
    auth: true,
  })
  return res.data
}

/** Suppression d'un média — accepte la clé OU l'URL publique. */
export async function deleteMedia(urlOrKey) {
  await api('/admin/media', {
    method: 'DELETE',
    body: { url: urlOrKey },
    auth: true,
  })
}
