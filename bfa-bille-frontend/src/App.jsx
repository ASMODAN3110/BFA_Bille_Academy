import { lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import useAuth from './hooks/useAuth'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
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
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
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
const Placeholder = lazy(() => import('./pages/Placeholder'))

/* ============================================================
   ProtectedRoute — Garde-fou des pages back-office (@EF48)
   ------------------------------------------------------------
   Redirige vers /admin si l'utilisateur n'est pas authentifié.
   ============================================================ */
function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth()
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
    return <Navigate to="/admin" replace />
  }
  return children
}

/* ============================================================
   AppShell — Layout global + routes
   ------------------------------------------------------------
   Navbar / Footer rendus une seule fois autour des Routes
   (sauf dans la zone admin /admin/* qui a son propre layout).
   Sur la page de connexion (/admin), le Footer passe en variante
   « public » (le bouton Back-office y est masqué).
   ============================================================ */
function AppShell() {
  const { pathname } = useLocation()
  const isAdminLogin = pathname === '/admin'
  const isAdminArea = pathname.startsWith('/admin/')

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
          <Route path="/admin" element={<AdminLogin />} />

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

            <Route path="*" element={<Placeholder page="/" />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminArea && (
        <Footer variant="default" />
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
