import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import useAuth from './hooks/useAuth'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoginModal from './components/auth/LoginModal'
import Home from './pages/Home'

/* Code-splitting par route (@ENF-ACC-05) : chaque page est chargée à la
   demande via React.lazy — le bundle initial ne contient que le shell
   (Navbar/Footer/Auth) + la page d'accueil. */
const Players = lazy(() => import('./pages/Players'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Trials = lazy(() => import('./pages/Trials'))
const Gallery = lazy(() => import('./pages/Gallery'))
const TeamSheet = lazy(() => import('./pages/TeamSheet'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetails = lazy(() => import('./pages/BlogDetails'))
const Results = lazy(() => import('./pages/Results'))
const Shop = lazy(() => import('./pages/Shop'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminPlayers = lazy(() => import('./pages/AdminPlayers'))
const AdminCategories = lazy(() => import('./pages/AdminCategories'))
const AdminCalendar = lazy(() => import('./pages/AdminCalendar'))
const AdminTrials = lazy(() => import('./pages/AdminTrials'))
const AdminGallery = lazy(() => import('./pages/AdminGallery'))
const AdminTeamSheets = lazy(() => import('./pages/AdminTeamSheets'))
const AdminBlog = lazy(() => import('./pages/AdminBlog'))
const AdminResults = lazy(() => import('./pages/AdminResults'))
const AdminShop = lazy(() => import('./pages/AdminShop'))
const AdminSettings = lazy(() => import('./pages/AdminSettings'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))

/* ============================================================
   ProtectedRoute — Garde-fou des pages back-office (@EF48)
   ------------------------------------------------------------
   Redirige vers /admin (modale de connexion) si l'utilisateur n'est pas
   authentifié, ou vers l'accueil juste après une déconnexion.
   ============================================================ */
function ProtectedRoute({ children }) {
  const { isAuthenticated, checking, loggedOut } = useAuth()
  if (checking) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center"
        role="status"
        aria-label="Vérification de la session"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-vert/20 border-t-vert" />
      </div>
    )
  }
  if (!isAuthenticated) {
    // Déconnexion volontaire → accueil ; sinon /admin ouvre la modale de connexion.
    return <Navigate to={loggedOut ? '/' : '/admin'} replace />
  }
  return children
}

/* ============================================================
   AdminEntry — Route /admin (saisie directe de l'adresse)
   ------------------------------------------------------------
   Plus de page de connexion : on renvoie vers l'accueil en
   demandant l'ouverture de la modale de connexion (état de
   navigation `openLogin`), ou vers le tableau de bord si la
   session est déjà ouverte. Les redirections des routes
   protégées et des sessions expirées passent aussi par /admin.
   ============================================================ */
function AdminEntry() {
  const { isAuthenticated, checking } = useAuth()
  if (checking) return null
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/" replace state={{ openLogin: true }} />
}

/* ============================================================
   AppShell — Layout global + routes
   ------------------------------------------------------------
   Navbar / Footer rendus une seule fois autour des Routes
   (sauf dans la zone admin /admin/* qui a son propre layout).
   La connexion au back-office est une modale (lien « Back-office »
   du Footer, ou redirection depuis /admin).
   ============================================================ */
function AppShell() {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const isAdminArea = pathname.startsWith('/admin/')
  const [loginOpen, setLoginOpen] = useState(false)

  const openLogin = useCallback(() => {
    if (isAuthenticated) navigate('/admin/dashboard')
    else setLoginOpen(true)
  }, [isAuthenticated, navigate])

  /* Arrivée via /admin : ouvre la modale puis nettoie l'état de navigation
     (un rechargement ne la rouvre pas). */
  useEffect(() => {
    if (state?.openLogin) {
      setLoginOpen(true)
      navigate(pathname, { replace: true, state: null })
    }
  }, [state, pathname, navigate])

  /* Connexion réussie → on entre dans la zone admin : la modale se ferme. */
  useEffect(() => {
    if (isAdminArea) setLoginOpen(false)
  }, [isAdminArea])

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminArea && (
        <Navbar />
      )}

      <main className="flex-1">
        <Suspense
          fallback={
            <div
              className="flex min-h-[50vh] items-center justify-center"
              role="status"
              aria-label="Chargement de la page"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-vert/20 border-t-vert" />
            </div>
          }
        >
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipes" element={<Players />} />
          <Route
            path="/equipes/technique"
            element={<Navigate to="/equipes/technique/U9" replace />}
          />
          <Route
            path="/equipes/technique/:categorie"
            element={<TeamSheet />}
          />
          <Route path="/calendrier" element={<Calendar />} />
          <Route path="/essais" element={<Trials />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="/boutique" element={<Shop />} />
          <Route path="/admin" element={<AdminEntry />} />

          {/* Zone back-office : layout protégé (@EF48) */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/players" element={<AdminPlayers />} />
            <Route
              path="/admin/players/add"
              element={<AdminPlayers autoAdd />}
            />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/calendar" element={<AdminCalendar />} />
            <Route
              path="/admin/events/add"
              element={<AdminCalendar autoAdd />}
            />
            <Route path="/admin/trials" element={<AdminTrials />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route
              path="/admin/team-sheets"
              element={<AdminTeamSheets />}
            />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/blog/new" element={<AdminBlog autoAdd />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/shop" element={<AdminShop />} />
            <Route path="/admin/products/add" element={<AdminShop autoAdd />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

            {/* Adresse /admin/… inconnue : même logique que /admin. */}
            <Route path="/admin/*" element={<AdminEntry />} />
            {/* Toute autre adresse inconnue : retour automatique à l'accueil. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminArea && (
        <>
          <Footer variant="default" onOpenLogin={openLogin} />
          <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
      )}
    </div>
  )
}

/* ============================================================
   App — Structure de l'application + authentification
   ------------------------------------------------------------
   L'AuthProvider enveloppe tout le layout pour que les pages
   back-office et ProtectedRoute partagent l'état de session.
   ============================================================ */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
