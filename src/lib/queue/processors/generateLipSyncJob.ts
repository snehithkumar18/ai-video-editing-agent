import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import { uploadFromUrl } from '@/lib/services/storageService';
import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

export async function processGenerateLipSync(job: Job): Promise<{ videoUrl: string }> {
  const { projectId, avatarProfileId, audioUrl } = job.data;
  const supabase = createClient();

  // 1. Get avatar profile
  const { data: avatarProfile } = await supabase
    .from('avatar_profiles')
    .select('processed_asset_url')
    .eq('id', avatarProfileId)
    .single();

  if (!avatarProfile || !avatarProfile.processed_asset_url) {
    throw new Error(`Avatar profile missing or not processed: ${avatarProfileId}`);
  }

  // 2. Call LatentSync on Replicate
  let outputUrl: string;
  try {
    const output = await replicate.run(
      "bytedance/latentsync:9c4e108bed9ea4e5e8b7ca30296a82dc2c4eb1f43fd32d7e19d0c1e14e2d8892",
      {
        input: {
          video: avatarProfile.processed_asset_url,
          audio: audioUrl,
        }
      }
    ) as string;
    outputUrl = output;
  } catch (error) {
    console.warn('LatentSync failed, falling back to SadTalker', error);
    const output = await replicate.run(
      "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376",
      { 
        input: { 
          source_image: avatarProfile.processed_asset_url, 
          driven_audio: audioUrl, 
          preprocess: 'crop', 
          still_mode: false 
        } 
      }
    ) as string;
    outputUrl = output;
  }

  // 3. Download from Replicate, re-upload to R2
  const reuploadedKey = `project-assets/${projectId}/lipsync_${Date.now()}.mp4`;
  const reuploadedVideoUrl = await uploadFromUrl(outputUrl, reuploadedKey, 'video/mp4');

  // 4. Run GFPGAN enhancement (optional/fallback in case it fails to not block pipeline)
  let finalVideoUrl = reuploadedVideoUrl;
  try {
    const enhanced = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      { input: { img: reuploadedVideoUrl, version: '1.4', scale: 2 } }
    ) as string;
    
    // 5. Re-upload enhanced result to R2
    const enhancedKey = `project-assets/${projectId}/lipsync_enhanced_${Date.now()}.mp4`;
    finalVideoUrl = await uploadFromUrl(enhanced, enhancedKey, 'video/mp4');
  } catch (enhanceError) {
    console.warn('GFPGAN enhancement failed, proceeding with original lip-sync', enhanceError);
  }

  // 6. Save as project_asset
  await supabase.from('project_assets').insert({
    project_id: projectId,
    type: 'avatar_video',
    url: finalVideoUrl,
  });

  // 7. Update render_progress
  await supabase
    .from('projects')
    .update({ render_progress: 55 })
    .eq('id', projectId);

  return { videoUrl: finalVideoUrl };
}
