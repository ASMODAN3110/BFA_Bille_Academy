import { Navigate } from 'react-router-dom'
import LoginCard from '../components/auth/LoginCard'
import LoginForm from '../components/auth/LoginForm'
import useAuth from '../hooks/useAuth'

/* ============================================================
   AdminLogin — Page de connexion back-office (/admin)
   ------------------------------------------------------------
   - Carte centrée (max 420 px) sur fond gris clair
   - Si déjà authentifié → redirection vers le tableau de bord
   - Le Navbar et le Footer sont rendus globalement dans App.jsx
     (variante « public » : lien Back-office masqué)
   ============================================================ */

export default function AdminLogin() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <section className="flex flex-1 items-center justify-center bg-clair px-4 py-16 md:py-20">
      <LoginCard
        title="Connexion Administration"
        subtitle="Accédez à votre espace pour gérer le contenu du site de la BFA."
      >
        <LoginForm />
      </LoginCard>
    </section>
  )
}
