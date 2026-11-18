import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/logger';

export const DEFAULT_NATURAL_VOICES = [
  {
    id: 'default-male-adam',
    user_id: 'system',
    name: 'Adam (Natural Male)',
    description: 'Crisp, confident studio male voice',
    provider: 'kokoro',
    provider_voice_id: 'am_adam',
    sample_url: 'am_adam',
    preview_url: null,
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'default-female-bella',
    user_id: 'system',
    name: 'Bella (Natural Female)',
    description: 'Warm, conversational studio female voice',
    provider: 'kokoro',
    provider_voice_id: 'af_bella',
    sample_url: 'af_bella',
    preview_url: null,
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: true, data: DEFAULT_NATURAL_VOICES });
    }

    const { data: voiceProfiles, error } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('Error fetching voice profiles, returning defaults', error);
      return NextResponse.json({ success: true, data: DEFAULT_NATURAL_VOICES });
    }

    const list = Array.isArray(voiceProfiles) ? voiceProfiles : [];
    // Combine custom uploaded voices with the 2 studio defaults
    const combined = [...list, ...DEFAULT_NATURAL_VOICES];

    return NextResponse.json({ success: true, data: combined });
  } catch (error) {
    logger.error('List Voices Error:', error);
    return NextResponse.json({ success: true, data: DEFAULT_NATURAL_VOICES });
  }
}
