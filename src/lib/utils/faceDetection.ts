import * as faceapi from '@vladmandic/face-api';
import { Canvas, Image, ImageData, createCanvas, loadImage } from 'canvas';
import logger from '@/lib/logger';

// @ts-ignore
faceapi.env.monkeyPatch({ Canvas: Canvas as any, Image: Image as any, ImageData: ImageData as any });

let modelsLoaded = false;

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  // Models should ideally be loaded from a CDN or public URL if this runs edge/serverless, 
  // but for local/Node environments, providing a path to models works.
  const modelPath = process.cwd() + '/public/models';
  
  try {
    // In a real production deployment, you might need to handle fetching models differently
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    modelsLoaded = true;
  } catch (err) {
    logger.error('Failed to load face models. Ensure models exist in public/models', err);
    throw err;
  }
}

export async function detectFaceInBuffer(imageBuffer: Buffer): Promise<{
  faceDetected: boolean;
  faceCount: number;
  confidence: number;
  error?: string;
}> {
  try {
    await loadFaceModels();
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img as any, 0, 0);
    const detections = await faceapi.detectAllFaces(
      canvas as any,
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
    );
    return {
      faceDetected: detections.length > 0,
      faceCount: detections.length,
      confidence: detections[0]?.score || 0,
    };
  } catch (err) {
    return { faceDetected: false, faceCount: 0, confidence: 0, error: String(err) };
  }
}
