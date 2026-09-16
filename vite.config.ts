import { defineConfig, type Plugin } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// In dev, Vite's SPA fallback serves the root index.html (the static homepage)
// for any unmatched path. The React blog/admin app lives at app.html instead,
// so requests under /blog and /admin need to be routed there. Rewriting the
// request URL to /app.html lets Vite's own HTML middleware transform it
// normally (same result as visiting /app.html directly); the browser's
// address bar / BrowserRouter location is unaffected since this only changes
// which file the dev server responds with.
function reactAppRoutes(): Plugin {
  return {
    name: 'react-app-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url === '/blog' || url.startsWith('/blog/') || url === '/admin' || url.startsWith('/admin/')) {
          req.url = '/app.html'
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [reactAppRoutes(), react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        contact: resolve(__dirname, 'contact.html'),
        founder: resolve(__dirname, 'founder.html'),
        insights: resolve(__dirname, 'insights.html'),
        pms: resolve(__dirname, 'pms.html'),
        aif: resolve(__dirname, 'aif.html'),
        tools: resolve(__dirname, 'tools.html'),
        dsc: resolve(__dirname, 'dsc.html'),
        'mutual-funds': resolve(__dirname, 'mutual-funds.html'),
        'goal-planning': resolve(__dirname, 'goal-planning.html'),
        success: resolve(__dirname, 'success.html'),
        app: resolve(__dirname, 'app.html'),
      }
    }
  }
})