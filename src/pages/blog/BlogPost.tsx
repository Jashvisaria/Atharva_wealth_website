import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { fetchPublishedBlogBySlug } from '../../lib/blogsApi'
import type { Blog } from '../../lib/blogTypes'
import { estimateReadTime, formatBlogDate } from '../../lib/blogDisplay'

type LoadState = 'loading' | 'not-found' | 'error' | 'ready'

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  // Remount on slug change so state resets naturally instead of needing a
  // synchronous setState at the top of the fetch effect.
  return <BlogPostView key={slug} slug={slug} />
}

function BlogPostView({ slug }: { slug?: string }) {
  const [post, setPost] = useState<Blog | null>(null)
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    if (!slug) return
    fetchPublishedBlogBySlug(slug)
      .then((data) => {
        if (!data) {
          setState('not-found')
          return
        }
        setPost(data)
        setState('ready')
      })
      .catch(() => setState('error'))
  }, [slug])

  useEffect(() => {
    if (!post) return
    document.title = post.seo_title || post.title
    const description = post.seo_description || post.excerpt || ''
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }, [post])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading article...</p>
      </div>
    )
  }

  if (state === 'not-found' || state === 'error') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            {state === 'not-found' ? 'This article could not be found.' : 'Something went wrong loading this article.'}
          </p>
          <Link to="/blog" className="text-gold-500 text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  if (!post) return null

  const author = post.author || 'Atharva Wealth'
  const initials = author
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className="min-h-screen bg-obsidian">
      <header className="relative grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-obsidian to-obsidian pointer-events-none" />
        <div className="relative z-10 border-b" style={{ borderColor: 'rgba(197, 160, 89, 0.1)' }}>
          <div className="container mx-auto px-6 py-5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                <span className="text-obsidian text-sm font-bold">AW</span>
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                ATHARVA <span className="text-gold-500">WEALTH</span>
              </span>
            </Link>
            <Link to="/blog" className="text-sm text-gray-400 hover:text-gold-500 transition-colors uppercase tracking-wider inline-flex items-center gap-2">
              <ArrowLeft size={14} />
              Back to Blog
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 md:py-16 max-w-3xl">
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-obsidian border border-gold-500/30 text-gold-400 mb-6">
            {post.category}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
            <span className="text-obsidian text-xs font-bold">{initials}</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">{author}</p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Calendar size={12} />
              {formatBlogDate(post.published_at)}
              <span className="mx-1">&middot;</span>
              {estimateReadTime(post.content)}
            </p>
          </div>
        </div>

        {post.featured_image_url && (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full rounded-2xl mb-10 border"
            style={{ borderColor: 'rgba(197, 160, 89, 0.15)' }}
          />
        )}

        <div className="rich-content" dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
      </main>
    </div>
  )
}

export default BlogPost
