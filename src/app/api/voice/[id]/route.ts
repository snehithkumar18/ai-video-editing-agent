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

    const { data: voiceProfile, error: fetchError } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !voiceProfile) {
      return NextResponse.json({ success: false, error: 'Voice profile not found' }, { status: 404 });
    }

    if (voiceProfile.sample_url) {
      try {
        const urlObj = new URL(voiceProfile.sample_url);
        const key = urlObj.pathname.substring(1); 
        await deleteFile(key);
      } catch (e) {
        logger.error('Failed to delete file from R2:', e);
      }
    }

    const { error: deleteError } = await supabase
      .from('voice_profiles')
      .delete()
      .eq('id', params.id);

    if (deleteError) throw deleteError;

    if (voiceProfile.is_default) {
      const { data: remainingVoices } = await supabase
        .from('voice_profiles')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (remainingVoices && remainingVoices.length > 0) {
        await supabase
          .from('voice_profiles')
          .update({ is_default: true })
          .eq('id', remainingVoices[0].id)
          .eq('user_id', user.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Delete Voice Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
