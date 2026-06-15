import { createClient } from '@/lib/supabase/admin';

const supabase = createClient();
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'ai-video-assets';

export async function uploadBuffer(buffer: Buffer, key: string, contentType: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(key, buffer, {
      contentType,
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase storage: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key);

  return publicUrl;
}

export async function uploadFromUrl(sourceUrl: string, key: string, contentType: string): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${sourceUrl}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return uploadBuffer(buffer, key, contentType);
}

export async function deleteFile(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([key]);

  if (error) {
    throw new Error(`Failed to delete from Supabase storage: ${error.message}`);
  }
}

export function generateKey(folder: string, userId: string, filename: string): string {
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${folder}/${userId}/${Date.now()}-${safeFilename}`;
}
