import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateNeuralTalkingCharacterVideo } from '@/lib/services/sadtalkerService';
import { uploadBuffer } from '@/lib/services/storageService';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { imageUrl, audioUrl, avatarId, voiceId, size = '512', enhance = true } = body;

    let targetImageUrl = imageUrl;
    let targetAudioUrl = audioUrl;

    // Resolve avatar image from avatarId if not directly provided
    if (!targetImageUrl && avatarId) {
      const { data: avatar } = await supabase
        .from('avatar_profiles')
        .select('*')
        .eq('id', avatarId)
        .eq('user_id', user.id)
        .single();

      if (avatar) {
        targetImageUrl = avatar.processed_image_url || avatar.original_image_url;
      }
    }

    // Resolve voice audio from voiceId if not directly provided
    if (!targetAudioUrl && voiceId) {
      const { data: voice } = await supabase
        .from('voice_profiles')
        .select('*')
        .eq('id', voiceId)
        .eq('user_id', user.id)
        .single();

      if (voice) {
        targetAudioUrl = voice.sample_url;
      }
    }

    if (!targetImageUrl || !targetAudioUrl) {
      return NextResponse.json(
        { success: false, error: 'Both image (imageUrl or avatarId) and audio (audioUrl or voiceId) are required' },
        { status: 400 }
      );
    }

    logger.info(`[API SadTalker] Downloading image and audio for user ${user.id}...`);
    const [imgRes, audRes] = await Promise.all([
      fetch(targetImageUrl),
      fetch(targetAudioUrl),
    ]);

    if (!imgRes.ok || !audRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to download source image or driving audio' },
        { status: 400 }
      );
    }

    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const audBuffer = Buffer.from(await audRes.arrayBuffer());

    logger.info(`[API SadTalker] Generating neural talking video via SadTalker...`);
    const videoBuffer = await generateNeuralTalkingCharacterVideo({
      imageBuffer: imgBuffer,
      audioBuffer: audBuffer,
      size: size as '256' | '512',
      enhance,
    });

    const storageKey = `avatar-uploads/${user.id}/sadtalker/${Date.now()}.mp4`;
    const publicUrl = await uploadBuffer(videoBuffer, storageKey, 'video/mp4');

    logger.info(`[API SadTalker] Uploaded generated video: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      data: {
        videoUrl: publicUrl,
      },
    });
  } catch (error: any) {
    logger.error('[API SadTalker] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
