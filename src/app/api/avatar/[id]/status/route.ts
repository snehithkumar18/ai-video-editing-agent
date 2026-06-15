import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/logger';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: avatarProfile, error } = await supabase
      .from('avatar_profiles')
      .select('status, preview_image_url, processed_asset_url')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !avatarProfile) {
      return NextResponse.json({ success: false, error: 'Avatar profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: avatarProfile });
  } catch (error) {
    logger.error('Avatar Status Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
