-- Supabase Storage: blog-images bucket policies
-- NOTE: The blog-images bucket must first be created via the Supabase Dashboard
-- (Storage > New bucket > name: blog-images > Public: ON for read access)
--
-- After creating the bucket, run these policies via the Dashboard SQL editor
-- or the Supabase management API.

-- 1. Allow public read access to blog images
-- This enables published blog featured images to be read anonymously
CREATE POLICY "public_read_blog_images" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- 2. Allow admin users to upload blog images
-- Only authenticated users who are admins can upload images
CREATE POLICY "admin_upload_blog_images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- 3. Allow admin users to update blog images
CREATE POLICY "admin_update_blog_images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- 4. Allow admin users to delete blog images
CREATE POLICY "admin_delete_blog_images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );