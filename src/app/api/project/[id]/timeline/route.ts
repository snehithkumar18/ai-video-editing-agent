import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TimelineJSON } from '@/lib/types/timeline';
import logger from '@/lib/logger';
import { z } from 'zod';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // Accept either { timeline } or raw timeline payload
    const incomingTimeline = (body && body.timeline) ? body.timeline : body;

    const timelineSchema = z.object({
      version: z.union([z.string(), z.number()]).optional(),
      duration: z.number(),
      tracks: z.array(z.any()),
    });

    const parsed = timelineSchema.safeParse(incomingTimeline);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid timeline JSON format', details: parsed.error.flatten() }, { status: 400 });
    }

    const timeline = parsed.data as TimelineJSON;

    const { error } = await supabase
      .from('projects')
      .update({ 
        timeline_json: timeline as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { savedAt: new Date().toISOString() } });
  } catch (error) {
    logger.error('Save Timeline Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
