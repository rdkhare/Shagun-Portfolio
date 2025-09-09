import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
}

// Client for public operations (reading)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Service role client for server operations (bypasses RLS)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This should be in your .env.local
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Upload file to Supabase Storage (uses service role to bypass RLS)
export async function uploadFile(file: File, path: string) {
  const bucket = 'uploads'
  
  // Use admin client to bypass RLS for uploads
  const client = supabaseAdmin.storage.from(bucket)
  
  const { data, error } = await client.upload(path, file)

  if (error) {
    throw error
  }

  // Get public URL using regular client
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return {
    path: data.path,
    url: publicUrl
  }
}

// Delete file from Supabase Storage (uses service role)
export async function deleteFile(path: string) {
  const bucket = 'uploads'
  
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([path])

  if (error) {
    throw error
  }
}
