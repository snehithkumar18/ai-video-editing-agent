import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLATFORMS, STYLE_TEMPLATES } from '@/lib/utils/constants'
import { z } from 'zod'
import logger from '@/lib/logger'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_assets (*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    logger.error('Project GET Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const updatesSchema = z.object({
      title: z.string().trim().min(1).max(100).optional(),
      script_raw: z.string().nullable().optional(),
      script_optimized: z.string().nullable().optional(),
      platform: z.enum(PLATFORMS).optional(),
      style_template: z.enum(STYLE_TEMPLATES).optional(),
      voice_profile_id: z.string().uuid().nullable().optional(),
      avatar_profile_id: z.string().uuid().nullable().optional(),
      status: z.string().optional(),
      render_progress: z.number().int().min(0).max(100).optional(),
      timeline_json: z.unknown().optional(),
    }).strict()

    const body = await request.json()
    const parsedUpdates = updatesSchema.safeParse(body)

    if (!parsedUpdates.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: parsedUpdates.error.flatten() },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(parsedUpdates.data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    logger.error('Project PATCH Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Project DELETE Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
