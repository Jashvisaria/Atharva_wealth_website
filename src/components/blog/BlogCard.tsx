import { Link } from 'react-router-dom'
import { ArrowRight, Calendar } from 'lucide-react'
import type { Blog } from '../../lib/blogTypes'
import { getCategoryStyle } from './categoryStyles'
import { estimateReadTime, formatBlogDate } from '../../lib/blogDisplay'

interface BlogCardProps {
  post: Blog
}

function BlogCard({ post }: BlogCardProps) {
  const { icon: Icon, gradient } = getCategoryStyle(post.category)
  const author = post.author || 'Atharva Wealth'
  const initials = author
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <article className="glass-card rounded-2xl overflow-hidden flex flex-col group">
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="grid-pattern absolute inset-0" />
            <Icon
              className="text-gold-500/30 group-hover:text-gold-500/50 transition-colors duration-500"
              size={72}
              strokeWidth={1}
            />
          </>
        )}
        {post.category && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-obsidian/80 border border-gold-500/30 text-gold-400">
            {post.category}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-bold text-white leading-snug mb-3 group-hover:text-gold-500 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
          {post.excerpt}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
              <span className="text-obsidian text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{author}</p>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Calendar size={12} />
                {formatBlogDate(post.published_at)}
                <span className="mx-1">&middot;</span>
                {estimateReadTime(post.content)}
              </p>
            </div>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-gold-500 text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all duration-300"
          >
            Read Article
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
