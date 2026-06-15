import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processAIEditPrompt } from '@/lib/services/aiEditService';
import { z } from 'zod';
import logger from '@/lib/logger';

// Rate limit: 30 AI edits per hour per user
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
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 h'),
      analytics: true,
    });
  }
  return ratelimitInstance;
}

export async function POST(
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

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Project not found or access denied' }, { status: 404 });
    }

    const bodySchema = z.object({
      prompt: z.string().trim().min(1, 'Prompt is required').max(500, 'Prompt must be 500 characters or less'),
      timelineSummary: z.string().min(1, 'Timeline summary is required'),
    });

    const body = await request.json();
    const parsedBody = bodySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { prompt, timelineSummary } = parsedBody.data;

    // Check rate limit
    try {
      const limitInstance = await getRatelimit();
      const { success } = await limitInstance.limit(`ai_edit_${user.id}`);
      if (!success) {
        return NextResponse.json({ 
          success: false, 
          error: 'Rate limit exceeded. You can perform up to 30 AI edits per hour.' 
        }, { status: 429 });
      }
    } catch (e) {
      logger.warn('Ratelimit check skipped/failed', e);
    }

    // Call service
    const pexelsApiKey = process.env.PEXELS_API_KEY || '';
    const aiEditResponse = await processAIEditPrompt(prompt, timelineSummary, pexelsApiKey);

    return NextResponse.json({ success: true, data: aiEditResponse });

  } catch (error) {
    logger.error('AI Edit API Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Could not process your request. Please try again.' 
    }, { status: 500 });
  }
}
