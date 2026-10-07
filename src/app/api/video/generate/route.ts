import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JOB_NAMES } from '@/lib/queue/videoQueue';
import logger from '@/lib/logger';

const isRedisConfigured = !!process.env.UPSTASH_REDIS_REST_URL;

// Only create Redis/BullMQ connections when Redis is actually configured
let flowProducer: any;

if (isRedisConfigured) {
  const Redis = require('ioredis');
  const { FlowProducer } = require('bullmq');

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

  flowProducer = new FlowProducer({ connection: connection as any });
} else {
  // Inline processing - no Redis needed
  flowProducer = {
    add: async (flow: { data: { projectId?: string } }) => {
      const projectId = flow.data.projectId;
      if (!projectId) throw new Error('projectId is required');

      // Run inline processing in the background
      setTimeout(async () => {
        try {
          await runInlineVideoGeneration(projectId);
        } catch (e) {
          logger.error('[Inline Flow] Fatal error:', e);
        }
      }, 100);

      return { id: 'inline-flow-' + Date.now() };
    }
  };
}

/**
 * Inline video generation - runs all jobs sequentially without Redis.
 * Calls real APIs (Groq TTS, Pexels, Groq Whisper) and updates Supabase.
 */
async function runInlineVideoGeneration(projectId: string) {
  // Use admin client that bypasses RLS
  const { createClient: createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // Get project data
    const { data: project } = await supabase
      .from('projects')
      .select('*, voice_profiles:voice_profile_id(*), avatar_profiles:avatar_profile_id(*)')
      .eq('id', projectId)
      .single();

    if (!project) {
      logger.error(`[Inline Flow] Project not found: ${projectId}`);
      return;
    }

    const script = project.script_optimized || project.script_raw || '';

    // ===== STEP 1: Generate Voice (20%) =====
    logger.info(`[Inline Flow] Step 1/4: Generating voice for project ${projectId}`);
    await supabase.from('projects').update({ render_progress: 5 }).eq('id', projectId);
    await delay(1500);

    let audioUrl = '';
    let audioDuration = 15; // fallback
    try {
      const { generateSpeech } = await import('@/lib/services/voiceService');
      const voiceProfile = project.voice_profiles || { sample_url: 'af_bella', provider_voice_id: null };

      let audioBuffer: Buffer;
      let providerUsed = 'kokoro_tts';

      // Check if user uploaded their own voice note
      if (voiceProfile.sample_url && voiceProfile.sample_url.startsWith('http') && !voiceProfile.sample_url.includes('soundhelix')) {
        logger.info(`[Inline Flow] Using user's uploaded voice note: ${voiceProfile.sample_url}`);
        const voiceRes = await fetch(voiceProfile.sample_url);
        if (voiceRes.ok) {
          audioBuffer = Buffer.from(await voiceRes.arrayBuffer());
          audioUrl = voiceProfile.sample_url;
          providerUsed = 'user_voice_note';
        } else {
          // Fallback to synthesizing with Kokoro-TTS
          const gen = await generateSpeech(script, voiceProfile);
          audioBuffer = gen.audioBuffer;
          providerUsed = gen.providerUsed;
        }
      } else {
        // Synthesize voice from script using Kokoro-TTS
        const gen = await generateSpeech(script, voiceProfile);
        audioBuffer = gen.audioBuffer;
        providerUsed = gen.providerUsed;
      }

      logger.info(`[Inline Flow] Voice ready using provider: ${providerUsed}`);

      // Upload if not already a storage URL
      if (!audioUrl) {
        const { uploadBuffer } = await import('@/lib/services/storageService');
        const audioKey = `project-assets/${projectId}/voice_audio_${Date.now()}.mp3`;
        audioUrl = await uploadBuffer(audioBuffer, audioKey, 'audio/mpeg');
      }

      // Save as project asset
      await supabase.from('project_assets').insert({
        project_id: projectId,
        type: 'voice_audio',
        url: audioUrl,
        metadata: { providerUsed }
      });

      logger.info(`[Inline Flow] Voice audio active: ${audioUrl}`);
    } catch (voiceErr) {
      logger.warn('[Inline Flow] Voice generation failed, using placeholder audio', voiceErr);
      audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      await supabase.from('project_assets').insert({
        project_id: projectId,
        type: 'voice_audio',
        url: audioUrl,
        metadata: { fallback: true }
      });
    }
    await supabase.from('projects').update({ render_progress: 20 }).eq('id', projectId);
    await delay(1500);

    // ===== STEP 2: Fetch B-Roll (50%) =====
    logger.info(`[Inline Flow] Step 2/4: Fetching B-roll for project ${projectId}`);
    await supabase.from('projects').update({ render_progress: 30 }).eq('id', projectId);
    await delay(1500);

    const brollClips: any[] = [];
    try {
      // Extract scene keywords from script
      const scenes = script
        .split(/[.!?\n]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 8)
        .slice(0, 5);

      const searchTerms = scenes.length > 0 ? scenes : ['cinematic background', 'workspace', 'technology'];

      if (process.env.PEXELS_API_KEY) {
        for (const scene of searchTerms.slice(0, 3)) {
          try {
            const res = await fetch(
              `https://api.pexels.com/videos/search?query=${encodeURIComponent(scene)}&per_page=2&orientation=portrait`,
              { headers: { Authorization: process.env.PEXELS_API_KEY } }
            );
            if (res.ok) {
              const data = await res.json();
              if (data.videos?.length > 0) {
                const video = data.videos[0];
                const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];
                const clip = { keyword: scene, url: file.link, thumbnailUrl: video.image, duration: video.duration, source: 'pexels' };
                brollClips.push(clip);

                await supabase.from('project_assets').insert({
                  project_id: projectId,
                  type: 'broll_clip',
                  url: file.link,
                  metadata: clip
                });
              }
            }
          } catch (err) {
            logger.warn(`[Inline Flow] Pexels failed for: ${scene}`, err);
          }
        }
      }
    } catch (brollErr) {
      logger.warn('[Inline Flow] B-roll fetch failed', brollErr);
    }
    await supabase.from('projects').update({ render_progress: 50 }).eq('id', projectId);
    await delay(1500);

    // ===== STEP 3: Generate Captions (70%) =====
    logger.info(`[Inline Flow] Step 3/4: Generating captions for project ${projectId}`);
    await supabase.from('projects').update({ render_progress: 55 }).eq('id', projectId);
    await delay(1500);

    let captionsData: any[] = [];
    try {
      if (process.env.GROQ_API_KEY && audioUrl && !audioUrl.includes('soundhelix')) {
        // Download audio and transcribe with Groq Whisper
        const audioRes = await fetch(audioUrl);
        if (audioRes.ok) {
          const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
          const Groq = (await import('groq-sdk')).default;
          const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
          const file = new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' });
          
          const transcription = await groq.audio.transcriptions.create({
            file,
            model: 'whisper-large-v3',
            response_format: 'verbose_json',
            timestamp_granularities: ['word']
          });

          const words = ((transcription as any).words || []);
          captionsData = words.map((w: any) => ({
            id: `caption-${w.start}`,
            word: (w.word || '').trim(),
            start: w.start || 0,
            end: w.end || 0,
            duration: (w.end || 0) - (w.start || 0),
            locked: false,
            style: { fontSize: 48, fontWeight: 'bold', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.6)', animation: 'fadeIn', position: 'bottom' }
          }));
        }
      }
    } catch (captionErr) {
      logger.warn('[Inline Flow] Caption generation failed, using script-based fallback', captionErr);
    }

    // Fallback: generate captions from script text
    if (captionsData.length === 0) {
      const words = script.split(/\s+/).filter(Boolean);
      let currentTime = 0;
      captionsData = words.map((word: string, i: number) => {
        const dur = 0.4;
        const caption = { id: `caption-${i}`, word, start: currentTime, end: currentTime + dur, duration: dur, locked: false, style: { fontSize: 48, fontWeight: 'bold', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.6)', animation: 'fadeIn', position: 'bottom' } };
        currentTime += dur;
        return caption;
      });
      audioDuration = currentTime;
    }

    // Upload captions
    try {
      const { uploadBuffer } = await import('@/lib/services/storageService');
      const captionsBuffer = Buffer.from(JSON.stringify(captionsData), 'utf-8');
      const captionsKey = `project-assets/${projectId}/captions_${Date.now()}.json`;
      const captionUrl = await uploadBuffer(captionsBuffer, captionsKey, 'application/json');
      await supabase.from('project_assets').insert({
        project_id: projectId,
        type: 'caption_json',
        url: captionUrl,
        metadata: { wordCount: captionsData.length }
      });
    } catch (uploadErr) {
      logger.warn('[Inline Flow] Caption upload failed', uploadErr);
    }
    await supabase.from('projects').update({ render_progress: 70 }).eq('id', projectId);
    await delay(1500);

    // ===== STEP 4: Assemble Timeline (100%) =====
    logger.info(`[Inline Flow] Step 4/4: Assembling timeline for project ${projectId}`);
    await supabase.from('projects').update({ render_progress: 85 }).eq('id', projectId);
    await delay(1500);

    let avatarUrl = project.avatar_profiles?.processed_asset_url || 
      'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-talking-to-camera-40156-large.mp4';

    // If avatar is an image and audio is available, generate animated talking character video
    if (avatarUrl && avatarUrl.match(/\.(png|jpg|jpeg|webp)/i) && audioUrl) {
      try {
        logger.info(`[Inline Flow] Animating character image into talking video for project ${projectId}...`);
        const { generateTalkingCharacterVideo } = await import('@/lib/services/talkingCharacterService');
        const [imgRes, audioRes] = await Promise.all([fetch(avatarUrl), fetch(audioUrl)]);
        if (imgRes.ok && audioRes.ok) {
          const imgBuf = Buffer.from(await imgRes.arrayBuffer());
          const audioBuf = Buffer.from(await audioRes.arrayBuffer());
          const timestamps = captionsData.map((c: any) => ({
            word: c.word || '',
            start: c.start || 0,
            end: c.end || 0,
          }));
          const talkingVideoBuf = await generateTalkingCharacterVideo({
            imageBuffer: imgBuf,
            audioBuffer: audioBuf,
            timestamps,
          });
          const { uploadBuffer } = await import('@/lib/services/storageService');
          const videoKey = `project-assets/${projectId}/talking_character_${Date.now()}.mp4`;
          avatarUrl = await uploadBuffer(talkingVideoBuf, videoKey, 'video/mp4');
          logger.info(`[Inline Flow] Generated and uploaded talking character video: ${avatarUrl}`);

          await supabase.from('project_assets').insert({
            project_id: projectId,
            type: 'avatar_video',
            url: avatarUrl,
            metadata: { generated: true }
          });
        }
      } catch (animErr) {
        logger.warn('[Inline Flow] Talking character video generation fallback to client-side animation', animErr);
      }
    }

    const timelineJson = {
      version: '1.0',
      duration: audioDuration,
      fps: 30,
      width: 1080,
      height: 1920,
      tracks: [
        {
          id: 'avatar-track', type: 'video', label: 'Avatar', visible: true, locked: false,
          clips: [{ id: 'avatar-1', assetUrl: avatarUrl, start: 0, end: audioDuration, duration: audioDuration, locked: true, mouthYPercent: 46.2, motionIntensity: 1.0 }]
        },
        {
          id: 'broll-track', type: 'video', label: 'B-Roll', visible: true, locked: false,
          clips: brollClips.map((clip, i) => ({
            id: `broll-${i}`, assetUrl: clip.url,
            start: Math.min(i * 8, Math.max(0, audioDuration - 5)),
            end: Math.min(i * 8 + 8, audioDuration),
            duration: 8, opacity: 1.0, locked: false
          }))
        },
        {
          id: 'caption-track', type: 'captions', label: 'Captions', visible: true, locked: false,
          clips: captionsData
        },
        {
          id: 'audio-track', type: 'audio', label: 'Voice', visible: true, locked: false,
          clips: [{ id: 'voice-1', assetUrl: audioUrl, start: 0, end: audioDuration, duration: audioDuration, volume: 1.0, locked: true }]
        },
        {
          id: 'music-track', type: 'music', label: 'Background Music', visible: true, locked: false,
          clips: []
        }
      ]
    };

    // Final update: mark as editing with timeline
    await supabase.from('projects').update({
      status: 'editing',
      render_progress: 100,
      timeline_json: timelineJson,
      final_video_url: avatarUrl, // Use avatar as preview until full render
      duration_seconds: audioDuration
    }).eq('id', projectId);

    logger.info(`[Inline Flow] ✅ Completed video generation for project ${projectId}`);

  } catch (error) {
    logger.error(`[Inline Flow] Pipeline failed for project ${projectId}:`, error);
    await supabase.from('projects').update({
      status: 'failed',
      metadata: { error: String(error) }
    }).eq('id', projectId);
  }
}


