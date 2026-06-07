import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import logger from '@/lib/logger';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const bodySchema = z.object({
      avatarId: z.string().uuid('avatarId is required'),
    });

    const body = await request.json();
    const parsedBody = bodySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { avatarId } = parsedBody.data;

    const { data: avatarProfile, error: fetchError } = await supabase
      .from('avatar_profiles')
      .select('id')
      .eq('id', avatarId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !avatarProfile) {
      return NextResponse.json({ success: false, error: 'Avatar profile not found' }, { status: 404 });
    }

    await supabase
      .from('avatar_profiles')
      .update({ is_default: false })
      .eq('user_id', user.id);

    await supabase
      .from('avatar_profiles')
      .update({ is_default: true })
      .eq('id', avatarId)
      .eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Set Default Avatar Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
