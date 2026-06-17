import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import Groq from 'groq-sdk';
import logger from '@/lib/logger';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export async function processFetchBRoll(job: Job): Promise<{ clips: any[] }> {
  const { projectId, script } = job.data;
  const supabase = createClient();

  // 1. Extract scenes using Groq or fallback to local heuristic
  let scenes: string[] = [];

  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { 
            role: 'user', 
            content: `Extract 5 emotional B-roll scene descriptions from this script. Each should describe mood and visual feeling, not just objects. Return JSON: {"scenes": ["desc1","desc2",...]}. Script: "${script}"` 
          }
        ],
        response_format: { type: 'json_object' }
      });

      const parsed = JSON.parse(response.choices[0].message.content!) as { scenes: string[] };
      scenes = parsed.scenes || [];
    } catch (err) {
      logger.warn('Groq B-roll scene extraction failed, falling back to heuristic', err);
    }
  }

  if (scenes.length === 0) {
    logger.info('Using local heuristic B-roll scene extraction...');
    scenes = script
      .split(/[.!?\n]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 8)
      .slice(0, 5);
      
    if (scenes.length === 0) {
      scenes = ['calm ambient background', 'cinematic slow motion', 'inspiring visual', 'technology abstract', 'creative workspace'];
    }
  }

  // 2. Search multi-tier stock libraries (Pexels -> Pixabay -> Coverr) for each scene
  const clips = [];
  for (const scene of scenes.slice(0, 5)) {
    let clipData = null;

    // Tier 1: Pexels
    if (process.env.PEXELS_API_KEY) {
      try {
        logger.info(`Searching Pexels for scene: ${scene}`);
        const res = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(scene)}&per_page=3&orientation=portrait`,
          { headers: { Authorization: process.env.PEXELS_API_KEY } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.videos?.length > 0) {
            const video = data.videos[0];
            const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];
            clipData = { 
              keyword: scene, 
              url: file.link, 
              thumbnailUrl: video.image, 
              duration: video.duration, 
              pexelsId: video.id,
              source: 'pexels'
            };
          }
        }
      } catch (err) {
        logger.warn(`Pexels fetch failed for scene: ${scene}`, err);
      }
    }

    // Tier 2: Pixabay Fallback
    if (!clipData && process.env.PIXABAY_API_KEY) {
      try {
        logger.info(`Searching Pixabay for scene: ${scene}`);
        const res = await fetch(
          `https://pixabay.com/api/videos/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(scene)}&per_page=3`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.hits?.length > 0) {
            const hit = data.hits[0];
            const videoObj = hit.videos.large || hit.videos.medium || hit.videos.small || hit.videos.tiny;
            if (videoObj && videoObj.url) {
              let thumbnail = '';
              if (hit.picture_id) {
                thumbnail = `https://i.vimeocdn.com/video/${hit.picture_id}_640x360.jpg`;
              }
              clipData = {
                keyword: scene,
                url: videoObj.url,
                thumbnailUrl: thumbnail,
                duration: hit.duration,
                pixabayId: hit.id,
                source: 'pixabay'
              };
            }
          }
        }
      } catch (err) {
        logger.warn(`Pixabay fetch failed for scene: ${scene}`, err);
      }
    }

    // Tier 3: Coverr Fallback
    if (!clipData && process.env.COVERR_API_KEY) {
      try {
        logger.info(`Searching Coverr for scene: ${scene}`);
        const res = await fetch(
          `https://api.coverr.co/videos?api_key=${process.env.COVERR_API_KEY}&query=${encodeURIComponent(scene)}&urls=true&page_size=3`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.hits?.length > 0) {
            const hit = data.hits[0];
            if (hit.urls?.mp4) {
              clipData = {
                keyword: scene,
                url: hit.urls.mp4,
                thumbnailUrl: hit.urls.preview || '',
                duration: hit.duration || 10,
                coverrId: hit.id,
                source: 'coverr'
              };
            }
          }
        }
      } catch (err) {
        logger.warn(`Coverr fetch failed for scene: ${scene}`, err);
      }
    }

    // Save and push if clip found
    if (clipData) {
      clips.push(clipData);
      try {
        await supabase.from('project_assets').insert({
          project_id: projectId,
          type: 'broll_clip',
          url: clipData.url,
          metadata: clipData
        });
      } catch (dbErr) {
        logger.error(`Failed to save B-roll asset to DB for scene: ${scene}`, dbErr);
      }
    } else {
      logger.warn(`No B-Roll found for scene: ${scene} across all platforms`);
    }
  }

  // Update projects render_progress 
  await supabase
    .from('projects')
    .update({ render_progress: 85 })
    .eq('id', projectId);

  return { clips };
}
