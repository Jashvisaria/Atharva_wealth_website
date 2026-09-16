import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-obsidian">
      <header
        className="border-b"
        style={{ borderColor: 'rgba(197, 160, 89, 0.1)', background: 'rgba(13, 13, 13, 0.9)' }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
              <span className="text-obsidian text-sm font-bold">AW</span>
            </div>
            <span className="text-lg font-bold tracking-wider text-white">
              ATHARVA <span className="text-gold-500">ADMIN</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/admin" className="text-sm text-gray-400 hover:text-gold-400 transition-colors tracking-wide">
              Dashboard
            </Link>
            <Link to="/admin/blogs" className="text-sm text-gray-400 hover:text-gold-400 transition-colors tracking-wide">
              Blogs
            </Link>
            <Link to="/blog" className="text-sm text-gray-400 hover:text-gold-400 transition-colors tracking-wide">
              View Blog
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold-400 transition-colors tracking-wide"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">{children}</main>
    </div>
  )
}

export default AdminShell
