import {
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import useAuth from './hooks/useAuth'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Players from './pages/Players'
import Calendar from './pages/Calendar'
import Trials from './pages/Trials'
import Gallery from './pages/Gallery'
import TeamSheet from './pages/TeamSheet'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import Results from './pages/Results'
import Shop from './pages/Shop'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminPlayers from './pages/AdminPlayers'
import AdminCalendar from './pages/AdminCalendar'
import AdminTrials from './pages/AdminTrials'
import AdminGallery from './pages/AdminGallery'
import AdminTeamSheets from './pages/AdminTeamSheets'
import AdminBlog from './pages/AdminBlog'
import AdminResults from './pages/AdminResults'
import AdminShop from './pages/AdminShop'
import AdminSettings from './pages/AdminSettings'
import AdminLayout from './layouts/AdminLayout'
import Placeholder from './pages/Placeholder'

/* ============================================================
   ProtectedRoute — Garde-fou des pages back-office (@EF48)
   ------------------------------------------------------------
   Redirige vers /admin si l'utilisateur n'est pas authentifié.
   ============================================================ */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }
  return children
}

/* ============================================================
   AdminApp — Sous-application back-office (MemoryRouter)
   ------------------------------------------------------------
   Toute la navigation admin se fait en mémoire : l'URL dans la
   barre d'adresse reste /admin, les chemins /admin/calendar,
   /admin/players, etc. ne sont JAMAIS visibles ni accessibles
   directement. Au montage, on remplace l'URL navigateur par
   /admin pour masquer le chemin d'entrée éventuel.
   ============================================================ */
function AdminApp() {
  const { isAuthenticated } = useAuth()

  // Au montage : remplace l'URL navigateur par /admin (sans recharger).
  useEffect(() => {
    window.history.replaceState({}, '', '/admin')
  }, [])

  // Point de départ : dashboard si déjà connecté, login sinon.
  const initialPath = isAuthenticated ? '/admin/dashboard' : '/admin'

  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
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
      </Routes>
    </MemoryRouter>
  )
}

/* ============================================================
   AppShell — Layout global + routes publiques
   ------------------------------------------------------------
   Navbar / Footer rendus autour des routes publiques.
   La zone /admin/* est gérée par AdminApp (MemoryRouter) qui
   a son propre layout (AdminLayout) sans Navbar/Footer.
   ============================================================ */
function AppShell() {
  const { pathname } = useLocation()
  const isAdminSection = pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminSection && <Navbar />}

      <main className="flex-1">
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

          {/* Zone back-office : MemoryRouter (URL masquée) */}
          <Route path="/admin/*" element={<AdminApp />} />

          <Route path="*" element={<Placeholder page="/" />} />
        </Routes>
      </main>

      {!isAdminSection && <Footer variant="default" />}
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
