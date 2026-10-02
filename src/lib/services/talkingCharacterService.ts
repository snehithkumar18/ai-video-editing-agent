import { createCanvas, loadImage } from 'canvas';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';
import { Readable } from 'stream';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import logger from '@/lib/logger';

ffmpeg.setFfmpegPath(ffmpegPath!);
ffmpeg.setFfprobePath(ffprobePath.path);

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

import { generateNeuralTalkingCharacterVideo } from './sadtalkerService';

export interface TalkingCharacterOptions {
  imageBuffer: Buffer;
  audioBuffer: Buffer;
  timestamps?: WordTimestamp[];
  width?: number;
  height?: number;
  fps?: number;
  mode?: 'neural' | 'canvas';
  mouthNormalizedY?: number;
  mouthNormalizedX?: number;
}

/**
 * Generates an animated talking character MP4 video buffer.
 * Automatically attempts photorealistic Neural generation (SadTalker) first
 * when mode='neural', falling back gracefully to the dynamic local engine.
 */
export async function generateTalkingCharacterVideo(
  options: TalkingCharacterOptions
): Promise<Buffer> {
  const {
    imageBuffer,
    audioBuffer,
    timestamps = [],
    width = 720,
    height = 1280,
    fps = 30,
    mode = 'neural',
    mouthNormalizedY = 0.462,
    mouthNormalizedX = 0.500,
  } = options;

  if (mode === 'neural') {
    try {
      logger.info('[TalkingCharacter] Attempting Neural Talking Character generation via SadTalker...');
      const neuralBuffer = await generateNeuralTalkingCharacterVideo({
        imageBuffer,
        audioBuffer,
        size: '256',
        enhance: false,
      });
      return neuralBuffer;
    } catch (err: any) {
      logger.warn(`[TalkingCharacter] Neural generation failed (${err.message}). Falling back to local dynamic engine.`);
    }
  }

  const tempDir = path.join(os.tmpdir(), `talking_char_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  await fsp.mkdir(tempDir, { recursive: true });

  const tempAudioPath = path.join(tempDir, 'audio.wav');
  const tempOutputPath = path.join(tempDir, 'output.mp4');

  await fsp.writeFile(tempAudioPath, audioBuffer);

  try {
    const img = await loadImage(imageBuffer as any);

    // Get audio duration
    const duration = await new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe(tempAudioPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration || 5);
      });
    });

    const totalFrames = Math.max(1, Math.ceil(duration * fps));
    logger.info(`[TalkingCharacter] Animating ${totalFrames} frames (${duration.toFixed(2)}s) at ${fps} fps`);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Scale and center character
    const imgAspect = img.width / img.height;
    let charW = width;
    let charH = width / imgAspect;
    if (charH < height) {
      charH = height;
      charW = height * imgAspect;
    }
    const charX = -charW / 2;
    const charY = -charH / 2;

    const mouthYRel = charY + charH * mouthNormalizedY;
    const mouthXRel = charX + charW * mouthNormalizedX;
    const mouthRadiusX = charW * 0.027;
    const mouthRadiusY = charH * 0.005;

    let currentFrame = 0;
    const frameStream = new Readable({
      read() {
        if (currentFrame >= totalFrames) {
          this.push(null);
          return;
        }

        const currentTime = currentFrame / fps;

        // Check if currently speaking a word
        const activeWord = timestamps.find(
          (w) => currentTime >= w.start - 0.05 && currentTime <= w.end + 0.08
        );
        const isSpeaking = !!activeWord;
        const timeInWord = isSpeaking ? currentTime - (activeWord?.start || 0) : 0;

        // Natural conversational gestures: head nodding on syllable stress & sway
        const speechNod = isSpeaking ? Math.sin(timeInWord * Math.PI * 5) * 5 : 0;
        const speechTilt = isSpeaking ? Math.sin(timeInWord * Math.PI * 2.5) * 0.025 : 0;
        const breathSwayY = Math.sin(currentTime * 1.8) * 4 + speechNod;
        const subtleSwayX = Math.cos(currentTime * 1.1) * 6;
        const subtleHeadTilt = Math.sin(currentTime * 1.4) * 0.02 + speechTilt; // radians

        // Background
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, width, height);

        // Draw character
        ctx.save();
        ctx.translate(width / 2 + subtleSwayX, height / 2 + breathSwayY);
        ctx.rotate(subtleHeadTilt);
        ctx.drawImage(img, charX, charY, charW, charH);

        // Mouth Articulation (Lip-Sync synced to speech)
        if (isSpeaking) {
          const timeInWord = currentTime - (activeWord?.start || 0);
          const cycle = Math.sin(timeInWord * Math.PI * 9.5);
          const openness = Math.max(0, cycle);

          if (openness > 0.12) {
            const openY = openness * 7.5;
            const openX = openness * 3.5;

            ctx.save();
            const grad = ctx.createRadialGradient(
              mouthXRel,
              mouthYRel,
              1,
              mouthXRel,
              mouthYRel,
              mouthRadiusX + openX
            );
            grad.addColorStop(0, 'rgba(25, 12, 16, 0.95)');
            grad.addColorStop(0.7, 'rgba(45, 20, 26, 0.88)');
            grad.addColorStop(1, 'rgba(75, 38, 45, 0.0)');

            ctx.beginPath();
            ctx.ellipse(
              mouthXRel,
              mouthYRel,
              mouthRadiusX + openX,
              mouthRadiusY + openY,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = grad;
            ctx.fill();

            // Subtle teeth visibility on open vowels
            if (openness > 0.45) {
              ctx.fillStyle = 'rgba(235, 235, 240, 0.72)';
              ctx.beginPath();
              ctx.ellipse(
                mouthXRel,
                mouthYRel - openY * 0.25,
                (mouthRadiusX + openX) * 0.45,
                2.5,
                0,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(75, 40, 45, 0.3)';
            ctx.stroke();
            ctx.restore();
          }
        }

        // Natural Eye Blink every 3.5s
        const blinkCycle = currentTime % 3.5;
        if (blinkCycle > 3.38) {
          const leftEyeX = charX + charW * leftEyeNormalizedX;
          const rightEyeX = charX + charW * rightEyeNormalizedX;
          const eyeY = charY + charH * eyeNormalizedY;
          const eyeWidth = charW * 0.026;

          ctx.save();
          ctx.strokeStyle = 'rgba(65, 45, 38, 0.65)';
          ctx.lineWidth = 2.0;

          ctx.beginPath();
          ctx.arc(leftEyeX, eyeY + 1, eyeWidth, 0.1 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(rightEyeX, eyeY + 1, eyeWidth, 0.1 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();

          ctx.restore();
        }

        ctx.restore();

        const buffer = canvas.toBuffer('raw');
        this.push(buffer);
        currentFrame++;
      },
    });

    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(frameStream)
        .inputOptions([
          '-f rawvideo',
          '-pix_fmt bgra',
          `-s ${width}x${height}`,
          `-r ${fps}`,
        ])
        .input(tempAudioPath)
        .outputOptions([
          '-c:v libx264',
          '-pix_fmt yuv420p',
          '-preset fast',
          '-crf 22',
          '-c:a aac',
          '-b:a 192k',
          '-shortest',
        ])
        .output(tempOutputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    const videoBuffer = await fsp.readFile(tempOutputPath);
    return videoBuffer;
  } finally {
    // Clean up temporary files
    try {
      await fsp.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      logger.warn('[TalkingCharacter] Failed to clean up temp dir', e);
    }
  }
}
