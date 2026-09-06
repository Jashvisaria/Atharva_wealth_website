import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      const { data: { session } } = supabase.auth.getSession()
      if (session) window.location.href = '/admin'
    }
  }

  if (error) {
    return (
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="alert alert-error">
              <p className="text-red-500">{error}</p>
            </div>
            <button onClick={() => setError('')} className="btn btn-primary mt-4">
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-500 mb-4">Admin Login</h2>
          <p className="text-base-content/70 mb-8">Sign in to manage blogs</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Sign In
            </button>
          </form>
        </div>
      </section>
    </section>
  )
}