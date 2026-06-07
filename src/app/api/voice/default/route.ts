import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/logger';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { voiceId } = await request.json();

    if (!voiceId) {
      return NextResponse.json({ success: false, error: 'voiceId is required' }, { status: 400 });
    }

    const { data: voiceProfile, error: fetchError } = await supabase
      .from('voice_profiles')
      .select('id')
      .eq('id', voiceId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !voiceProfile) {
      return NextResponse.json({ success: false, error: 'Voice profile not found' }, { status: 404 });
    }

    await supabase
      .from('voice_profiles')
      .update({ is_default: false })
      .eq('user_id', user.id);

    await supabase
      .from('voice_profiles')
      .update({ is_default: true })
      .eq('id', voiceId);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Set Default Voice Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
