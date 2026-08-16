import { createContext, useCallback, useMemo, useState } from 'react'
import { api, getStoredUser, setSession, clearSession } from '../utils/api'

/* ============================================================
   AuthContext — Authentification du back-office
   ------------------------------------------------------------
   - `login(email, motDePasse)` : POST /api/auth/login. En cas de
     succès, stocke { token, user } (localStorage) et résout le
     compte connecté. En cas d'échec, rejette la promesse avec le
     message du backend (l'appelant l'affiche).
   - `logout()` : POST /api/auth/logout (best-effort), puis purge
     la session locale.
   - Au chargement, on restaure la session depuis localStorage
     (lecture synchrone → aucun flash de redirection).
   - Enveloppe des réponses : { success, ... } → on teste
     data.success avant d'utiliser data.token / data.user.
   ============================================================ */

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

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
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
