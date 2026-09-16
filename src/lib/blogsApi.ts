import { supabase } from './supabaseClient'
import type { Blog, BlogInput } from './blogTypes'

const BLOG_COLUMNS =
  'id,title,slug,excerpt,content,category,author,status,featured_image_url,seo_title,seo_description,published_at,created_at,updated_at'

// Public: only ever reads posts with status = 'published'. RLS on the
// `blogs` table already restricts anonymous SELECT to published rows; this
// filter is kept as an explicit belt-and-suspenders guard.
export async function fetchPublishedBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Blog[]
}

export async function fetchPublishedBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_COLUMNS)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return (data ?? null) as Blog | null
}

// Admin: relies on RLS (via is_admin()) to allow reading every row,
// regardless of status, only for an authenticated admin session.
export async function fetchAllBlogsAdmin(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_COLUMNS)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Blog[]
}

export async function fetchBlogByIdAdmin(id: string): Promise<Blog> {
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_COLUMNS)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Blog
}

const SLUG_TAKEN_MESSAGE = 'That slug is already in use by another post. Please choose a different slug.'

// Proactive check so the admin gets a clear message before saving, rather
// than only finding out from a raw Postgres error after the fact (which
// also only works if a unique constraint happens to exist on the column).
async function assertSlugAvailable(slug: string, excludeId?: string): Promise<void> {
  let query = supabase.from('blogs').select('id').eq('slug', slug)
  if (excludeId) query = query.neq('id', excludeId)
  const { data, error } = await query.limit(1)
  if (error) throw error
  if (data && data.length > 0) throw new Error(SLUG_TAKEN_MESSAGE)
}

const STORAGE_BUCKET = 'blog-images'

function extractStoragePath(publicUrl: string): string | null {
  const marker = `/${STORAGE_BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}

export async function createBlog(input: BlogInput): Promise<Blog> {
  await assertSlugAvailable(input.slug)

  const { data, error } = await supabase
    .from('blogs')
    .insert(input)
    .select(BLOG_COLUMNS)
    .single()

  if (error) throw error
  return data as Blog
}

export async function updateBlog(id: string, input: Partial<BlogInput>): Promise<Blog> {
  if (input.slug) {
    await assertSlugAvailable(input.slug, id)
  }

  const { data, error } = await supabase
    .from('blogs')
    .update(input)
    .eq('id', id)
    .select(BLOG_COLUMNS)
    .single()

  if (error) throw error
  return data as Blog
}

export async function deleteBlog(id: string): Promise<void> {
  const { data: existing } = await supabase.from('blogs').select('featured_image_url').eq('id', id).maybeSingle()

  const { error } = await supabase.from('blogs').delete().eq('id', id)
  if (error) throw error

  const imageUrl = existing?.featured_image_url
  if (!imageUrl) return

  const path = extractStoragePath(imageUrl)
  if (!path) return

  try {
    // Only remove the object if no other post still references the exact
    // same URL, so cleanup never touches an unrelated post's image.
    const { data: stillReferenced } = await supabase
      .from('blogs')
      .select('id')
      .eq('featured_image_url', imageUrl)
      .limit(1)

    if (!stillReferenced || stillReferenced.length === 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove([path])
    }
  } catch {
    // Best-effort cleanup: the post row is already gone, which is the
    // primary user-visible action, so a storage hiccup here isn't fatal.
  }
}

export function friendlySlugConflictMessage(error: unknown): string | null {
  const message = (error as { message?: string } | null)?.message ?? ''
  if (message.includes('duplicate key') || message.includes('already exists')) {
    return 'That slug is already in use by another post. Please choose a different slug.'
  }
  return null
}
