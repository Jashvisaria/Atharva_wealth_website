import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { checkIsAdmin } from '../../lib/adminAccess'

function AdminLogin() {
  const navigate = useNavigate()
  const [checkingSession, setCheckingSession] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // If an already-authenticated admin lands on /admin/login, skip the form
  // and send them straight to the dashboard. A non-admin session is left
  // alone here (not signed out) — this is a passive check, not an access
  // attempt; the submit flow below is what enforces admin-only access.
  useEffect(() => {
    let active = true
    async function checkExistingSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        if (active) setCheckingSession(false)
        return
      }
      const isAdmin = await checkIsAdmin()
      if (!active) return
      if (isAdmin) {
        navigate('/admin', { replace: true })
      } else {
        setCheckingSession(false)
      }
    }
    checkExistingSession()
    return () => {
      active = false
    }
  }, [navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !data.session) {
      setError('Invalid email or password.')
      setSubmitting(false)
      return
    }

    const isAdmin = await checkIsAdmin()

    if (!isAdmin) {
      await supabase.auth.signOut()
      setError('You do not have admin access.')
      setSubmitting(false)
      return
    }

    navigate('/admin', { replace: true })
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <p className="text-gray-500 text-sm">Checking session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-4">
            <span className="text-obsidian font-bold text-lg">AW</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            ATHARVA <span className="text-gold-500">ADMIN</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage blog content</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 tracking-wide">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-white/5 border px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/60 transition-colors"
              style={{ borderColor: 'rgba(197, 160, 89, 0.2)' }}
              autoComplete="username"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 tracking-wide">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-white/5 border px-4 py-2.5 text-white focus:outline-none focus:border-gold-500/60 transition-colors"
              style={{ borderColor: 'rgba(197, 160, 89, 0.2)' }}
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-gold w-full py-2.5 text-xs disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
