import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import { fetchAllBlogsAdmin } from '../../lib/blogsApi'
import type { Blog } from '../../lib/blogTypes'

function AdminHome() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null)

  useEffect(() => {
    fetchAllBlogsAdmin()
      .then(setBlogs)
      .catch(() => setBlogs([]))
  }, [])

  const total = blogs?.length ?? 0
  const published = blogs?.filter((b) => b.status === 'published').length ?? 0
  const drafts = total - published

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage blog articles for Atharva Wealth</p>
        </div>
        <Link to="/admin/blogs/new" className="btn btn-gold px-6 py-2.5 text-xs inline-flex items-center gap-2">
          <Plus size={16} />
          New Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Posts</p>
          <p className="text-3xl font-black text-white">{blogs === null ? '—' : total}</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Published</p>
          <p className="text-3xl font-black text-gold-500">{blogs === null ? '—' : published}</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Drafts</p>
          <p className="text-3xl font-black text-gray-300">{blogs === null ? '—' : drafts}</p>
        </div>
      </div>

      <Link
        to="/admin/blogs"
        className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-gold-500/40 transition-colors"
      >
        <FileText className="text-gold-500" size={24} />
        <div>
          <p className="text-white font-medium">Manage all blogs</p>
          <p className="text-gray-500 text-sm">View, edit, publish, or delete articles</p>
        </div>
      </Link>
    </AdminShell>
  )
}

export default AdminHome
