import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import { uploadFromUrl } from '@/lib/services/storageService';
import { client, handle_file } from '@gradio/client';
import Replicate from 'replicate';
import logger from '@/lib/logger';

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

  const hfToken = process.env.HUGGINGFACE_TOKEN;

  // 2. Call LatentSync on Hugging Face Spaces
  let outputUrl: string;
  try {
    const space = process.env.HF_SPACE_LATENTSYNC || 'fffiloni/LatentSync';
    logger.info(`Connecting to HF Space for LatentSync: ${space}`);
    const app = await client(space, hfToken ? { token: hfToken as `hf_${string}` } : {});
    
    logger.info(`Running LatentSync prediction...`);
    const result = await app.predict('/generate_lip_sync_video', [
      handle_file(avatarProfile.processed_asset_url),
      handle_file(audioUrl)
    ]);
    
    const outputData = result.data as any;
    if (!outputData || !outputData[0]) {
      throw new Error('LatentSync failed: empty response from HF Space');
    }
    const fileObj = outputData[0];
    let url = typeof fileObj === 'string' ? fileObj : fileObj.url || fileObj.path;
    if (url && url.startsWith('/')) {
      const spaceHost = space.replace('/', '-').toLowerCase();
      url = `https://${spaceHost}.hf.space${url}`;
    }
    outputUrl = url;
  } catch (error: any) {
    logger.warn('LatentSync failed, falling back to SadTalker via HF Spaces', error);
    try {
      const sadTalkerSpace = process.env.HF_SPACE_SADTALKER || 'kevinwang676/SadTalker';
      const app = await client(sadTalkerSpace, hfToken ? { token: hfToken as `hf_${string}` } : {});
      
      logger.info(`Running SadTalker prediction on ${sadTalkerSpace}...`);
      const result = await app.predict(0, [
        handle_file(avatarProfile.processed_asset_url), // Source image
        handle_file(audioUrl), // Input audio
        'crop', // preprocess
        false, // still mode
        false, // GFPGAN as Face enhancer
        0, // batch size
        '256', // face model resolution
        0 // pose style
      ]);
      
      const outputData = result.data as any;
      if (!outputData || !outputData[0]) {
        throw new Error('SadTalker fallback failed: empty response from HF Space');
      }
      const fileObj = outputData[0];
      let url = typeof fileObj === 'string' ? fileObj : fileObj.url || fileObj.path;
      if (url && url.startsWith('/')) {
        const spaceHost = sadTalkerSpace.replace('/', '-').toLowerCase();
        url = `https://${spaceHost}.hf.space${url}`;
      }
      outputUrl = url;
    } catch (sadTalkerError: any) {
      logger.warn('SadTalker failed, falling back to Wav2Lip via Replicate', sadTalkerError);
      
      const replicateToken = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY;
      if (!replicateToken) {
        throw new Error('REPLICATE_API_TOKEN or REPLICATE_API_KEY is not configured. Wav2Lip fallback aborted.');
      }
      
      const replicate = new Replicate({ auth: replicateToken });
      
      const replicateModel = process.env.REPLICATE_WAV2LIP_MODEL || "skytells-research/wav2lip:022bebaff63f03bafbd9d0337c76890d3d3a04a625fcfd06ec4d42b934789d38";
      logger.info(`Running Wav2Lip on Replicate model: ${replicateModel}`);
      
      const result = await replicate.run(
        replicateModel as `${string}/${string}` | `${string}/${string}:${string}`,
        {
          input: {
            face: avatarProfile.processed_asset_url,
            audio: audioUrl
          }
        }
      ) as any;
      
      logger.info('Replicate Wav2Lip execution output:', result);
      let url = '';
      if (typeof result === 'string') {
        url = result;
      } else if (Array.isArray(result) && result.length > 0) {
        url = result[0];
      } else if (result && typeof result === 'object' && result.url) {
        url = result.url;
      }
      
      if (!url) {
        throw new Error('Wav2Lip Replicate fallback failed: No output URL returned');
      }
      outputUrl = url;
    }
  }

  // 3. Download from HF Space, re-upload to storage (R2/Supabase)
  const reuploadedKey = `project-assets/${projectId}/lipsync_${Date.now()}.mp4`;
  const reuploadedVideoUrl = await uploadFromUrl(outputUrl, reuploadedKey, 'video/mp4');

  // 4. Run face enhancement (optional/fallback in case it fails to not block pipeline)
  let finalVideoUrl = reuploadedVideoUrl;
  try {
    const enhanceSpace = process.env.HF_SPACE_GFPGAN || process.env.HF_SPACE_CODEFORMER;
    if (enhanceSpace) {
      logger.info(`Running face enhancement on HF Space ${enhanceSpace}...`);
      const app = await client(enhanceSpace, hfToken ? { token: hfToken as `hf_${string}` } : {});
      const isCodeFormer = enhanceSpace.toLowerCase().includes('codeformer');
      
      let result;
      if (isCodeFormer) {
        result = await app.predict('/inference', [
          handle_file(reuploadedVideoUrl), // image
          true, // face_align
          true, // background_enhance
          true, // face_upsample
          2, // upscale
          0.5 // codeformer_fidelity
        ]);
      } else {
        result = await app.predict(0, [
          handle_file(reuploadedVideoUrl),
          '1.4',
          2
        ]);
      }
      
      const outputData = result.data as any;
      if (outputData && outputData[0]) {
        const fileObj = outputData[0];
        let enhancedUrl = typeof fileObj === 'string' ? fileObj : fileObj.url || fileObj.path;
        if (enhancedUrl && enhancedUrl.startsWith('/')) {
          const spaceHost = enhanceSpace.replace('/', '-').toLowerCase();
          enhancedUrl = `https://${spaceHost}.hf.space${enhancedUrl}`;
        }
        
        // 5. Re-upload enhanced result to storage
        const enhancedKey = `project-assets/${projectId}/lipsync_enhanced_${Date.now()}.mp4`;
        finalVideoUrl = await uploadFromUrl(enhancedUrl, enhancedKey, 'video/mp4');
      }
    }
  } catch (enhanceError) {
    logger.warn('Face enhancement failed, proceeding with original lip-sync', enhanceError);
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

