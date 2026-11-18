import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProjectSchema } from '@/lib/utils/validators'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { presenter_mode, talking_video_url, metadata = {}, ...projectFields } = validatedData.data

    const mergedMetadata = {
      ...(metadata || {}),
      ...(presenter_mode ? { presenter_mode } : {}),
      ...(talking_video_url ? { talking_video_url } : {}),
    }

    const { data: newProject, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        status: 'draft',
        ...projectFields,
        metadata: mergedMetadata,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: newProject })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
