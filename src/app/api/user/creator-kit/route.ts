import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import logger from '@/lib/logger';

const creatorKitSchema = z.object({
  primary_color: z.string().default('#F95738'),
  secondary_color: z.string().default('#2D3142'),
  background_style: z.enum(['warm_cream', 'dark_cyber', 'studio_white', 'minimalist_slate']).default('warm_cream'),
  caption_font: z.string().default('Plus Jakarta Sans'),
  caption_highlight_color: z.string().default('#FFE600'),
  caption_animation: z.enum(['pop', 'bounce', 'fade']).default('pop'),
  music_genre: z.enum(['chill_lofi', 'tech_phonk', 'ambient_minimal']).default('chill_lofi'),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('creator_kit')
      .eq('id', user.id)
      .single();

    if (error || !userData) {
      return NextResponse.json({
        success: true,
        data: {
          primary_color: '#F95738',
          secondary_color: '#2D3142',
          background_style: 'warm_cream',
          caption_font: 'Plus Jakarta Sans',
          caption_highlight_color: '#FFE600',
          caption_animation: 'pop',
          music_genre: 'chill_lofi',
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: userData.creator_kit || {
        primary_color: '#F95738',
        secondary_color: '#2D3142',
        background_style: 'warm_cream',
        caption_font: 'Plus Jakarta Sans',
        caption_highlight_color: '#FFE600',
        caption_animation: 'pop',
        music_genre: 'chill_lofi',
      }
    });
  } catch (err: any) {
    logger.error('Error fetching creator kit:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = creatorKitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid creator kit data', details: parsed.error.flatten() }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .update({ creator_kit: parsed.data })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: parsed.data });
  } catch (err: any) {
    logger.error('Error updating creator kit:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
