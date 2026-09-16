export function formatBlogDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function estimateReadTime(html: string | null): string {
  const text = (html ?? '').replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}
