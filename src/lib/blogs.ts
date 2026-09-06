import { supabase } from './supabaseClient'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string | null
  category: string
  author: string
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
  seo_title: string | null
  seo_description: string | null
}

export async function getPublishedBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data as BlogPost[]
}

export async function getBlogBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function createBlog(blog: {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string | null
  category: string
  author: string
  status: 'draft' | 'published'
  seo_title?: string
  seo_description?: string
}) {
  const { data, error } = await supabase
    .from('blogs')
    .insert([blog])
    .select()
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function updateBlog(
  id: string,
  updates: Partial<{
    title: string
    slug: string
    excerpt: string
    content: string
    featured_image_url: string | null
    category: string
    author: string
    status: 'draft' | 'published'
    published_at: string | null
    seo_title?: string
    seo_description?: string
  })
) {
  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function deleteBlog(id: string) {
  const { error } = await supabase.from('blogs').delete().eq('id', id)

  if (error) throw error
}