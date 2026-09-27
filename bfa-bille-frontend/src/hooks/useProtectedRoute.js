import { createElement } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from './useAuth'

/* ============================================================
   useProtectedRoute — Protection des routes back-office (@EF48)
   ------------------------------------------------------------
   - Retourne l'état d'authentification et un composant
     <Protected> qui rend le children s'il est authentifié,
     sinon redirige vers /admin.
   Usage :
     const { isAuthenticated, Protected } = useProtectedRoute()
   ============================================================ */

export default function useProtectedRoute() {
  const { isAuthenticated } = useAuth()

  function Protected({ children }) {
    return isAuthenticated
      ? children
      : createElement(Navigate, { to: '/admin', replace: true })
  }

  return { isAuthenticated, Protected }
}
