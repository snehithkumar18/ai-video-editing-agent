import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import logger from '@/lib/logger'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        voice_profiles (*),
        avatar_profiles (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    logger.error('Projects GET Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
