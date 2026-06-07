import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processAIEditPrompt } from '@/lib/services/aiEditService';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Rate limit: 30 AI edits per hour per user
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 h'),
  analytics: true,
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Project not found or access denied' }, { status: 404 });
    }

    // Parse & validate body
    const { prompt, timelineSummary } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length > 500) {
      return NextResponse.json({ success: false, error: 'Prompt must be 500 characters or less' }, { status: 400 });
    }

    if (!timelineSummary || typeof timelineSummary !== 'string') {
      return NextResponse.json({ success: false, error: 'Timeline summary is required' }, { status: 400 });
    }

    // Check rate limit
    try {
      const { success } = await ratelimit.limit(`ai_edit_${user.id}`);
      if (!success) {
        return NextResponse.json({ 
          success: false, 
          error: 'Rate limit exceeded. You can perform up to 30 AI edits per hour.' 
        }, { status: 429 });
      }
    } catch (e) {
      console.warn('Ratelimit check skipped/failed', e);
    }

    // Call service
    const pexelsApiKey = process.env.PEXELS_API_KEY || '';
    const aiEditResponse = await processAIEditPrompt(prompt, timelineSummary, pexelsApiKey);

    return NextResponse.json({ success: true, data: aiEditResponse });

  } catch (error) {
    console.error('AI Edit API Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Could not process your request. Please try again.' 
    }, { status: 500 });
  }
}
