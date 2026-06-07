import { Worker, Job } from 'bullmq';
import { processGenerateVoice } from '../src/lib/queue/processors/generateVoiceJob';
import { processGenerateLipSync } from '../src/lib/queue/processors/generateLipSyncJob';
import { processGenerateCaptions } from '../src/lib/queue/processors/generateCaptionsJob';
import { processFetchBRoll } from '../src/lib/queue/processors/fetchBRollJob';
import { processAssembleVideo } from '../src/lib/queue/processors/assembleVideoJob';
import { processExportVideo } from '../src/lib/queue/processors/exportVideoJob';
import Redis from 'ioredis';
import { createClient } from '../src/lib/supabase/admin';

const connection = new Redis(process.env.UPSTASH_REDIS_REST_URL!, {
  password: process.env.UPSTASH_REDIS_REST_TOKEN!,
  tls: {},
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'video-generation',
  async (job: Job) => {
    console.log(`[Worker] Starting job: ${job.name} (${job.id}) for project: ${job.data.projectId}`);
    try {
      switch (job.name) {
        case 'GENERATE_VOICE': return await processGenerateVoice(job);
        case 'GENERATE_LIPSYNC': return await processGenerateLipSync(job);
        case 'GENERATE_CAPTIONS': return await processGenerateCaptions(job);
        case 'FETCH_BROLL': return await processFetchBRoll(job);
        case 'ASSEMBLE_VIDEO': return await processAssembleVideo(job);
        case 'EXPORT_VIDEO': return await processExportVideo(job);
        default: throw new Error(`Unknown job: ${job.name}`);
      }
    } catch (error) {
      console.error(`[Worker] Job ${job.name} failed:`, error);
      
      // Update project status on failure
      const supabase = createClient();
      if (job.data?.projectId) {
        await supabase
          .from('projects')
          .update({ 
            status: 'failed', 
            metadata: { error: String(error), failedAtJob: job.name }
          })
          .eq('id', job.data.projectId);
      }
      
      throw error;
    }
  },
  { connection, concurrency: 2, maxStalledCount: 3 }
);

worker.on('completed', (job) => console.log(`[Worker] Completed: ${job.name} (${job.id})`));
worker.on('failed', (job, err) => console.error(`[Worker] Failed: ${job?.name}:`, err.message));
worker.on('error', (err) => console.error('[Worker] Error:', err));

console.log('[Worker] Video generation worker started');

// Keep the process running
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  process.exit(0);
});
