import sharp from 'sharp';
import { uploadBuffer } from './storageService';
import { detectFaceInBuffer } from '../utils/faceDetection';
import logger from '@/lib/logger';

export const avatarService = {
  async processAvatarImage(
    imageBuffer: Buffer,
    userId: string,
    avatarId: string
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

    const processedBuffer = await sharp(imageBuffer)
      .resize(512, 512, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toBuffer();

    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(200, 200, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const processedUrl = await uploadBuffer(
      processedBuffer,
      `avatar-uploads/${userId}/processed/${avatarId}.jpg`,
      'image/jpeg'
    );

    const thumbnailUrl = await uploadBuffer(
      thumbnailBuffer,
      `avatar-uploads/${userId}/thumbnails/${avatarId}.jpg`,
      'image/jpeg'
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
