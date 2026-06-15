import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { videoQueue } from '@/lib/queue/videoQueue';
import { z } from 'zod';
import logger from '@/lib/logger';

// Create a new ratelimiter, that allows 5 requests per hour
let ratelimitInstance: any = null;
async function getRatelimit() {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return {
      limit: async () => ({ success: true })
    };
  }

  if (!ratelimitInstance) {
    const limitPkg = '@upstash/ratelimit';
    const redisPkg = '@upstash/redis';
    const { Ratelimit } = eval('require')(limitPkg);
    const { Redis } = eval('require')(redisPkg);
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
    ratelimitInstance = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
    });
  }
  return ratelimitInstance;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    try {
      const limitInstance = await getRatelimit();
      const { success } = await limitInstance.limit(`render_${user.id}`);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
    } catch (e) {
      logger.warn('Ratelimit check skipped/failed', e);
    }

    const bodySchema = z.object({
      projectId: z.string().min(1, 'projectId is required'),
      quality: z.enum(['720p', '1080p', '4K']).default('1080p'),
      format: z.enum(['mp4', 'webm']).default('mp4'),
      aspectRatio: z.enum(['9:16', '16:9', '1:1']).default('9:16'),
    });

    const body = await request.json();
    const parsedBody = bodySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { projectId, quality, format, aspectRatio } = parsedBody.data;

    // 1. Get project and verify ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // 2. Determine credit cost based on quality
    let cost = 1;
    if (quality === '1080p') cost = 2;
    if (quality === '4K') cost = 4;

    // 3. Atomically check and deduct credits (prevents race conditions)
    const { data: userData } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (userData?.plan !== 'agency') {
      const { data: deductResult, error: deductError } = await supabase
        .rpc('deduct_render_credits', { p_user_id: user.id, p_cost: cost });

      if (deductError || !deductResult) {
        return NextResponse.json({
          success: false,
          error: `Not enough credits. You need ${cost} credits to export in ${quality}.`
        }, { status: 403 });
      }
    }

    // Update project status
    await supabase
      .from('projects')
      .update({ status: 'generating', render_progress: 0 })
      .eq('id', projectId);

    // 4. Add EXPORT_VIDEO job to queue
    await videoQueue.add('EXPORT_VIDEO', {
      projectId,
      quality,
      format,
      aspectRatio,
      watermark: userData?.plan === 'free'
    });

    return NextResponse.json({ success: true, data: { message: 'Export started', projectId } });
  } catch (error) {
    logger.error('Render Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
