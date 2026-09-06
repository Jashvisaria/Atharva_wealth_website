import { useState, useEffect } from 'react'
import { getPublishedBlogs } from '../lib/blogs'

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getPublishedBlogs()
        setBlogs(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    })()
  }, [])

  // Filter blogs by search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      (searchQuery === '' ||
        (blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesCategory =
      selectedCategory === '' || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(blogs.map((blog) => blog.category).filter(Boolean))]

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-amber-500">Blog</h2>
            </div>
            <div className="card-body">
              {error && <p className="text-red-500 mb-4">{error}</p>}

              {/* Search and Category Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs..."
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Blog Cards */}
              {filteredBlogs.length === 0 ? (
                <p className="text-base-content/60 mt-8">
                  No blogs match your criteria. Try adjusting the search or category filter.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Featured blog card */}
                  <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="card-image">
                      <img
                        src={filteredBlogs[0]?.featured_image_url || 'https://images.unsplash.com/photo-1565514020176-db71f6772b7d?w=800&q=80'}
                        alt={filteredBlogs[0]?.title || 'Featured blog image'}
                        className="object-cover h-48 w-full"
                      />
                    </div>
                    <div className="card-body items-center text-center">
                      <h3 className="card-title text-xl">
                        {filteredBlogs[0]?.title || 'No blogs yet'}
                      </h3>
                      <p className="text-base-content/70 mt-4">
                        {filteredBlogs[0]?.excerpt || 'No excerpt available.'}
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
                        <span className="text-sm text-base-content/60">
                          Category: {filteredBlogs[0]?.category || 'Investment'}
                        </span>
                        <span className="text-sm text-base-content/60">
                          {filteredBlogs[0]?.published_at
                            ? new Date(filteredBlogs[0].published_at).toLocaleDateString()
                            : '—'}
                        </span>
                      </div>
                      <a
                        href={`/blog/${filteredBlogs[0]?.slug}`}
                        className="btn btn-primary mt-4"
                        >Read More
                      </a>
                    </div>
                  </div>

                  {/* Remaining blogs grid */}
                  {filteredBlogs.slice(1).map((blog: any) => (
                    <div
                      key={blog.id}
                      className="glass-card p-6 rounded-xl hover:border-amber-500/50 transition-border"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={blog.featured_image_url || 'https://images.unsplash.com/photo-1565514020176-db71f6772b7d?w=400&q=80'}
                            alt={blog.title}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-medium mb-2">
                            <a href={`/blog/${blog.slug}`} className="text-primary">
                              {blog.title}
                            </a>
                          </h4>
                          <p className="text-base-content/70 text-sm mb-2">
                            {blog.excerpt || 'No excerpt available.'}
                          </p>
                          <div className="text-xs text-base-content/60">
                            Category: {blog.category || 'Investment'} · {
                              blog.published_at
                                ? new Date(blog.published_at).toLocaleDateString()
                                : '—'}
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}