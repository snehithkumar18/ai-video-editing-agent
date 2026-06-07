import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowProducer } from 'bullmq';
import Redis from 'ioredis';
import { JOB_NAMES } from '@/lib/queue/videoQueue';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis as UpstashRedis } from '@upstash/redis';
import logger from '@/lib/logger';

const isRedisConfigured = !!process.env.UPSTASH_REDIS_REST_URL;

type MockFlow = {
  data: {
    projectId?: string;
  };
};

const connection = isRedisConfigured
  ? new Redis(process.env.UPSTASH_REDIS_REST_URL!, {
      password: process.env.UPSTASH_REDIS_REST_TOKEN!,
      tls: {},
      maxRetriesPerRequest: null,
    })
  : null;

const flowProducer = isRedisConfigured
  ? new FlowProducer({ connection: connection! })
  : ({
      add: async (flow: MockFlow) => {
        logger.info('[Mock FlowProducer] Adding flow:', flow);
        const projectId = flow.data.projectId;
        if (!projectId) {
          throw new Error('projectId is required for mock flow jobs');
        }
        
        setTimeout(async () => {
          try {
            const supabase = await createClient();
            
            await supabase.from('projects').update({ status: 'generating', render_progress: 20 }).eq('id', projectId);
            await new Promise(r => setTimeout(r, 1000));
            
            await supabase.from('projects').update({ render_progress: 50 }).eq('id', projectId);
            await new Promise(r => setTimeout(r, 1000));
            
            await supabase.from('projects').update({ render_progress: 80 }).eq('id', projectId);
            await new Promise(r => setTimeout(r, 1000));
            
            const timelineJson = {
              tracks: [
                {
                  id: 'track-avatar',
                  type: 'video',
                  name: 'Avatar Track',
                  clips: [
                    {
                      id: 'clip-avatar-1',
                      type: 'video',
                      name: 'Avatar Presenter',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-talking-to-camera-40156-large.mp4',
                      start: 0,
                      end: 15,
                      duration: 15,
                      volume: 1,
                      opacity: 1
                    }
                  ]
                },
                {
                  id: 'track-audio',
                  type: 'audio',
                  name: 'Voice Track',
                  clips: [
                    {
                      id: 'clip-voice-1',
                      type: 'audio',
                      name: 'Voiceover',
                      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                      start: 0,
                      end: 15,
                      duration: 15,
                      volume: 1
                    }
                  ]
                },
                {
                  id: 'track-captions',
                  type: 'captions',
                  name: 'Captions Track',
                  clips: [
                    {
                      id: 'caption-1',
                      type: 'text',
                      text: 'Welcome to VidAgent!',
                      start: 0,
                      end: 3,
                      style: { fontSize: 24, color: '#ffffff', backgroundColor: '#00000088' }
                    },
                    {
                      id: 'caption-2',
                      type: 'text',
                      text: 'This is a fully automated AI video editor.',
                      start: 3,
                      end: 8,
                      style: { fontSize: 24, color: '#ffffff', backgroundColor: '#00000088' }
                    },
                    {
                      id: 'caption-3',
                      type: 'text',
                      text: 'You can edit this timeline directly using text prompts.',
                      start: 8,
                      end: 15,
                      style: { fontSize: 24, color: '#ffffff', backgroundColor: '#00000088' }
                    }
                  ]
                }
              ],
              duration: 15
            };
            
            await supabase.from('projects').update({
              status: 'editing',
              render_progress: 100,
              timeline_json: timelineJson
            }).eq('id', projectId);
            
            logger.info(`[Mock FlowProducer] Completed flow for project ${projectId}`);
          } catch (e) {
            logger.error('Error in mock flow runner:', e);
          }
        }, 1000);
        
        return { id: 'mock-flow-' + Date.now() };
      }
    });


