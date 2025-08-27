export interface UploadInput {
  filename: string;
  contentType: string;
  data: Buffer;
}

export interface UploadResult {
  url: string;
}

export async function uploadToStorage(_input: UploadInput): Promise<UploadResult> {
  void _input;
  throw new Error('Storage not configured. Install and configure Supabase client in lib/storage/upload.ts.');
} 