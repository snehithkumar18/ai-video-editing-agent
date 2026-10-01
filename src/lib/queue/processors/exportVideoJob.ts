import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import logger from '@/lib/logger';
import { uploadBuffer } from '@/lib/services/storageService';
import { TimelineJSON } from '@/lib/types/timeline';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';

ffmpeg.setFfmpegPath(ffmpegPath!);
ffmpeg.setFfprobePath(ffprobePath.path);

/**
 * Quality presets mapping requested quality to FFmpeg encoding parameters.
 */
const QUALITY_PRESETS: Record<string, { videoBitrate: string; audioBitrate: string; preset: string; crf: number; scale?: string }> = {
  '720p': { videoBitrate: '2500k', audioBitrate: '128k', preset: 'medium', crf: 26, scale: '720:-2' },
  '1080p': { videoBitrate: '5000k', audioBitrate: '192k', preset: 'medium', crf: 23 },
  '4K': { videoBitrate: '15000k', audioBitrate: '320k', preset: 'slow', crf: 18, scale: '3840:-2' },
};

/**
 * Downloads a remote file from a URL to a local path.
 */
async function downloadFile(url: string, destPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  await fsp.writeFile(destPath, Buffer.from(arrayBuffer));
}

/**
 * Sanitizes a word for use inside the FFmpeg drawtext filter.
 * The drawtext filter requires escaping of colons, single quotes, and backslashes.
 */
