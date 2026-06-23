import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@/lib/supabase/admin';
import logger from '@/lib/logger';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass RLS for status reads
    // (RLS can sometimes fail in API route context due to cookie handling)
    // We still verify ownership via user_id check
    const adminSupabase = createAdminClient();
    const { data: project, error } = await adminSupabase
      .from('projects')
      .select('status, render_progress, final_video_url, metadata, user_id')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Verify ownership manually since we bypassed RLS
    if (project.user_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const metadata = project.metadata as { error?: string } | null;

    return NextResponse.json({ 
      success: true, 
      data: { 
        status: project.status, 
        render_progress: project.render_progress, 
        error_message: metadata?.error || null,
        final_video_url: project.final_video_url 
      } 
    });
  } catch (error) {
    logger.error('Video Status Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
