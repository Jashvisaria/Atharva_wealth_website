export type BlogStatus = 'draft' | 'published'

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: string | null
  author: string | null
  status: BlogStatus
  featured_image_url: string | null
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface BlogInput {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  status: BlogStatus
  featured_image_url: string | null
  seo_title: string
  seo_description: string
  published_at: string | null
}
