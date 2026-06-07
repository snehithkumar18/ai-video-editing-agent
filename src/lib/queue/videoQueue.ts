import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { createClient } from '../supabase/server';
import logger from '../logger';

const isRedisConfigured = !!process.env.UPSTASH_REDIS_REST_URL;

const connection = isRedisConfigured
  ? new Redis(process.env.UPSTASH_REDIS_REST_URL!, {
      password: process.env.UPSTASH_REDIS_REST_TOKEN!,
      tls: {},
      maxRetriesPerRequest: null,
    })
  : null;

export const videoQueue = isRedisConfigured
  ? new Queue('video-generation', {
      connection: connection!,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 200,
        attempts: 3,
        backoff: { type: 'exponential', delay: 10000 },
      },
    })
  : ({
      add: async (name: string, data: { projectId?: string }) => {
        logger.info(`[Mock Queue] Adding job ${name} with data:`, data);
        
        const projectId = data.projectId;
        if (!projectId) {
          throw new Error('projectId is required for mock queue jobs');
        }
        const supabase = await createClient();
        
        setTimeout(async () => {
          try {
            await supabase.from('projects').update({ render_progress: 10 }).eq('id', projectId);
            await new Promise(r => setTimeout(r, 1000));
            
            await supabase.from('projects').update({ render_progress: 35 }).eq('id', projectId);
            await new Promise(r => setTimeout(r, 1000));
            
            await supabase.from('projects').update({ render_progress: 70 }).eq('id', projectId);
            await new Promise(r => setTimeout(r, 1000));
            
            await supabase.from('projects').update({ render_progress: 95 }).eq('id', projectId);
            await new Promise(r => setTimeout(r, 1000));
            
            await supabase.from('projects').update({
              status: 'complete',
              render_progress: 100,
              final_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-talking-to-camera-40156-large.mp4'
            }).eq('id', projectId);
            
            logger.info(`[Mock Queue] Completed export job for project ${projectId}`);
          } catch (e) {
            logger.error('Error in mock export runner:', e);
          }
        }, 1000);
        
        return { id: 'mock-job-' + Date.now() };
      }
    } as any);

export const JOB_NAMES = {
  GENERATE_VOICE: 'GENERATE_VOICE',
  GENERATE_LIPSYNC: 'GENERATE_LIPSYNC',
  GENERATE_CAPTIONS: 'GENERATE_CAPTIONS',
  FETCH_BROLL: 'FETCH_BROLL',
  ASSEMBLE_VIDEO: 'ASSEMBLE_VIDEO',
};

