import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'
import RichTextEditor from '../components/RichTextEditor'

export default function AdminBlogEditPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category: '',
    author: 'Atharva Wealth',
    status: 'draft',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  // Fetch existing blog if editing
  useEffect(() => {
    if (id) {
      ;(async () => {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()

        if (data) {
          setBlog({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content || '',
            featured_image_url: data.featured_image_url || '',
            category: data.category || '',
            author: data.author || 'Atharva Wealth',
            status: data.status,
          })
        }
      })()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (id) {
        const { data, error } = await supabase
          .from('blogs')
          .update(blog)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .insert([blog])
          .select()
          .single()

        if (error) throw error
      }
      navigate('/admin/blogs')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>{error}</p>
        <button onClick={() => setError('')} className="btn btn-primary">Close</button>
      </div>
    )
  }

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-amber-500">
                {id ? 'Edit Blog' : 'New Blog'}
              </h2>
            </div>
            <div className="card-body">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={blog.title}
                    onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={blog.slug}
                    onChange={(e) => setBlog({ ...blog, slug: e.target.value })}
                    required
                    className="input input-bordered w-full"
                  />
                  <small className="text-xs text-base-content/60">
                    Auto-generated from title, but editable
                  </small>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <textarea
                    value={blog.excerpt}
                    onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
                    rows={3}
                    className="input input-bordered w-full"
                  /></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={blog.category}
                    onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={blog.author}
                    onChange={(e) => setBlog({ ...blog, author: e.target.value })}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={blog.status === 'draft'}
                        onChange={(e) => setBlog({ ...blog, status: 'draft' })}
                        className="checkbox"
                      />
                      Draft
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={blog.status === 'published'}
                        onChange={(e) => setBlog({ ...blog, status: 'published' })}
                        className="checkbox"
                      />
                      Published
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                  <input
                    type="text"
                    value={blog.featured_image_url}
                    onChange={(e) => setBlog({ ...blog, featured_image_url: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <RichTextEditor
                  initialContent={blog.content}
                  onChange={(html) => setBlog({ ...blog, content: html })}
                />
                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                  {id ? 'Update' : 'Publish'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}