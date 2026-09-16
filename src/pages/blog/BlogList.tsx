import { useEffect, useMemo, useState } from 'react'
import BlogHeader from '../../components/blog/BlogHeader'
import CategoryFilter from '../../components/blog/CategoryFilter'
import BlogCard from '../../components/blog/BlogCard'
import { fetchPublishedBlogs } from '../../lib/blogsApi'
import type { Blog } from '../../lib/blogTypes'

function BlogList() {
  const [posts, setPosts] = useState<Blog[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  useEffect(() => {
    fetchPublishedBlogs()
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load articles.'))
  }, [])

  const categories = useMemo(() => {
    if (!posts) return []
    return Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!posts) return []
    if (activeCategory === 'All') return posts
    return posts.filter((post) => post.category === activeCategory)
  }, [posts, activeCategory])

  return (
    <div className="min-h-screen bg-obsidian">
      <BlogHeader />

      <main className="container mx-auto px-6 py-12 md:py-16">
        {posts === null ? (
          <p className="text-gray-500 text-sm text-center">Loading articles...</p>
        ) : error ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-gray-400">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-12 text-center mt-10">
                <p className="text-gray-400">No articles in this category yet. Check back soon.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default BlogList
