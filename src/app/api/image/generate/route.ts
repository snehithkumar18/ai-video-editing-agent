import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@/lib/supabase/admin';
import { generateImageFromPrompt } from '@/lib/services/imageGenerationService';
import { z } from 'zod';
import logger from '@/lib/logger';

const generateImageSchema = z.object({
  prompt: z.string().trim().min(1),
  projectId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = generateImageSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { prompt, projectId } = validatedData.data;

    // Call SDXL image generation service
    const result = await generateImageFromPrompt(prompt, user.id, projectId);

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    // If projectId is provided, save as a project asset in the database
    if (projectId && result.imageUrl) {
      const adminSupabase = createAdminClient();
      
      const { data: asset, error: assetError } = await adminSupabase
        .from('project_assets')
        .insert({
          project_id: projectId,
          type: 'thumbnail',
          url: result.imageUrl,
          filename: `sdxl_${Date.now()}.png`,
        })
        .select()
        .single();

      if (assetError) {
        logger.error('Failed to save generated image to project assets:', assetError);
        // We still return success since the image was successfully generated
      } else {
        return NextResponse.json({
          success: true,
          data: {
            imageUrl: result.imageUrl,
            assetId: asset.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
      },
    });
  } catch (error) {
    logger.error('Image Generation API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
