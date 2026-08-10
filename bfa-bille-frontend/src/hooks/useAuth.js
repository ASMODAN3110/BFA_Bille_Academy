import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

/* ============================================================
   useAuth — Hook d'accès au contexte d'authentification
   ------------------------------------------------------------
   Retourne { user, isAuthenticated, login, logout }.
   Lève une erreur claire si le hook est utilisé hors du
   <AuthProvider>.
   ============================================================ */

export default function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un <AuthProvider>.')
  }
  return context
}
