import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
      }
    }
  }
})