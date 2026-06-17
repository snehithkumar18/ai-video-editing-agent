import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import { uploadBuffer } from '@/lib/services/storageService';
import { TimelineJSON } from '@/lib/types/timeline';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

ffmpeg.setFfmpegPath(ffmpegPath!);
ffmpeg.setFfprobePath(ffprobePath.path);

export async function processAssembleVideo(job: Job): Promise<{ finalVideoUrl: string; timelineJson: TimelineJSON }> {
  const { projectId } = job.data;
  const supabase = createClient();
  const tmpDir = path.join(os.tmpdir(), `project-${projectId}-${Date.now()}`);
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    // 1. Get all project assets from database
    const { data: assets, error } = await supabase
      .from('project_assets')
      .select('*')
      .eq('project_id', projectId);

    if (error || !assets) throw new Error(`Failed to fetch assets for project ${projectId}`);

    const avatarAsset = assets.find(a => a.type === 'avatar_video');
    const audioAsset = assets.find(a => a.type === 'voice_audio');
    const captionAsset = assets.find(a => a.type === 'caption_json');
    const brollAssets = assets.filter(a => a.type === 'broll_clip');

    if (!avatarAsset || !audioAsset || !captionAsset) {
      throw new Error(`Missing required assets for assembly. Avatar: ${!!avatarAsset}, Audio: ${!!audioAsset}, Captions: ${!!captionAsset}`);
    }

    // 2. Download avatar video to tmp file
    const avatarLocalPath = path.join(tmpDir, 'avatar.mp4');
    const avatarResponse = await fetch(avatarAsset.url);
    if (!avatarResponse.ok) throw new Error('Failed to download avatar video');
    await fs.writeFile(avatarLocalPath, Buffer.from(await avatarResponse.arrayBuffer()));

    // 3. Get video duration using ffprobe
    const videoDuration = await new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe(avatarLocalPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });

    // 4. Get captions JSON from R2
    const captionsResponse = await fetch(captionAsset.url);
    if (!captionsResponse.ok) throw new Error('Failed to download captions JSON');
    const captionsData = await captionsResponse.json();

    // 5. Build TimelineJSON
    const timelineJson: TimelineJSON = {
      version: '1.0',
      duration: videoDuration,
      fps: 30,
      width: 1080,
      height: 1920,
      tracks: [
        {
          id: 'avatar-track', type: 'video', label: 'Avatar', visible: true, locked: false,
          clips: [{ id: 'avatar-1', assetUrl: avatarAsset.url, start: 0, end: videoDuration, duration: videoDuration, locked: true }]
        },
        {
          id: 'broll-track', type: 'video', label: 'B-Roll', visible: true, locked: false,
          clips: brollAssets.map((clip, i) => ({
            id: `broll-${i}`, assetUrl: clip.url,
            start: Math.min(i * 8, videoDuration - 5),
            end: Math.min(i * 8 + 8, videoDuration),
            duration: 8, opacity: 1.0, locked: false
          }))
        },
        {
          id: 'caption-track', type: 'captions', label: 'Captions', visible: true, locked: false,
          clips: captionsData
        },
        {
          id: 'audio-track', type: 'audio', label: 'Voice', visible: true, locked: false,
          clips: [{ id: 'voice-1', assetUrl: audioAsset.url, start: 0, end: videoDuration, duration: videoDuration, volume: 1.0, locked: true }]
        },
        {
          id: 'music-track', type: 'music', label: 'Background Music', visible: true, locked: false,
          clips: []
        }
      ]
    };

    // 6. Save timelineJson to projects table
    await supabase
      .from('projects')
      .update({ timeline_json: timelineJson })
      .eq('id', projectId);

    // 7. Quick ffmpeg preview render: avatar video + captions burned in
    const outputPath = path.join(tmpDir, 'preview.mp4');
    
    // We only create the caption filter if there are captions and the text doesn't contain bad characters
    const captionFilter = captionsData.map((c: { word?: string; start?: number; end?: number }) => {
      // Very basic sanitize for ffmpeg drawtext filter
      const text = (c.word || '').replace(/'/g, "\u2019").replace(/:/g, "\\:");
      return `drawtext=text='${text}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-th-80:enable='between(t\\,${c.start}\\,${c.end})'`;
    }).join(',');

    await new Promise<void>((resolve, reject) => {
      let cmd = ffmpeg(avatarLocalPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions(['-crf 23', '-preset fast', '-movflags +faststart', '-pix_fmt yuv420p']);
      
      if (captionFilter && captionFilter.length > 0) {
        cmd = cmd.videoFilters(captionFilter);
      }
      
      cmd.output(outputPath)
         .on('end', () => resolve())
         .on('error', (err) => reject(err))
         .run();
    });

    // 8. Upload final video to R2
    const finalVideoBuffer = await fs.readFile(outputPath);
    const finalKey = `project-assets/${projectId}/preview_video_${Date.now()}.mp4`;
    const finalVideoUrl = await uploadBuffer(finalVideoBuffer, finalKey, 'video/mp4');

    // 9. Save as project_asset type: 'final_video'
    await supabase.from('project_assets').insert({
      project_id: projectId,
      type: 'final_video',
      url: finalVideoUrl,
    });

    // 10. Update project: status='editing', final_video_url, render_progress=100, duration_seconds
    await supabase
      .from('projects')
      .update({ 
        status: 'editing', 
        final_video_url: finalVideoUrl, 
        render_progress: 100, 
        duration_seconds: videoDuration 
      })
      .eq('id', projectId);

    return { finalVideoUrl, timelineJson };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
