import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadBuffer, generateKey } from '@/lib/services/storageService';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/webm'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 25MB' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = generateKey('voice-samples', user.id, file.name);
    const storageUrl = await uploadBuffer(buffer, key, file.type);

    return NextResponse.json({ 
      success: true, 
      data: { 
        storageUrl, 
        filename: file.name, 
        fileType: file.type 
      } 
    });
  } catch (error) {
    logger.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
