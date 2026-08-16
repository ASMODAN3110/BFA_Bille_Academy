import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  server: {
    // Le frontend appelle le backend en chemins relatifs (/api, /admin) ;
    // Vite les proxy vers le serveur Express :4000 (pas de CORS à gérer).
    proxy: {
      '/api': 'http://localhost:4000',
      // Les routes SPA /admin et /admin/dashboard (React Router) partagent
      // leurs chemins avec les API back-office /admin/dashboard, /admin/…
      // → on ne proxifie QUE les requêtes API (fetch/XHR, Accept ≠ text/html) ;
      //   les navigations navigateur (Accept: text/html) restent servies par le SPA.
      '/admin': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        bypass(req) {
          const accept = req.headers.accept || ''
          if (accept.includes('text/html')) return '/index.html'
        },
      },
    },
  },
})