function sanitizeForDrawtext(text: string): string {
  return text
    .replace(/\\/g, '\\\\\\\\')   // Escape backslashes
    .replace(/'/g, '\u2019')       // Replace single quotes with unicode right quote
    .replace(/:/g, '\\\\:')       // Escape colons for drawtext
    .replace(/"/g, '\\\\"')        // Escape double quotes
    .replace(/%/g, '%%');          // Escape percent signs for FFmpeg
}

export async function processExportVideo(job: Job) {
  const { projectId, quality = '1080p', format = 'mp4', watermark = false } = job.data;
  const supabase = createClient();

  // 1. Fetch project data including timeline
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('timeline_json, user_id, title')
    .eq('id', projectId)
    .single();

  if (projectError || !project) throw new Error('Project not found');

  const timeline: TimelineJSON | null = project.timeline_json as TimelineJSON | null;
  if (!timeline || !timeline.tracks) {
    throw new Error('Timeline JSON not found or invalid. Cannot export empty project.');
  }

  // Update progress: starting
  await supabase.from('projects').update({ render_progress: 5 }).eq('id', projectId);

  const workDir = path.join(os.tmpdir(), `export_${projectId}_${Date.now()}`);
  await fsp.mkdir(workDir, { recursive: true });

  try {
    // 2. Extract asset URLs from the timeline tracks
    const avatarTrack = timeline.tracks.find(t => t.id === 'avatar-track' || (t.type === 'video' && t.label === 'Avatar'));
    const audioTrack = timeline.tracks.find(t => t.type === 'audio');
    const captionTrack = timeline.tracks.find(t => t.type === 'captions');

    const avatarClip = avatarTrack?.clips?.[0];
    const audioClip = audioTrack?.clips?.[0];

    if (!avatarClip?.assetUrl) {
      throw new Error('No avatar video found in the timeline. Cannot export.');
    }

    // 3. Download the voice audio (if exists as a separate file)
    let audioLocalPath: string | null = null;
    if (audioClip?.assetUrl) {
      audioLocalPath = path.join(workDir, 'voice.mp3');
      logger.info(`[Export] Downloading voice audio...`);
      await downloadFile(audioClip.assetUrl, audioLocalPath);
    }
    await supabase.from('projects').update({ render_progress: 20 }).eq('id', projectId);

    // 4. Download and prepare the avatar video
    const isImage = avatarClip.assetUrl.match(/\.(png|jpg|jpeg|webp)/i);
    let avatarLocalPath = path.join(workDir, isImage ? 'avatar_input.png' : 'avatar.mp4');
    logger.info(`[Export] Downloading avatar asset...`);
    await downloadFile(avatarClip.assetUrl, avatarLocalPath);

    if (isImage && audioLocalPath) {
      logger.info(`[Export] Converting avatar image into animated talking character video...`);
      const animatedVideoPath = path.join(workDir, 'avatar.mp4');
      const { generateTalkingCharacterVideo } = await import('@/lib/services/talkingCharacterService');
      const imageBuf = await fsp.readFile(avatarLocalPath);
      const audioBuf = await fsp.readFile(audioLocalPath);
      const timestamps = (captionTrack?.clips || []).map((c: any) => ({
        word: c.word || '',
        start: c.start || 0,
        end: c.end || 0,
      }));
      const animatedBuf = await generateTalkingCharacterVideo({
        imageBuffer: imageBuf,
        audioBuffer: audioBuf,
        timestamps,
      });
      await fsp.writeFile(animatedVideoPath, animatedBuf);
      avatarLocalPath = animatedVideoPath;
    }
    await supabase.from('projects').update({ render_progress: 30 }).eq('id', projectId);

    // 5. Build caption drawtext filters
    const captionFilters: string[] = [];
    if (captionTrack?.clips && captionTrack.clips.length > 0) {
      for (const cap of captionTrack.clips) {
        if (!cap.word || cap.start === undefined || cap.end === undefined) continue;
        const text = sanitizeForDrawtext(cap.word);
        const fontSize = cap.style?.fontSize || 48;
        const fontColor = cap.style?.color || 'white';

        captionFilters.push(
          `drawtext=text='${text}':fontsize=${fontSize}:fontcolor=${fontColor}:x=(w-text_w)/2:y=h-th-100:enable='between(t\\,${cap.start}\\,${cap.end})':box=1:boxcolor=black@0.5:boxborderw=8`
        );
      }
    }

    // 6. Build watermark filter for free-tier users
    if (watermark) {
      captionFilters.push(
        `drawtext=text='VidAgent Free':fontsize=28:fontcolor=white@0.4:x=w-tw-20:y=20:enable='1'`
      );
    }

    await supabase.from('projects').update({ render_progress: 35 }).eq('id', projectId);

    // 7. Determine quality settings
    const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS['1080p'];
    const outputExtension = format === 'webm' ? 'webm' : 'mp4';
    const outputPath = path.join(workDir, `output.${outputExtension}`);

    // 8. Run FFmpeg render
    logger.info(`[Export] Starting FFmpeg render at ${quality} quality...`);
    await new Promise<void>((resolve, reject) => {
      let cmd = ffmpeg(avatarLocalPath);

      // Add voice audio as a secondary input if available
      if (audioLocalPath) {
        cmd = cmd.input(audioLocalPath);
      }

      // Video codec settings
      if (format === 'webm') {
        cmd = cmd.videoCodec('libvpx-vp9').audioCodec('libopus');
      } else {
        cmd = cmd.videoCodec('libx264').audioCodec('aac');
      }

      // Output options
      const outputOptions: string[] = [
        `-b:v ${preset.videoBitrate}`,
        `-b:a ${preset.audioBitrate}`,
        `-preset ${preset.preset}`,
        `-crf ${preset.crf}`,
        '-movflags +faststart',
        '-pix_fmt yuv420p',
      ];

      // If using a separate audio input, map both streams
      if (audioLocalPath) {
        outputOptions.push('-map 0:v:0');  // Video from the first input (avatar)
        outputOptions.push('-map 1:a:0');  // Audio from the second input (voice)
        outputOptions.push('-shortest');   // End when the shorter input ends
      }

      cmd = cmd.outputOptions(outputOptions);

      // Apply scale filter if the quality preset requests it
      const allFilters: string[] = [];
      if (preset.scale) {
        allFilters.push(`scale=${preset.scale}`);
      }

      // Append all caption + watermark drawtext filters
      allFilters.push(...captionFilters);

      if (allFilters.length > 0) {
        cmd = cmd.videoFilters(allFilters);
      }

      cmd
        .output(outputPath)
        .on('progress', async (progress) => {
          // Map ffmpeg progress (0-100%) to our progress range (35-90%)
          const mappedProgress = Math.round(35 + (progress.percent || 0) * 0.55);
          await supabase.from('projects').update({ render_progress: Math.min(mappedProgress, 90) }).eq('id', projectId);
        })
        .on('end', () => {
          logger.info(`[Export] FFmpeg render completed.`);
          resolve();
        })
        .on('error', (err) => {
          logger.error(`[Export] FFmpeg render failed:`, err);
          reject(err);
        })
        .run();
    });

    await supabase.from('projects').update({ render_progress: 92 }).eq('id', projectId);

    // 9. Upload the rendered file to R2
    logger.info(`[Export] Uploading rendered file to R2...`);
    const fileBuffer = await fsp.readFile(outputPath);
    const s3Key = `exports/${project.user_id}/${projectId}_${Date.now()}.${outputExtension}`;
    const contentType = format === 'webm' ? 'video/webm' : 'video/mp4';
    const publicUrl = await uploadBuffer(fileBuffer, s3Key, contentType);

    await supabase.from('projects').update({ render_progress: 98 }).eq('id', projectId);

    // 10. Save the final exported asset and update the project
    await supabase.from('project_assets').insert({
      project_id: projectId,
      type: 'final_video',
      url: publicUrl,
      filename: `${project.title || 'export'}_${quality}.${outputExtension}`,
    });

    await supabase
      .from('projects')
      .update({
        final_video_url: publicUrl,
        status: 'complete',
        render_progress: 100,
      })
      .eq('id', projectId);

    logger.info(`[Export] Export complete. URL: ${publicUrl}`);
    return { publicUrl };

  } catch (error) {
    // Mark project as failed
    await supabase
      .from('projects')
      .update({
        status: 'failed',
        error_message: String(error),
      })
      .eq('id', projectId);

    // Clean up temp directory
    await fsp.rm(workDir, { recursive: true, force: true }).catch(() => {});
    throw error;

  } finally {
    // Always clean up temp directory
    await fsp.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
