import { uploadBuffer } from './storageService';
import logger from '@/lib/logger';

export async function generateImageFromPrompt(
  prompt: string,
  userId: string,
  projectId?: string
): Promise<{ imageUrl: string; error?: string }> {
  try {
    const hfToken = process.env.HUGGINGFACE_TOKEN;
    if (!hfToken) {
      throw new Error('HUGGINGFACE_TOKEN environment variable is not set');
    }

    // Default to SDXL, but allow override
    const model = process.env.HF_MODEL_IMAGE_GEN || 'stabilityai/stable-diffusion-xl-base-1.0';
    logger.info(`Generating image using HF model ${model} for prompt: "${prompt}"`);

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF Inference API failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the generated image to storage (R2/Supabase)
    const key = projectId
      ? `project-assets/${projectId}/sdxl_${Date.now()}.png`
      : `generated-images/${userId}/sdxl_${Date.now()}.png`;

    const imageUrl = await uploadBuffer(buffer, key, 'image/png');
    logger.info(`Successfully generated and uploaded image to ${imageUrl}`);

    return { imageUrl };
  } catch (error: any) {
    logger.error('Failed to generate image:', error);
    return { imageUrl: '', error: error.message || String(error) };
  }
}
