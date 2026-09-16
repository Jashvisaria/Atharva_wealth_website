import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminShell from '../../components/admin/AdminShell'
import BlogForm from '../../components/admin/BlogForm'
import { fetchBlogByIdAdmin, friendlySlugConflictMessage, updateBlog } from '../../lib/blogsApi'
import type { Blog, BlogInput } from '../../lib/blogTypes'

function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchBlogByIdAdmin(id)
      .then(setBlog)
      .catch((err) => setLoadError(err instanceof Error ? err.message : 'Failed to load post.'))
  }, [id])

  async function handleSubmit(input: BlogInput) {
    if (!id) return
    setSubmitting(true)
    setError(null)
    try {
      await updateBlog(id, input)
      navigate('/admin/blogs', { replace: true })
    } catch (err) {
      setError(friendlySlugConflictMessage(err) ?? (err instanceof Error ? err.message : 'Failed to update post.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-black tracking-tight text-white mb-8">Edit Blog Post</h1>
      {loadError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3">
          {loadError}
        </div>
      ) : !blog ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <BlogForm initial={blog} submitting={submitting} errorMessage={error} onSubmit={handleSubmit} />
      )}
    </AdminShell>
  )
}

export default AdminBlogEdit
