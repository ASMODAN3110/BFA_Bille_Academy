import { createContext, useCallback, useMemo, useState } from 'react'
import { adminCredentials } from '../data/mockData'

/* ============================================================
   AuthContext — Authentification du back-office
   ------------------------------------------------------------
   - `login(email, password)` : simule un appel API (1,5 s) puis
     vérifie les identifiants contre `adminCredentials`. Résout
     le compte connecté en cas de succès, rejette la promesse en
     cas d'échec (l'appelant affiche le message d'erreur).
   - `logout()` : supprime la session et le token stocké.
   - Au chargement, on restaure la session depuis localStorage
     (lecture synchrone → aucun flash de redirection).
   ============================================================ */

const TOKEN_KEY = 'bfa_admin_token'

/* Restaure l'utilisateur connecté depuis le localStorage (ou null). */
function readStoredUser() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.email ? { email: parsed.email } : null
  } catch {
    return null
  }
}

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback(async (email, password) => {
    // Simulation d'appel API (1,5 s) — à brancher sur un vrai endpoint.
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success =
      email === adminCredentials.email && password === adminCredentials.motDePasse

    if (!success) {
      throw new Error('Identifiants incorrects.')
    }

    const currentUser = { email: adminCredentials.email }
    localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({ token: 'mock-token-bfa', email: currentUser.email }),
    )
    setUser(currentUser)
    return currentUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
