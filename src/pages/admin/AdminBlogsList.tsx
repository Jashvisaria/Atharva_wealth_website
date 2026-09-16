import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import { deleteBlog, fetchAllBlogsAdmin, updateBlog } from '../../lib/blogsApi'
import type { Blog } from '../../lib/blogTypes'

function AdminBlogsList() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  function load() {
    fetchAllBlogsAdmin()
      .then(setBlogs)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load blogs.'))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleTogglePublish(blog: Blog) {
    setBusyId(blog.id)
    try {
      const nextStatus = blog.status === 'published' ? 'draft' : 'published'
      const updated = await updateBlog(blog.id, {
        status: nextStatus,
        published_at: nextStatus === 'published' ? blog.published_at ?? new Date().toISOString() : blog.published_at,
      })
      setBlogs((prev) => prev?.map((b) => (b.id === blog.id ? updated : b)) ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(blog: Blog) {
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return
    setBusyId(blog.id)
    try {
      await deleteBlog(blog.id)
      setBlogs((prev) => prev?.filter((b) => b.id !== blog.id) ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-black tracking-tight text-white">Blogs</h1>
        <Link to="/admin/blogs/new" className="btn btn-gold px-6 py-2.5 text-xs inline-flex items-center gap-2">
          <Plus size={16} />
          New Blog
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {blogs === null ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : blogs.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-gray-400">No blog posts yet. Create your first one.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(197, 160, 89, 0.15)' }}>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gray-500 font-medium">Title</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gray-500 font-medium">Category</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gray-500 font-medium">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gray-500 font-medium">Updated</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gray-500 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b last:border-0" style={{ borderColor: 'rgba(197, 160, 89, 0.08)' }}>
                  <td className="px-6 py-4 text-white font-medium max-w-xs truncate">{blog.title}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{blog.category || '—'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold ${
                        blog.status === 'published'
                          ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(blog.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        disabled={busyId === blog.id}
                        onClick={() => handleTogglePublish(blog)}
                        title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                        className="text-gray-400 hover:text-gold-400 transition-colors disabled:opacity-50"
                      >
                        {blog.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link
                        to={`/admin/blogs/${blog.id}/edit`}
                        title="Edit"
                        className="text-gray-400 hover:text-gold-400 transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === blog.id}
                        onClick={() => handleDelete(blog)}
                        title="Delete"
                        className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  )
}

export default AdminBlogsList
