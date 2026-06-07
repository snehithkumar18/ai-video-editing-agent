import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import { generateSpeech } from '@/lib/services/voiceService';
import { uploadBuffer } from '@/lib/services/storageService';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function processGenerateVoice(job: Job): Promise<{ audioUrl: string; durationSeconds: number }> {
  const { projectId, script, voiceProfileId } = job.data;
  const supabase = createClient();

  // 1. Get voice profile from Supabase
  const { data: voiceProfile, error: fetchError } = await supabase
    .from('voice_profiles')
    .select('*')
    .eq('id', voiceProfileId)
    .single();

  if (fetchError || !voiceProfile) {
    throw new Error(`Voice profile not found: ${voiceProfileId}`);
  }

  // 2. Call voiceService.generateSpeech
  const { audioBuffer } = await generateSpeech(script, voiceProfile);

  // 3. Upload audio buffer to R2
  const audioKey = `project-assets/${projectId}/voice_audio_${Date.now()}.mp3`;
  const audioUrl = await uploadBuffer(audioBuffer, audioKey, 'audio/mpeg');

  // 4. Get duration
  const tempPath = path.join(os.tmpdir(), `temp_${Date.now()}.mp3`);
  await fs.writeFile(tempPath, audioBuffer);
  const durationSeconds = await getAudioDurationInSeconds(tempPath);
  await fs.unlink(tempPath);

  // 5. Insert into project_assets
  await supabase.from('project_assets').insert({
    project_id: projectId,
    type: 'voice_audio',
    url: audioUrl,
    metadata: { duration_seconds: durationSeconds }
  });

  // 6. Update projects render_progress
  await supabase
    .from('projects')
    .update({ render_progress: 20 })
    .eq('id', projectId);

  return { audioUrl, durationSeconds };
}
