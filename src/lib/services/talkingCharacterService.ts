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

export interface TalkingCharacterOptions {
  imageBuffer: Buffer;
  audioBuffer: Buffer;
  timestamps: WordTimestamp[];
  width?: number;
  height?: number;
  fps?: number;
}

/**
 * Generates an animated talking character MP4 video buffer from:
 * - A character portrait photo (Buffer)
 * - An audio speech file (Buffer)
 * - Word-level timestamps from Whisper
 */
export async function generateTalkingCharacterVideo(
  options: TalkingCharacterOptions
): Promise<Buffer> {
  const {
    imageBuffer,
    audioBuffer,
    timestamps,
    width = 720,
    height = 1280,
    fps = 30,
  } = options;

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
    const baseY = (height - charH) / 2;

    const mouthCenterY = baseY + charH * 0.62;
    const mouthRadiusX = width * 0.055;
    const mouthRadiusY = width * 0.025;

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

        // Natural life-like floating and breathing
        const breathSwayY = Math.sin(currentTime * 2.2) * 3;
        const subtleSwayX = Math.cos(currentTime * 1.4) * 2;
        const subtleHeadTilt = Math.sin(currentTime * 1.8) * 0.008; // radians

        // Background
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, width, height);

        // Draw character
        ctx.save();
        ctx.translate(width / 2 + subtleSwayX, height / 2 + breathSwayY);
        ctx.rotate(subtleHeadTilt);
        ctx.drawImage(img, -charW / 2, -charH / 2, charW, charH);

        // Mouth Articulation (Lip-Sync synced to speech)
        if (isSpeaking) {
          const timeInWord = currentTime - (activeWord?.start || 0);
          const cycle = Math.sin(timeInWord * Math.PI * 9);
          const openness = Math.max(0, cycle);

          if (openness > 0.15) {
            const openY = openness * 14;
            const openX = openness * 6;

            ctx.save();
            ctx.beginPath();
            ctx.ellipse(
              0,
              mouthCenterY - height / 2,
              mouthRadiusX + openX,
              mouthRadiusY + openY,
              0,
              0,
              Math.PI * 2
            );

            // Lip shadow / mouth depth
            ctx.fillStyle = 'rgba(28, 12, 16, 0.88)';
            ctx.fill();

            // Lip contour
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = 'rgba(120, 50, 60, 0.4)';
            ctx.stroke();

            // Subtle teeth visibility on wider openings
            if (openness > 0.5) {
              ctx.fillStyle = 'rgba(240, 240, 240, 0.75)';
              ctx.fillRect(-mouthRadiusX * 0.4, mouthCenterY - height / 2 - 4, mouthRadiusX * 0.8, 4);
            }

            ctx.restore();
          }
        }

        // Natural Eye Blink every 3.5s
        const blinkCycle = currentTime % 3.5;
        if (blinkCycle > 3.35) {
          const eyeCenterY = baseY + charH * 0.44 - height / 2;
          const eyeLeftX = -width * 0.11;
          const eyeRightX = width * 0.11;
          const eyeWidth = width * 0.05;

          ctx.save();
          ctx.strokeStyle = 'rgba(40, 30, 30, 0.6)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(eyeLeftX, eyeCenterY, eyeWidth, 0.1 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(eyeRightX, eyeCenterY, eyeWidth, 0.1 * Math.PI, 0.9 * Math.PI);
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
