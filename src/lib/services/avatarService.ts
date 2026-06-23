import sharp from 'sharp';
import { uploadBuffer } from './storageService';
import { detectFaceInBuffer } from '../utils/faceDetection';
import { client } from '@gradio/client';
import logger from '@/lib/logger';

export const avatarService = {
  async processAvatarImage(
    imageBuffer: Buffer,
    userId: string,
    avatarId: string,
    storageUrl?: string
  ): Promise<{ processedUrl: string; thumbnailUrl: string; error?: string }> {
    
    // In a real serverless environment (like Vercel Edge/Serverless), 
    // canvas and face-api.js loading might require specific setups or might fail.
    // Assuming the user handles the model files properly as per their requirement.
    try {
      const faceResult = await detectFaceInBuffer(imageBuffer);
      if (!faceResult.faceDetected) {
        return { processedUrl: '', thumbnailUrl: '', error: 'No face detected. Use a clear photo where your face is visible and centered.' };
      }
      if (faceResult.faceCount > 1) {
        return { processedUrl: '', thumbnailUrl: '', error: 'Multiple faces detected. Please use a photo with only your face.' };
      }
    } catch (e) {
      logger.warn('Face detection failed or bypassed, proceeding with image processing', e);
    }

    let noBgBuffer = imageBuffer;
    let backgroundRemoved = false;
    try {
      const space = process.env.HF_SPACE_REMBG || 'briaai/BRIA-RMBG-2.0';
      logger.info(`Removing background using HF Space: ${space}`);
      const hfToken = process.env.HUGGINGFACE_TOKEN;
      const app = await client(space, hfToken ? { token: hfToken as `hf_${string}` } : {});
      
      let result;
      if (storageUrl) {
        logger.info(`Calling BRIA-RMBG-2.0 /text endpoint with URL: ${storageUrl}`);
        result = await app.predict('/text', [storageUrl]);
      } else {
        logger.info(`Calling BRIA-RMBG-2.0 /image endpoint with Blob`);
        const blob = new Blob([new Uint8Array(imageBuffer)]);
        result = await app.predict('/image', [blob]);
      }
      
      const outputData = result.data as any;
      if (outputData && outputData[1]) {
        const fileObj = outputData[1];
        let noBgUrl = typeof fileObj === 'string' ? fileObj : fileObj.url || fileObj.path;
        if (noBgUrl && noBgUrl.startsWith('/')) {
          const spaceHost = space.replace('/', '-').toLowerCase();
          noBgUrl = `https://${spaceHost}.hf.space${noBgUrl}`;
        }
        
        logger.info(`Downloading background-removed image from: ${noBgUrl}`);
        const response = await fetch(noBgUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          noBgBuffer = Buffer.from(arrayBuffer);
          backgroundRemoved = true;
          logger.info(`Successfully removed background for avatar ${avatarId}`);
        } else {
          logger.warn(`Failed to download no-bg image, status: ${response.status}`);
        }
      } else {
        logger.warn('No output file returned from background removal space');
      }
    } catch (bgError) {
      logger.warn('Background removal failed, proceeding with original image', bgError);
    }

    let processed = sharp(noBgBuffer).resize(512, 512, { fit: 'cover', position: 'center' });
    let thumbnail = sharp(noBgBuffer).resize(200, 200, { fit: 'cover', position: 'center' });
    
    if (backgroundRemoved) {
      processed = processed.png();
      thumbnail = thumbnail.png();
    } else {
      processed = processed.jpeg({ quality: 90 });
      thumbnail = thumbnail.jpeg({ quality: 80 });
    }

    const processedBuffer = await processed.toBuffer();
    const thumbnailBuffer = await thumbnail.toBuffer();

    const extension = backgroundRemoved ? 'png' : 'jpg';
    const contentType = backgroundRemoved ? 'image/png' : 'image/jpeg';

    const processedUrl = await uploadBuffer(
      processedBuffer as any,
      `avatar-uploads/${userId}/processed/${avatarId}.${extension}`,
      contentType
    );

    const thumbnailUrl = await uploadBuffer(
      thumbnailBuffer as any,
      `avatar-uploads/${userId}/thumbnails/${avatarId}.${extension}`,
      contentType
    );

    return { processedUrl, thumbnailUrl };
  },

  async generateVideoThumbnail(
    videoBuffer: Buffer,
    userId: string,
    avatarId: string
  ): Promise<string> {
    // Note: extracting a frame from video buffer with sharp is tricky unless the buffer is small and supported,
    // or if we use ffmpeg. Sharp does not fully support video formats out of the box.
    // For this boilerplate, we'll assume the video format is partially supported or we just use a generic thumbnail approach if it fails.
    try {
      const thumbnailBuffer = await sharp(videoBuffer, { pages: 1 })
        .resize(200, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      return uploadBuffer(
        thumbnailBuffer,
        `avatar-uploads/${userId}/thumbnails/${avatarId}-thumb.jpg`,
        'image/jpeg'
      );
    } catch (error) {
      logger.error('Failed to generate video thumbnail with Sharp', error);
      // Fallback: in a real scenario, use fluent-ffmpeg. Returning a generic/placeholder thumbnail URL or throw.
      throw new Error('Failed to extract video thumbnail');
    }
  }
};

