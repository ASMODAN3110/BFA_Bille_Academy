/* ============================================================
   api — Wrapper HTTP du back-office (fetch + token JWT)
   ------------------------------------------------------------
   Contrat backend (voir doc du projet) :
   - Toute réponse est enveloppée { success, ... } → l'appelant
     teste `data.success` avant d'utiliser data.token / data.data.
   - Auth : header `Authorization: Bearer <token>` sur les routes
     protégées.
   - Sur 401 d'une route protégée : session expirée → purge du
     token + redirection vers /admin (login) (@EF48).

   Base URL :
   - Dev : chemins relatifs (`/api/...`, `/admin/...`) servis par
     le proxy Vite (vite.config.ts) vers le backend :4000.
   - Production : surcharge via la variable d'env VITE_API_URL
     (ex. https://api.bfa-academy.com) si le backend n'est pas
     derrière le même reverse-proxy.
   ============================================================ */

const TOKEN_KEY = 'bfa_admin_token'

/* ---------- Gestion de la session (localStorage) ---------- */

export function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    return JSON.parse(raw)?.token ?? null
  } catch {
    return null
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    return JSON.parse(raw)?.user ?? null
  } catch {
    return null
  }
}

export function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, user }))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
}

/* ---------- Requête ---------- */

/**
 * Requête HTTP vers le backend.
 * @param {string} path  chemin relatif (ex. '/api/auth/login')
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {object} [options.body]            sérialisé en JSON
 * @param {boolean} [options.auth=false]     si vrai : ajoute le
 *   Bearer token ET traite le 401 comme une session expirée.
 */
export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  const token = getToken()
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Impossible de contacter le serveur. Réessayez.')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  // Session expirée sur une route protégée → déconnexion + login.
  if (res.status === 401 && auth) {
    clearSession()
    window.location.assign('/admin')
    throw new Error(data?.message || 'Session expirée.')
  }

  if (!res.ok) {
    throw new Error(data?.message || `Erreur ${res.status}.`)
  }

  return data
}
