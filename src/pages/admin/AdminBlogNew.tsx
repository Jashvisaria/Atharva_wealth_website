import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminShell from '../../components/admin/AdminShell'
import BlogForm from '../../components/admin/BlogForm'
import { createBlog, friendlySlugConflictMessage } from '../../lib/blogsApi'
import type { BlogInput } from '../../lib/blogTypes'

function AdminBlogNew() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(input: BlogInput) {
    setSubmitting(true)
    setError(null)
    try {
      await createBlog(input)
      navigate('/admin/blogs', { replace: true })
    } catch (err) {
      setError(friendlySlugConflictMessage(err) ?? (err instanceof Error ? err.message : 'Failed to create post.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-black tracking-tight text-white mb-8">New Blog Post</h1>
      <BlogForm submitting={submitting} errorMessage={error} onSubmit={handleSubmit} />
    </AdminShell>
  )
}

export default AdminBlogNew
