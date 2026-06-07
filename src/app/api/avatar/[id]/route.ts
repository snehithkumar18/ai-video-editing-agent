import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteFile } from '@/lib/services/storageService';
import logger from '@/lib/logger';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: avatarProfile, error: fetchError } = await supabase
      .from('avatar_profiles')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !avatarProfile) {
      return NextResponse.json({ success: false, error: 'Avatar profile not found' }, { status: 404 });
    }

    const deleteFiles = async (urlStr: string | null) => {
      if (!urlStr) return;
      try {
        const urlObj = new URL(urlStr);
        const key = urlObj.pathname.substring(1); 
        await deleteFile(key);
      } catch (e) {
        logger.error('Failed to delete file from R2:', e);
      }
    };

    await deleteFiles(avatarProfile.source_asset_url);
    await deleteFiles(avatarProfile.processed_asset_url);
    await deleteFiles(avatarProfile.preview_image_url);

    const { error: deleteError } = await supabase
      .from('avatar_profiles')
      .delete()
      .eq('id', params.id);

    if (deleteError) throw deleteError;

    if (avatarProfile.is_default) {
      const { data: remainingAvatars } = await supabase
        .from('avatar_profiles')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (remainingAvatars && remainingAvatars.length > 0) {
        await supabase
          .from('avatar_profiles')
          .update({ is_default: true })
          .eq('id', remainingAvatars[0].id)
          .eq('user_id', user.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Delete Avatar Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
