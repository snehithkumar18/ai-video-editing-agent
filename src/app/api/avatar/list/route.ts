import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/logger';

export const DEFAULT_AVATARS = [
  {
    id: 'default-avatar-spiderman',
    user_id: 'system',
    name: 'Spider-Man (Original Full Video)',
    file_type: 'video',
    original_asset_url: '/spiderman_video.mp4',
    processed_asset_url: '/spiderman_video.mp4',
    preview_image_url: '/presenter.jpg',
    status: 'ready',
    is_default: true,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: 'default-avatar-presenter',
    user_id: 'system',
    name: 'Studio Presenter',
    file_type: 'image',
    original_asset_url: '/presenter.jpg',
    processed_asset_url: '/presenter.jpg',
    preview_image_url: '/presenter.jpg',
    status: 'ready',
    is_default: false,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: 'default-avatar-tech-guy',
    user_id: 'system',
    name: 'Tech Hoodie Creator',
    file_type: 'image',
    original_asset_url: '/claude_skill_reel/tech_hoodie_guy.png',
    processed_asset_url: '/claude_skill_reel/tech_hoodie_guy.png',
    preview_image_url: '/claude_skill_reel/tech_hoodie_guy.png',
    status: 'ready',
    is_default: false,
    metadata: {},
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: true, data: DEFAULT_AVATARS });
    }

    const { data: avatarProfiles, error } = await supabase
      .from('avatar_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('Error fetching avatar profiles, returning defaults', error);
      return NextResponse.json({ success: true, data: DEFAULT_AVATARS });
    }

    const list = Array.isArray(avatarProfiles) ? avatarProfiles : [];
    const combined = [...list, ...DEFAULT_AVATARS];

    return NextResponse.json({ success: true, data: combined });
  } catch (error) {
    logger.error('List Avatars Error:', error);
    return NextResponse.json({ success: true, data: DEFAULT_AVATARS });
  }
}
