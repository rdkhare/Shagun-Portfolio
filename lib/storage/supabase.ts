import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Upload file to Supabase Storage
export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('articles') // bucket name
    .upload(path, file)

  if (error) {
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('articles')
    .getPublicUrl(path)

  return {
    path: data.path,
    url: publicUrl
  }
}

// Delete file from Supabase Storage
export async function deleteFile(path: string) {
  const { error } = await supabase.storage
    .from('articles')
    .remove([path])

  if (error) {
    throw error
  }
}