// Rate limit: 5 video generation requests per hour per user
const ratelimit = new Ratelimit({
  redis: new UpstashRedis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  }),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    try {
      const { success } = await ratelimit.limit(`generate_${user.id}`);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded. You can generate up to 5 videos per hour.' }, { status: 429 });
      }
    } catch (e) {
      logger.warn('Ratelimit check skipped/failed', e);
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    // 2. Get project, verify ownership, verify status is 'draft'
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    if (project.status !== 'draft' && project.status !== 'failed') {
      return NextResponse.json({ success: false, error: 'Project must be in draft status to generate' }, { status: 400 });
    }

    // 3. Verify voice_profile_id and avatar_profile_id
    if (!project.voice_profile_id || !project.avatar_profile_id) {
      return NextResponse.json({ success: false, error: 'Voice and avatar profiles must be selected' }, { status: 400 });
    }

    // Check profiles are ready
    const { data: avatar } = await supabase.from('avatar_profiles').select('status').eq('id', project.avatar_profile_id).single();
    if (avatar?.status !== 'ready') {
      return NextResponse.json({ success: false, error: 'Avatar profile is not ready' }, { status: 400 });
    }

    const script = project.script_optimized || project.script_raw;
    if (!script) {
      return NextResponse.json({ success: false, error: 'Project script is empty' }, { status: 400 });
    }

    // 4. Check user has render_credits > 0
    const { data: userData } = await supabase
      .from('users')
      .select('render_credits')
      .eq('id', user.id)
      .single();

    if ((userData?.render_credits || 0) <= 0) {
      return NextResponse.json({ success: false, error: 'Not enough render credits' }, { status: 403 });
    }

    // 5. Deduct 1 credit
    await supabase
      .from('users')
      .update({ render_credits: (userData?.render_credits || 0) - 1 })
      .eq('id', user.id);

    // 6. Update project status
    await supabase
      .from('projects')
      .update({ status: 'generating', render_progress: 0 })
      .eq('id', projectId);

    // 7. Add jobs using FlowProducer
    await flowProducer.add({
      name: JOB_NAMES.ASSEMBLE_VIDEO,
      queueName: 'video-generation',
      data: { projectId },
      children: [
        { 
          name: JOB_NAMES.GENERATE_LIPSYNC, 
          queueName: 'video-generation', 
          data: { projectId, avatarProfileId: project.avatar_profile_id }, 
          children: [
            { 
              name: JOB_NAMES.GENERATE_VOICE, 
              queueName: 'video-generation', 
              data: { projectId, script, voiceProfileId: project.voice_profile_id } 
            }
          ]
        },
        { 
          name: JOB_NAMES.GENERATE_CAPTIONS, 
          queueName: 'video-generation', 
          data: { projectId }, 
          children: [
            // Note: Since GENERATE_VOICE is identical in the graph, BullMQ handles deduplication natively 
            // if we provide a custom job ID, but for simplicity we rely on the parent-child structure.
            // Ideally we'd pass the audio URL directly, but the lip-sync job will pull from DB or we run Voice once and lip-sync/captions depend on it.
            // Using BullMQ FlowProducer, a single child can't easily be shared by two parents unless we use parent's parent.
            // So we'll have ASSEMBLE -> [LIPSYNC, CAPTIONS, BROLL], and LIPSYNC and CAPTIONS both fetch audio URL from DB that was generated by a prior step.
            // To make Voice run first before LIPSYNC/CAPTIONS, we can structure it: ASSEMBLE -> [LIPSYNC, CAPTIONS, BROLL] -> [VOICE]
            { 
              name: JOB_NAMES.GENERATE_VOICE, 
              queueName: 'video-generation', 
              data: { projectId, script, voiceProfileId: project.voice_profile_id } 
            }
          ]
        },
        { 
          name: JOB_NAMES.FETCH_BROLL, 
          queueName: 'video-generation', 
          data: { projectId, script } 
        }
      ]
    });

    return NextResponse.json({ success: true, data: { message: 'Generation started', projectId } });
  } catch (error) {
    logger.error('Generate Video Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
