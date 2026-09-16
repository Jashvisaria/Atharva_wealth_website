import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ConfigErrorScreen from './components/ConfigErrorScreen.tsx'
import { supabaseConfigError } from './lib/supabaseClient.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {supabaseConfigError ? <ConfigErrorScreen message={supabaseConfigError} /> : <App />}
  </StrictMode>,
)
