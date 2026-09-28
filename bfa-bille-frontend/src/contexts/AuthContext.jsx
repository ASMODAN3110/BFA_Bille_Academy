import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  api,
  getToken,
  getStoredUser,
  setSession,
  clearSession,
} from '../utils/api'

/* ============================================================
   AuthContext — Authentification du back-office
   ------------------------------------------------------------
   - `login(email, motDePasse)` : POST /api/auth/login. En cas de
     succès, stocke { token, user } (localStorage) et résout le
     compte connecté. En cas d'échec, rejette la promesse avec le
     message du backend (l'appelant l'affiche).
   - `logout()` : POST /api/auth/logout (best-effort), puis purge
     la session locale.
   - Au chargement, la session stockée n'est JAMAIS considérée
     comme valide à elle seule : on appelle GET /api/auth/me pour
     la revalider auprès du serveur. En cas d'échec (token expiré,
     serveur injoignable…), la session est purgée — impossible
     d'entrer dans le back-office sur la seule foi du localStorage.
   - `checking` : vrai tant que la validation est en cours.
     ProtectedRoute l'utilise pour afficher un chargement au lieu
     de rediriger trop tôt.
   - Enveloppe des réponses : { success, ... } → on teste
     data.success avant d'utiliser data.token / data.user.
   ============================================================ */

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [checking, setChecking] = useState(() => Boolean(getStoredUser()))

  useEffect(() => {
    const storedUser = getStoredUser()
    const token = getToken()
    if (!storedUser || !token) {
      setUser(null)
      setChecking(false)
      return
    }

    let cancelled = false
    fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.success || !data.user) {
          throw new Error('session invalide')
        }
        if (cancelled) return
        setSession({ token, user: data.user })
        setUser(data.user)
      })
      .catch(() => {
        if (cancelled) return
        clearSession()
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, motDePasse) => {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { email, motDePasse },
    })

    if (!data || !data.success) {
      throw new Error(data?.message || 'Identifiants incorrects.')
    }

    setSession({ token: data.token, user: data.user })
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    // Best-effort : on déconnecte localement même si le backend ne répond pas.
    api('/api/auth/logout', { method: 'POST' }).catch(() => {})
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), checking, login, logout }),
    [user, checking, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
