import * as faceapi from '@vladmandic/face-api';
import { Canvas, Image, ImageData, createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import logger from '@/lib/logger';

// face-api expects the node-canvas bindings to be present at runtime.
// Suppress the TS mismatch here while passing the runtime objects directly.
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  // Models should ideally be loaded from a CDN or public URL if this runs edge/serverless,
  // but for local/Node environments, providing a path to models works.
  const modelPath = process.cwd() + '/public/models';
  // Ensure the models folder exists and contains model files to provide a helpful error
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
    // If fs calls fail for any reason, log and rethrow to surface the problem early.
    logger.error('Error checking face model path', e);
    throw e;
  }
  try {
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
    ctx.drawImage(img, 0, 0);
    const detections = await faceapi.detectAllFaces(
      canvas,
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
