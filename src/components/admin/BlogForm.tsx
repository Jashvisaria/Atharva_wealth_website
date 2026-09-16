import { useState } from 'react'
import type { Blog, BlogInput, BlogStatus } from '../../lib/blogTypes'
import RichTextEditor from './RichTextEditor'
import ImageUploader from './ImageUploader'

const KNOWN_CATEGORIES = [
  'Markets',
  'Mutual Funds',
  'PMS & AIF',
  'Tax Planning',
  'Retirement',
  'Financial Planning',
]

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

interface BlogFormProps {
  initial?: Blog
  submitting: boolean
  errorMessage: string | null
  onSubmit: (input: BlogInput, status: BlogStatus) => void
}

function BlogForm({ initial, submitting, errorMessage, onSubmit }: BlogFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initial))
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(initial?.featured_image_url ?? null)
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(initial?.seo_description ?? '')
  const [publishedAt, setPublishedAt] = useState(initial?.published_at ? initial.published_at.slice(0, 10) : '')

  const isPublished = initial?.status === 'published'

  function buildInput(status: BlogStatus): BlogInput {
    const resolvedPublishedAt =
      status === 'published' ? publishedAt || new Date().toISOString().slice(0, 10) : publishedAt || null

    return {
      title: title.trim(),
      slug: (slug.trim() || slugify(title)).trim(),
      excerpt: excerpt.trim(),
      content,
      category: category.trim(),
      author: author.trim(),
      status,
      featured_image_url: featuredImageUrl,
      seo_title: seoTitle.trim(),
      seo_description: seoDescription.trim(),
      published_at: resolvedPublishedAt,
    }
  }

  function handleSubmit(status: BlogStatus) {
    onSubmit(buildInput(status), status)
  }

  const inputClass =
    'w-full rounded-lg bg-white/5 border px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/60 transition-colors'
  const inputStyle = { borderColor: 'rgba(197, 160, 89, 0.2)' }
  const labelClass = 'block text-sm text-gray-400 mb-1.5 tracking-wide'

  return (
    <form className="space-y-8">
      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3">
          {errorMessage}
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div>
          <label className={labelClass}>Title</label>
          <input
            className={inputClass}
            style={inputStyle}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!slugTouched) setSlug(slugify(e.target.value))
            }}
            placeholder="Article title"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Slug</label>
          <input
            className={`${inputClass} font-mono text-sm`}
            style={inputStyle}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            placeholder="article-title"
            required
          />
          <p className="text-xs text-gray-500 mt-1">/blog/{slug || 'article-title'}</p>
        </div>

        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea
            className={inputClass}
            style={inputStyle}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Short summary shown on the blog listing"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Category</label>
            <input
              className={inputClass}
              style={inputStyle}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Markets"
              list="category-options"
            />
            <datalist id="category-options">
              {KNOWN_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input
              className={inputClass}
              style={inputStyle}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Published Date</label>
          <input
            type="date"
            className={inputClass}
            style={inputStyle}
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <label className={labelClass}>Featured Image</label>
        <ImageUploader value={featuredImageUrl} onChange={setFeaturedImageUrl} />
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <label className={labelClass}>Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <p className="text-sm text-gold-400 tracking-wide uppercase">SEO</p>
        <div>
          <label className={labelClass}>SEO Title</label>
          <input
            className={inputClass}
            style={inputStyle}
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Defaults to article title if left blank"
          />
        </div>
        <div>
          <label className={labelClass}>SEO Description</label>
          <textarea
            className={inputClass}
            style={inputStyle}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            placeholder="Defaults to excerpt if left blank"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {isPublished ? (
          <>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('published')}
              className="btn btn-gold px-6 py-2.5 text-xs disabled:opacity-50"
            >
              Save Changes
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('draft')}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              Unpublish
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('draft')}
              className="btn btn-ghost-gold px-6 py-2.5 text-xs disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('published')}
              className="btn btn-gold px-6 py-2.5 text-xs disabled:opacity-50"
            >
              Publish
            </button>
          </>
        )}
      </div>
    </form>
  )
}

export default BlogForm
