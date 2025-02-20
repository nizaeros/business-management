-- Storage bucket policies for Supabase Storage

-- Note: Buckets are created through Supabase Dashboard or CLI
-- This migration only sets up the security policies

-- Create storage buckets if they don't exist
DO $$
BEGIN
    -- Create public-assets bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'public-assets') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'public-assets',
            'public-assets',
            true,
            5242880,
            ARRAY['image/png', 'image/jpeg', 'image/svg+xml']
        );
    END IF;

    -- Create system-private bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'system-private') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit)
        VALUES (
            'system-private',
            'system-private',
            false,
            10485760
        );
    END IF;

    -- Create client-docs bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'client-docs') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit)
        VALUES (
            'client-docs',
            'client-docs',
            false,
            10485760
        );
    END IF;

    -- Create temp-storage bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'temp-storage') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit)
        VALUES (
            'temp-storage',
            'temp-storage',
            false,
            10485760
        );
    END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated access only" ON storage.objects;
DROP POLICY IF EXISTS "Client docs access" ON storage.objects;
DROP POLICY IF EXISTS "Temporary storage access" ON storage.objects;

-- Set up storage policies for public-assets bucket
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-assets');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets');

CREATE POLICY "Authenticated users can update own objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets' AND auth.uid() = owner);

CREATE POLICY "Authenticated users can delete own objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-assets' AND auth.uid() = owner);

-- Set up storage policies for system-private bucket
CREATE POLICY "Authenticated access only"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'system-private');

-- Set up storage policies for client-docs bucket
CREATE POLICY "Client docs access"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'client-docs');

-- Set up storage policies for temp-storage bucket
CREATE POLICY "Temporary storage access"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'temp-storage');

-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies for storage.objects

-- Public Assets Bucket (logos, public files)
create policy "Public read access for public-assets"
    on storage.objects for select
    using ( bucket_id = 'public-assets' );

create policy "Authenticated users can upload to public-assets"
    on storage.objects for insert
    with check ( 
        bucket_id = 'public-assets' 
        and auth.role() = 'authenticated'
    );

create policy "Authenticated users can update their public-assets"
    on storage.objects for update
    using ( 
        bucket_id = 'public-assets' 
        and auth.role() = 'authenticated'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- System Private Bucket (user avatars, system files)
create policy "Authenticated users can access their own files in system-private"
    on storage.objects for select
    using ( 
        bucket_id = 'system-private' 
        and auth.role() = 'authenticated'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Authenticated users can upload to their folder in system-private"
    on storage.objects for insert
    with check ( 
        bucket_id = 'system-private' 
        and auth.role() = 'authenticated'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- Client Documents Bucket
create policy "Authenticated users can access their client documents"
    on storage.objects for select
    using ( 
        bucket_id = 'client-docs' 
        and auth.role() = 'authenticated'
        and exists (
            select 1 from public.client_users
            where client_id::text = (storage.foldername(name))[1]
            and user_id = auth.uid()
        )
    );

create policy "Authenticated users can upload to their client folders"
    on storage.objects for insert
    with check ( 
        bucket_id = 'client-docs' 
        and auth.role() = 'authenticated'
        and exists (
            select 1 from public.client_users
            where client_id::text = (storage.foldername(name))[1]
            and user_id = auth.uid()
        )
    );

-- Temp Storage Bucket (24-hour access)
create policy "Authenticated users can access temp storage"
    on storage.objects for select
    using ( 
        bucket_id = 'temp-storage' 
        and auth.role() = 'authenticated'
        and (storage.foldername(name))[1] = auth.uid()::text
        and (created_at > now() - interval '24 hours')
    );

create policy "Authenticated users can upload to temp storage"
    on storage.objects for insert
    with check ( 
        bucket_id = 'temp-storage' 
        and auth.role() = 'authenticated'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- Create a function to clean up temp storage
create or replace function storage.cleanup_temp_storage()
returns void
language plpgsql
security definer
as $$
begin
    delete from storage.objects
    where bucket_id = 'temp-storage'
    and created_at < now() - interval '24 hours';
end;
$$;

-- Comments for documentation
comment on policy "Public read access for public-assets" on storage.objects is 'Allow public read access to files in public-assets bucket';
comment on policy "Authenticated users can upload to public-assets" on storage.objects is 'Allow authenticated users to upload to public-assets bucket';
comment on policy "Authenticated users can update their public-assets" on storage.objects is 'Allow users to update their own files in public-assets';
comment on policy "Authenticated users can access their own files in system-private" on storage.objects is 'Allow users to access their own files in system-private bucket';
comment on policy "Authenticated users can upload to their folder in system-private" on storage.objects is 'Allow users to upload to their own folder in system-private bucket';
comment on policy "Authenticated users can access their client documents" on storage.objects is 'Allow users to access documents of clients they are associated with';
comment on policy "Authenticated users can upload to their client folders" on storage.objects is 'Allow users to upload to folders of clients they are associated with';
comment on policy "Authenticated users can access temp storage" on storage.objects is 'Allow users to access their files in temp storage for 24 hours';
comment on policy "Authenticated users can upload to temp storage" on storage.objects is 'Allow users to upload to their folder in temp storage';
