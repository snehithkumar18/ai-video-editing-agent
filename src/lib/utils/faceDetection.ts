import { Canvas, Image, ImageData, createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import logger from '@/lib/logger';

let faceapiInstance: any = null;
async function getFaceApi() {
  if (!faceapiInstance) {
    const faceapi = await import('@vladmandic/face-api');
    // @ts-ignore
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    faceapiInstance = faceapi;
  }
  return faceapiInstance;
}

let modelsLoaded = false;

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  const modelPath = process.cwd() + '/public/models';
  try {
    if (!fs.existsSync(modelPath)) {
      const msg = `Face-api model directory not found at ${modelPath}. Please download models into public/models.`;
      logger.error(msg);
      throw new Error(msg);
    }
    const entries = fs.readdirSync(modelPath);
    if (entries.length === 0) {
      const msg = `Face-api model directory at ${modelPath} is empty. Please place model files there.`;
      logger.error(msg);
      throw new Error(msg);
    }
  } catch (e) {
    logger.error('Error checking face model path', e);
    throw e;
  }
  try {
    const faceapi = await getFaceApi();
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
  bypassed?: boolean;
}> {
  try {
    try {
      await loadFaceModels();
    } catch (e) {
      logger.warn('Skipping face detection: Face-api models are not available in public/models', e);
      return {
        faceDetected: true,
        faceCount: 1,
        confidence: 1.0,
        bypassed: true
      };
    }

    const faceapi = await getFaceApi();
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
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
    logger.warn('Skipping face detection due to processing error:', err);
    return {
      faceDetected: true,
      faceCount: 1,
      confidence: 1.0,
      bypassed: true,
      error: String(err)
    };
  }
}
