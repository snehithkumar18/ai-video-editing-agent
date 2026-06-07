import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { videoQueue } from '@/lib/queue/videoQueue';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Note: Ensure UPSTASH_REDIS_REST_URL and TOKEN are set correctly
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Create a new ratelimiter, that allows 5 requests per hour
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
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
      const { success } = await ratelimit.limit(`render_${user.id}`);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
    } catch (e) {
      console.warn("Ratelimit check skipped/failed", e);
    }

    const { projectId, quality = '1080p', format = 'mp4', aspectRatio = '9:16' } = await request.json();

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

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

    // 2. Check credits
    const { data: userData } = await supabase
      .from('users')
      .select('render_credits, plan')
      .eq('id', user.id)
      .single();

    const currentCredits = userData?.render_credits || 0;
    
    // Determine credit cost based on quality
    let cost = 1;
    if (quality === '1080p') cost = 2;
    if (quality === '4K') cost = 4;

    if (userData?.plan !== 'agency' && currentCredits < cost) {
      return NextResponse.json({ 
        success: false, 
        error: `Not enough credits. You need ${cost} credits to export in ${quality}.` 
      }, { status: 403 });
    }

    // 3. Deduct credits
    if (userData?.plan !== 'agency') {
      await supabase
        .from('users')
        .update({ render_credits: currentCredits - cost })
        .eq('id', user.id);
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
    console.error('Render Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
