import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { checkIsAdmin } from './adminAccess'

interface AdminAuthState {
  session: Session | null
  isAdmin: boolean
  loading: boolean
}

// Session comes from Supabase Auth (email/password, no public signup).
// Admin status is authoritative server-side via the is_admin() RPC (which
// checks the existing admin_users table), so this is a UI gate only — the
// real enforcement for reads/writes happens in Postgres RLS policies.
//
// Used by RequireAdmin to guard admin routes. If a session exists but isn't
// an admin, it's force-signed-out here so a stale/non-admin session can't
// keep bouncing between a protected route and the login page.
export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function checkAdmin(currentSession: Session | null) {
      if (!currentSession) {
        if (active) setIsAdmin(false)
        return
      }
      const admin = await checkIsAdmin()
      if (!active) return
      setIsAdmin(admin)
      if (!admin) {
        supabase.auth.signOut()
      }
    }

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!active) return
      setSession(initialSession)
      await checkAdmin(initialSession)
      if (active) setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      checkAdmin(newSession)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  return { session, isAdmin, loading }
}
