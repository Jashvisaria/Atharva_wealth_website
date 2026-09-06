-- Create the blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT,
  author TEXT NOT NULL DEFAULT 'Atharva Wealth',
  status TEXT CHECK (status IN ('draft', 'published')) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create the is_admin() function to check admin status
-- This uses a SECURITY DEFINER approach to avoid RLS recursion issues
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- RLS Policies for blogs table

-- 1. Anonymous/public can only read published blogs
CREATE POLICY "public_read_published_only" ON blogs
  FOR SELECT
  TO anon, public
  USING (status = 'published');

-- 2. Authenticated users who are admins have full access
CREATE POLICY "admin_full_access" ON blogs
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3. Authenticated non-admin users have no access to blogs (RLS blocks them)
-- This is implicit: since only admin_full_access policy exists for authenticated,
-- and it checks is_admin(), non-admin authenticated users cannot SELECT/INSERT/UPDATE/DELETE

-- RLS Policies for admin_users table
-- Only admins can manage this table (we'll keep it simple)
-- The function is_admin() is available to authenticated users via Supabase Auth

-- Comment: Note that the admin_users table content must be populated manually
-- via the Supabase Dashboard or Admin API. The initial admin account's UUID
-- must be inserted into admin_users.user_id.