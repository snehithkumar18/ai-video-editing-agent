import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { PLAN_LIMITS } from '@/lib/utils/constants';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import logger from '@/lib/logger';

// Rate limit: 3 voice profile creations per day per user
const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  }),
  limiter: Ratelimit.slidingWindow(3, '1 d'),
  analytics: true,
});

const createVoiceSchema = z.object({
  storageUrl: z.string().url(),
  voiceName: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    try {
      const { success } = await ratelimit.limit(`voice_create_${user.id}`);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded. You can create up to 3 voice profiles per day.' }, { status: 429 });
      }
    } catch (e) {
      logger.warn('Ratelimit check skipped/failed', e);
    }

    const body = await request.json();
    const validatedData = createVoiceSchema.parse(body);

    const { data: userData } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    const userPlan = (userData?.plan || 'free') as keyof typeof PLAN_LIMITS;
    const maxVoices = PLAN_LIMITS[userPlan].max_voice_profiles;

    const { count: voicesCount } = await supabase
      .from('voice_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (voicesCount !== null && voicesCount >= maxVoices) {
      return NextResponse.json({ 
        success: false, 
        error: `Upgrade to add more voice profiles. Limit is ${maxVoices} on ${userPlan} plan.` 
      }, { status: 403 });
    }

    const isFirstVoice = voicesCount === 0;

    const { data: newVoiceProfile, error } = await supabase
      .from('voice_profiles')
      .insert({
        user_id: user.id,
        name: validatedData.voiceName,
        description: validatedData.description,
        provider: 'kokoro',
        sample_url: validatedData.storageUrl,
        is_default: isFirstVoice,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: newVoiceProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    logger.error('Create Voice Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
