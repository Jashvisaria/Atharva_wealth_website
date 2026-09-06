import { useParams, useState, useEffect } from 'react'
import { getBlogBySlug } from '../lib/blogs'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getBlogBySlug(slug)
        setPost(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    })()
  }, [slug])

  if (loading) return <div className="py-20">Loading blog...</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!post) return <div className="py-20">Blog not found</div>

  // SEO metadata
  const seoTitle = post.seo_title || post.title
  const seoDescription = post.seo_description || post.excerpt || ''
  const canonicalUrl = `/blog/${post.slug}`

  // Update document title and meta tags on page load
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Update page title
      document.title = `${seoTitle} | Atharva Wealth`

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', seoDescription)
      } else {
        const newMeta = document.createElement('meta')
        newMeta.name = 'description'
        newMeta.content = seoDescription
        document.head.appendChild(newMeta)
      }

      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', canonicalUrl)
      } else {
        const newLink = document.createElement('link')
        newLink.rel = 'canonical'
        newLink.href = canonicalUrl
        document.head.appendChild(newLink)
      }

      // Open Graph metadata
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', seoTitle)
      } else {
        const og = document.createElement('meta')
        og.property = 'og:title'
        og.content = seoTitle
        document.head.appendChild(og)
      }

      const ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) {
        ogDesc.setAttribute('content', seoDescription)
      } else {
        const og = document.createElement('meta')
        og.property = 'og:description'
        og.content = seoDescription
        document.head.appendChild(og)
      }

      const ogImage = document.querySelector('meta[property="og:image"]')
      if (ogImage) {
        ogImage.setAttribute('content', post.featured_image_url || '')
      } else {
        const og = document.createElement('meta')
        og.property = 'og:image'
        og.content = post.featured_image_url || ''
        document.head.appendChild(og)
      }
    }
  }, [seoTitle, seoDescription, canonicalUrl, post.featured_image_url])

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-64 object-cover mb-6"
          />
          
          <div className="mb-4">
            <span className="text-amber-500 text-sm">{post.category}</span>
            <span className="text-base-content/60 mx-2">·</span>
            <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          
          <p className="text-base-content/70 mb-6" dangerouslySetInnerHTML={{ __html: post.excerpt || '' }} />
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-sm max-w-none">
            {post.content && (
              <p className="mb-4">{post.content}</p>
            )}
          </div>
          
          <div className="mt-8">
            <a href="/blog" className="btn btn-outline">Back to Blog</a>
          </div>
        </div>
      </div>
    </section>
  )
}