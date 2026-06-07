import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: avatarProfiles, error } = await supabase
      .from('avatar_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: avatarProfiles });
  } catch (error) {
    logger.error('List Avatars Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
