import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';
import { PLAN_LIMITS } from '@/lib/utils/constants';
import { avatarService } from '@/lib/services/avatarService';
import logger from '@/lib/logger';

// Rate limit: 3 avatar profile creations per day per user
let ratelimitInstance: any = null;
async function getRatelimit() {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return {
      limit: async () => ({ success: true })
    };
  }

  if (!ratelimitInstance) {
    const limitPkg = '@upstash/ratelimit';
    const redisPkg = '@upstash/redis';
    const { Ratelimit } = eval('require')(limitPkg);
    const { Redis } = eval('require')(redisPkg);
    ratelimitInstance = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
      }),
      limiter: Ratelimit.slidingWindow(3, '1 d'),
      analytics: true,
    });
  }
  return ratelimitInstance;
}

const createAvatarSchema = z.object({
  storageUrl: z.string().url(),
  avatarName: z.string().trim().min(1),
  fileType: z.enum(['image', 'video']),
});

async function processAvatarAsync(avatarId: string, storageUrl: string, fileType: 'image' | 'video', userId: string) {
  const supabase = createAdminClient();
  
  try {
    const res = await fetch(storageUrl);
    if (!res.ok) throw new Error('Failed to download file from storage');
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let processedUrl = storageUrl;
    let thumbnailUrl = '';
    
    if (fileType === 'image') {
      const result = await avatarService.processAvatarImage(buffer, userId, avatarId, storageUrl);
      if (result.error) {
        throw new Error(result.error);
      }
      processedUrl = result.processedUrl;
      thumbnailUrl = result.thumbnailUrl;
    } else {
      try {
        thumbnailUrl = await avatarService.generateVideoThumbnail(buffer, userId, avatarId);
      } catch (err) {
        logger.warn('Video thumbnail generation failed, using generic thumbnail', err);
        // Could set a generic thumbnail url here
      }
    }

    await supabase
      .from('avatar_profiles')
      .update({
        processed_asset_url: processedUrl,
        preview_image_url: thumbnailUrl,
        status: 'ready'
      })
      .eq('id', avatarId);
      
  } catch (error) {
    logger.error(`Avatar processing failed for ${avatarId}:`, error);
    await supabase
      .from('avatar_profiles')
      .update({
        status: 'failed',
        metadata: { error: String(error) }
      })
      .eq('id', avatarId);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    try {
      const limitInstance = await getRatelimit();
      const { success } = await limitInstance.limit(`avatar_create_${user.id}`);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded. You can create up to 3 avatar profiles per day.' }, { status: 429 });
      }
    } catch (e) {
      logger.warn('Ratelimit check skipped/failed', e);
    }

    const body = await request.json();
    const validatedData = createAvatarSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { data: userData } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    const userPlan = (userData?.plan || 'free') as keyof typeof PLAN_LIMITS;
    const maxAvatars = PLAN_LIMITS[userPlan].max_avatar_profiles;

    const { count: avatarsCount } = await supabase
      .from('avatar_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (avatarsCount !== null && avatarsCount >= maxAvatars) {
      return NextResponse.json({ 
        success: false, 
        error: `Upgrade to add more avatar profiles. Limit is ${maxAvatars} on ${userPlan} plan.` 
      }, { status: 403 });
    }

    const isFirstAvatar = avatarsCount === 0;

    const { data: newAvatar, error } = await supabase
      .from('avatar_profiles')
      .insert({
        user_id: user.id,
        name: validatedData.data.avatarName,
        original_asset_url: validatedData.data.storageUrl,
        file_type: validatedData.data.fileType,
        status: 'processing',
        is_default: isFirstAvatar,
      })
      .select()
      .single();

    if (error) throw error;

    // Start background processing without awaiting
    processAvatarAsync(newAvatar.id, validatedData.data.storageUrl, validatedData.data.fileType, user.id);

    return NextResponse.json({ success: true, data: { avatarId: newAvatar.id, status: 'processing' } });
  } catch (error) {
    logger.error('Create Avatar Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
