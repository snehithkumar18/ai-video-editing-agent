import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import Groq from 'groq-sdk';
import logger from '@/lib/logger';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function processFetchBRoll(job: Job): Promise<{ clips: any[] }> {
  const { projectId, script } = job.data;
  const supabase = createClient();

  // 1. Use Groq to extract emotional scene descriptions
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

  const { scenes } = JSON.parse(response.choices[0].message.content!) as { scenes: string[] };

  // 2. Search Pexels for each scene
  const clips = [];
  for (const scene of scenes.slice(0, 5)) {
    try {
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(scene)}&per_page=3&orientation=portrait`,
        { headers: { Authorization: process.env.PEXELS_API_KEY! } }
      );
      
      const data = await res.json();
      if (data.videos?.length > 0) {
        const video = data.videos[0];
        const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];
        
        const clipData = { 
          keyword: scene, 
          url: file.link, 
          thumbnailUrl: video.image, 
          duration: video.duration, 
          pexelsId: video.id 
        };
        
        clips.push(clipData);

        // 3. Save each clip as project_asset
        await supabase.from('project_assets').insert({
          project_id: projectId,
          type: 'broll_clip',
          url: file.link,
          metadata: clipData
        });
      }
    } catch (err) {
      logger.warn(`Failed to fetch B-Roll for scene: ${scene}`, err);
    }
  }

  // Update projects render_progress 
  // (Usually runs in parallel so it doesn't represent total 85%, but keeping it aligned with progress)
  await supabase
    .from('projects')
    .update({ render_progress: 85 })
    .eq('id', projectId);

  return { clips };
}
