import logger from '../logger';

// Job names used by both the flow producer and worker
export const JOB_NAMES = {
  GENERATE_VOICE: 'GENERATE_VOICE',
  GENERATE_LIPSYNC: 'GENERATE_LIPSYNC',
  GENERATE_CAPTIONS: 'GENERATE_CAPTIONS',
  FETCH_BROLL: 'FETCH_BROLL',
  ASSEMBLE_VIDEO: 'ASSEMBLE_VIDEO',
};

// Only create a real BullMQ Queue if Redis is configured
// Otherwise, the generate route handles inline processing
const isRedisConfigured = !!process.env.UPSTASH_REDIS_REST_URL;

let videoQueue: any;

if (isRedisConfigured) {
  // Dynamically import to avoid connection errors at module load time
  const Redis = require('ioredis');
  const { Queue } = require('bullmq');

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL!;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

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

  videoQueue = new Queue('video-generation', {
    connection,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 200,
      attempts: 3,
      backoff: { type: 'exponential', delay: 10000 },
    },
  });
} else {
  // Stub queue - not used when inline processing is active
  videoQueue = {
    add: async (name: string, data: any) => {
      logger.info(`[Stub Queue] Job ${name} would be queued. Inline processing handles this.`);
      return { id: 'stub-' + Date.now() };
    }
  };
}

export { videoQueue };
