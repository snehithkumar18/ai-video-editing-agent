import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSpeech } from '@/lib/services/voiceService';
import { uploadBuffer, generateKey } from '@/lib/services/storageService';
import { VoiceProfile } from '@/lib/types';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { voiceId, text = "This is a preview of my voice. I hope you like it!" } = await request.json();

    const { data: voiceProfile, error: fetchError } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('id', voiceId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !voiceProfile) {
      return NextResponse.json({ success: false, error: 'Voice profile not found' }, { status: 404 });
    }

    const { audioBuffer } = await generateSpeech(text, voiceProfile as VoiceProfile);

    const key = generateKey('voice-previews', user.id, `${voiceId}-preview.mp3`);
    const previewUrl = await uploadBuffer(audioBuffer, key, 'audio/mpeg');

    await supabase
      .from('voice_profiles')
      .update({ preview_url: previewUrl })
      .eq('id', voiceId);

    return NextResponse.json({ success: true, data: { previewUrl } });
  } catch (error) {
    logger.error('Preview Voice Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
