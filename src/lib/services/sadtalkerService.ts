import { spawn } from 'child_process';
import path from 'path';
import fsp from 'fs/promises';
import os from 'os';
import logger from '@/lib/logger';

export interface NeuralTalkingCharacterOptions {
  imageBuffer: Buffer;
  audioBuffer: Buffer;
  enhance?: boolean;
  size?: '256' | '512';
  stillMode?: boolean;
}

/**
 * Generates a photorealistic neural talking character MP4 video
 * using the user's Hugging Face SadTalker space.
 */
export async function generateNeuralTalkingCharacterVideo(
  options: NeuralTalkingCharacterOptions
): Promise<Buffer> {
  const {
    imageBuffer,
    audioBuffer,
    enhance = false,
    size = '256',
    stillMode = false,
  } = options;

  const tempDir = path.join(os.tmpdir(), `sadtalker_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  await fsp.mkdir(tempDir, { recursive: true });

  const tempImagePath = path.join(tempDir, 'source_image.png');
  const tempAudioPath = path.join(tempDir, 'driven_audio.wav');
  const tempOutputPath = path.join(tempDir, 'output_video.mp4');

  await fsp.writeFile(tempImagePath, imageBuffer);
  await fsp.writeFile(tempAudioPath, audioBuffer);

  const scriptPath = path.resolve('src', 'server', 'sadtalkerService.py');
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

  const args = [
    scriptPath,
    '--image', tempImagePath,
    '--audio', tempAudioPath,
    '--output', tempOutputPath,
    '--size', size,
  ];

  if (enhance) args.push('--enhance');
  if (stillMode) args.push('--still');

  logger.info(`[NeuralAvatar] Launching SadTalker generation process (enhance=${enhance}, size=${size})...`);

  return new Promise<Buffer>((resolve, reject) => {
    const proc = spawn(pythonCmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    let stderr = '';
    let stdout = '';

    proc.stdout.on('data', (d) => {
      const line = d.toString().trim();
      if (line) {
        stdout += line + '\n';
        logger.info(`[NeuralAvatar] ${line}`);
      }
    });

    proc.stderr.on('data', (d) => {
      const line = d.toString().trim();
      if (line) {
        stderr += line + '\n';
        logger.warn(`[NeuralAvatar] ${line}`);
      }
    });

    proc.on('close', async (code) => {
      try {
        if (code !== 0) {
          throw new Error(`SadTalker process exited with code ${code}. Stderr: ${stderr || stdout}`);
        }

        const videoBuffer = await fsp.readFile(tempOutputPath);
        logger.info(`[NeuralAvatar] Successfully generated neural video: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        // Cleanup
        await fsp.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        resolve(videoBuffer);
      } catch (err) {
        await fsp.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        reject(err);
      }
    });

    proc.on('error', async (err) => {
      await fsp.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      reject(err);
    });
  });
}
