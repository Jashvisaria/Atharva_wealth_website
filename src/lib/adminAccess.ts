import { supabase } from './supabaseClient'

// Single source of truth for "is the current session an admin?" — backed by
// the existing is_admin() RPC, which checks the existing admin_users table
// server-side. Used by the login flow, the login page's already-signed-in
// check, and the route guard, so all three agree on the same definition.
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}
