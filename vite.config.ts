import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const pageNames = [
  'index',
  'about',
  'services',
  'contact',
  'tools',
  'pms',
  'aif',
  'mutual-funds',
  'founder',
  'meghna',
  'goal-planning',
  'dsc',
  'success',
  'insights',
]

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pageNames.map(name => [name, `${name}.html`])
      ),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
    assetsDir: 'assets',
    sourcemap: true,
    target: 'es2022',
  },
  server: {
    open: true,
  },
})