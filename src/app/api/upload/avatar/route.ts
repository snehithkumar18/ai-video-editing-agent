import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadBuffer, generateKey } from '@/lib/services/storageService';

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

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/quicktime'];
    const isImage = validImageTypes.includes(file.type);
    const isVideo = validVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
    }

    if (isImage && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image size must be under 10MB' }, { status: 400 });
    }

    if (isVideo && file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Video size must be under 100MB' }, { status: 400 });
    }

    const fileType = isImage ? 'image' : 'video';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = generateKey('avatar-uploads', `${user.id}/originals`, file.name);
    const storageUrl = await uploadBuffer(buffer, key, file.type);

    return NextResponse.json({ 
      success: true, 
      data: { 
        storageUrl, 
        fileType,
        filename: file.name 
      } 
    });
  } catch (error) {
    console.error('Avatar Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