// Rate limit: 5 video generation requests per hour per user
let ratelimitInstance: any = null;
async function getRatelimit() {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return {
      limit: async () => ({ success: true })
    };
  }

  if (!ratelimitInstance) {
    const limitPkg = '@upstash/ratelimit';
    const redisPkg = '@upstash/redis';
    const { Ratelimit } = eval('require')(limitPkg);
    const { Redis: UpstashRedis } = eval('require')(redisPkg);
    ratelimitInstance = new Ratelimit({
      redis: new UpstashRedis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
      }),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
    });
  }
  return ratelimitInstance;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check
    try {
      const limitInstance = await getRatelimit();
      const { success } = await limitInstance.limit(`generate_${user.id}`);
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

    // Use admin client for DB ops to avoid RLS issues in API routes
    const { createClient: createAdminClient } = await import('@/lib/supabase/admin');
    const adminSupabase = createAdminClient();

    // 2. Get project, verify ownership, verify status
    const { data: project, error: projectError } = await adminSupabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Allow draft, failed, AND stuck generating projects to be re-generated
    if (project.status !== 'draft' && project.status !== 'failed' && project.status !== 'generating') {
      return NextResponse.json({ success: false, error: 'Project must be in draft or failed status to generate' }, { status: 400 });
    }

    // 3. Verify voice_profile_id and avatar_profile_id
    if (!project.voice_profile_id || !project.avatar_profile_id) {
      return NextResponse.json({ success: false, error: 'Voice and avatar profiles must be selected' }, { status: 400 });
    }

    // Check profiles are ready
    const { data: avatar } = await adminSupabase.from('avatar_profiles').select('status').eq('id', project.avatar_profile_id).single();
    if (avatar?.status !== 'ready') {
      return NextResponse.json({ success: false, error: 'Avatar profile is not ready' }, { status: 400 });
    }

    const script = project.script_optimized || project.script_raw;
    if (!script) {
      return NextResponse.json({ success: false, error: 'Project script is empty' }, { status: 400 });
    }

    // 4. Atomically check and deduct 1 credit — skip if re-generating a stuck project
    if (project.status === 'draft') {
      const { data: deductResult, error: deductError } = await adminSupabase
        .rpc('deduct_render_credits', { p_user_id: user.id, p_cost: 1 });

      if (deductError || !deductResult) {
        return NextResponse.json(
          { success: false, error: 'Not enough render credits' },
          { status: 403 }
        );
      }
    }

    // 5. Clean up any old assets from failed/stuck runs
    await adminSupabase.from('project_assets').delete().eq('project_id', projectId);

    // 6. Update project status
    await adminSupabase
      .from('projects')
      .update({ status: 'generating', render_progress: 0, metadata: {} })
      .eq('id', projectId);

    // 7. Add jobs using FlowProducer (inline or BullMQ)
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
