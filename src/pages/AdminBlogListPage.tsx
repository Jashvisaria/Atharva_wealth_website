import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function AdminBlogListPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setBlogs(data as any)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
        navigate('/admin/login')
      }
    })()
  }, [navigate])

  if (loading) return <div className="py-20">Loading blogs...</div>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-amber-500">
                Blogs Management
              </h2>
            </div>
            <div className="card-body">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              {blogs.length === 0 ? (
                <p className="text-base-content/60 mt-8">No blogs found. Create your first blog.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Title</th>
                        <th className="text-left">Slug</th>
                        <th className="text-left">Category</th>
                        <th className="text-left">Author</th>
                        <th className="text-left">Status</th>
                        <th className="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog: any) => (
                        <tr key={blog.id} className="border-b">
                          <td>
                            <a href={`/blog/${blog.slug}`} className="text-primary">
                              {blog.title}
                            </a>
                          </td>
                          <td className="text-sm text-base-content/60">{blog.slug}</td>
                          <td>{blog.category || '-'}</td>
                          <td>{blog.author || '-'}</td>
                          <td>
                            {blog.status === 'published' ? (
                              <span className="text-green-500">Published</span>
                            ) : (
                              <span className="text-yellow-500">Draft</span>
                            )}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <a
                                href={`/admin/blogs/${blog.id}/edit`}
                                className="text-primary hover:text-amber-600 text-sm"
                                >Edit
                              </a>
                              <button
                                className="text-red-500 hover:text-red-400 text-sm"
                                onClick={() => {
                                  if (window.confirm('Delete this blog?'))
                                    supabase.from('blogs').delete().eq('id', blog.id)
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6">
                <a href="/admin/blogs/new" className="btn btn-primary">
                  Create New Blog
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}