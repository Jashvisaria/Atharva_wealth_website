import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// A missing env var used to `throw` here at module-evaluation time, which
// happens before React ever mounts anything — every page that (transitively)
// imports this file would crash with no visible error, just a blank page.
// Instead, surface the problem via this flag so main.tsx can render a real
// error screen, and fall back to harmless placeholder values so createClient
// itself never throws.
export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set in .env.'
    : null

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseAnonKey || 'placeholder-key'
)
