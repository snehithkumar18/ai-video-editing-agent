import './register-env';
import { Worker, Job } from 'bullmq';
import { processGenerateVoice } from '../src/lib/queue/processors/generateVoiceJob';
import { processGenerateLipSync } from '../src/lib/queue/processors/generateLipSyncJob';
import { processGenerateCaptions } from '../src/lib/queue/processors/generateCaptionsJob';
import { processFetchBRoll } from '../src/lib/queue/processors/fetchBRollJob';
import { processAssembleVideo } from '../src/lib/queue/processors/assembleVideoJob';
import { processExportVideo } from '../src/lib/queue/processors/exportVideoJob';
import Redis from 'ioredis';
import { createClient } from '../src/lib/supabase/admin';
import logger from '../src/lib/logger';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';

const connection = redisUrl.startsWith('https://')
  ? new Redis({
      host: redisUrl.replace('https://', ''),
      port: 6379,
      password: redisToken,
      tls: {},
      maxRetriesPerRequest: null,
    })
  : new Redis(redisUrl, {
      password: redisToken,
      tls: {},
      maxRetriesPerRequest: null,
    });

const worker = new Worker(
  'video-generation',
  async (job: Job) => {
    logger.info(`[Worker] Starting job: ${job.name} (${job.id}) for project: ${job.data.projectId}`);
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
      logger.error(`[Worker] Job ${job.name} failed:`, error);
      
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
  { connection: connection as any, concurrency: 2, maxStalledCount: 3 }
);

worker.on('completed', (job) => logger.info(`[Worker] Completed: ${job.name} (${job.id})`));
worker.on('failed', (job, err) => logger.error(`[Worker] Failed: ${job?.name}:`, err?.message));
worker.on('error', (err) => logger.error('[Worker] Error:', err));

logger.info('[Worker] Video generation worker started');

// Keep the process running
process.on('SIGINT', async () => {
  logger.info('Shutting down worker...');
  await worker.close();
  process.exit(0);
});
