import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  Audio,
  Loop,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from 'remotion';
import { KineticCaptions, WordItem } from '../../../claude_skill_reel/src/components/KineticCaptions';
import { BackgroundLayer } from '../../../claude_skill_reel/src/components/BackgroundLayer';
import { UserAnimationAvatar } from '../../../claude_skill_reel/src/components/UserAnimationAvatar';
import { DirectedScene } from '@/lib/services/sceneDirectorService';

export interface SplitScreenReelProps {
  timeline?: any;
  presenterCutoutSrc?: string;
  topicTitle?: string;
}

export const SplitScreenMasterComposition: React.FC<SplitScreenReelProps> = ({
  timeline,
  presenterCutoutSrc = '/spiderman_video.mp4',
  topicTitle = 'AI VIDEO GENERATION',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioTrack = timeline?.tracks?.find((t: any) => t.type === 'audio');
  const brollTrack = timeline?.tracks?.find((t: any) => t.id === 'broll-track');
  const avatarTrack = timeline?.tracks?.find((t: any) => t.id === 'avatar-track');
  const captionTrack = timeline?.tracks?.find((t: any) => t.type === 'captions');
  const musicTrack = timeline?.tracks?.find((t: any) => t.type === 'music');

  const resolveAsset = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    const clean = src.startsWith('/') ? src.slice(1) : src;
    try {
      return staticFile(clean);
    } catch {
      return src;
    }
  };

  const rawAudioUrl = audioTrack?.clips?.[0]?.assetUrl || 'project-assets/local-1793704545009-c8d9gi/voice_audio_1793708159643.mp3';
  const audioSrc = resolveAsset(rawAudioUrl);
  
  // Use the original Spider-Man video with background filling the entire bottom half
  const rawAvatarUrl = avatarTrack?.clips?.[0]?.assetUrl || presenterCutoutSrc;
  const avatarVideoSrc = resolveAsset(
    (rawAvatarUrl && rawAvatarUrl.match(/\.(mp4|webm)/i) && !rawAvatarUrl.includes('mixkit'))
      ? rawAvatarUrl
      : 'spiderman_video.mp4'
  );

  const rawMusicUrl = musicTrack?.clips?.[0]?.assetUrl || 'audio/music/chill_lofi.wav';
  const musicSrc = resolveAsset(rawMusicUrl);

  // Directed Scenes metadata from AI pipeline
  const directedScenes: DirectedScene[] = timeline?.metadata?.directedScenes || [];
  const brollClips = brollTrack?.clips || [];
  const totalDuration = timeline?.duration || 38.72;

  // Ensure activeScenes ALWAYS has rich waterfall motion graphic scenes
  const activeScenes: DirectedScene[] = (directedScenes && directedScenes.length > 0)
    ? directedScenes
    : [
        {
          sceneIndex: 1,
          start: 0,
          end: 6.5,
          duration: 6.5,
          textSegment: "Stop wasting hundreds of hours editing videos manually",
          visualType: 'hybrid',
          stockKeywords: ['video editor', 'frustrated'],
          stockVideoUrl: brollClips[0]?.assetUrl || 'https://videos.pexels.com/video-files/8100345/8100345-hd_720_1366_25fps.mp4',
          motionGraphicTitle: 'MANUAL EDITING IS OBSOLETE',
          motionGraphicSubtitle: '10+ Hours Per Video Wasted On Repetitive Cuts',
          motionGraphicBadge: '⚠️ THE BOTTLENECK',
          accentColor: '#F95738',
        },
        {
          sceneIndex: 2,
          start: 6.5,
          end: 13.0,
          duration: 6.5,
          textSegment: "In 2026, AI video pipelines handle the entire workflow",
          visualType: 'motion_graphics',
          stockKeywords: ['code generation', 'ai'],
          motionGraphicTitle: 'THE AUTONOMOUS AGENT WORKFLOW',
          motionGraphicSubtitle: '$ npx ai-agent generate --format split-screen',
          motionGraphicBadge: '⚡ STEP 1: ONE-CLICK GENERATION',
          accentColor: '#38BDF8',
        },
        {
          sceneIndex: 3,
          start: 13.0,
          end: 21.0,
          duration: 8.0,
          textSegment: "Auto B-roll, lifelike studio voice, and kinetic captions",
          visualType: 'hybrid',
          stockKeywords: ['neural network', 'digital data'],
          stockVideoUrl: brollClips[1]?.assetUrl || 'https://videos.pexels.com/video-files/18069700/18069700-hd_1080_1920_24fps.mp4',
          motionGraphicTitle: 'INTELLIGENT MULTI-LAYER COMPOSITION',
          motionGraphicSubtitle: 'Synced 4K B-Roll • Studio Voice • Dynamic Motion',
          motionGraphicBadge: '🎙️ STEP 2: MULTI-MODAL SYNC',
          accentColor: '#A855F7',
        },
        {
          sceneIndex: 4,
          start: 21.0,
          end: 29.5,
          duration: 8.5,
          textSegment: "The split-screen format keeps viewers hooked till the last second",
          visualType: 'motion_graphics',
          stockKeywords: ['motion graphics', 'animation'],
          motionGraphicTitle: 'HIGH RETENTION SPLIT-SCREEN',
          motionGraphicSubtitle: 'Top 50% Motion Graphics + Bottom 50% Host Video',
          motionGraphicBadge: '📈 STEP 3: 92% COMPLETION RATE',
          accentColor: '#10B981',
        },
        {
          sceneIndex: 5,
          start: 29.5,
          end: totalDuration,
          duration: Math.max(1, totalDuration - 29.5),
          textSegment: "Start automating your video production today",
          visualType: 'hybrid',
          stockKeywords: ['fast forward', 'studio'],
          stockVideoUrl: brollClips[2]?.assetUrl || 'https://videos.pexels.com/video-files/31623227/13473116_360_640_24fps.mp4',
          motionGraphicTitle: 'SCALE YOUR CHANNELS ON AUTOPILOT',
          motionGraphicSubtitle: 'TikTok • YouTube Shorts • Instagram Reels',
          motionGraphicBadge: '🚀 10X OUTPUT AT ZERO COST',
          accentColor: '#EC4899',
        },
      ];

  // Kinetic captions words
  const words: WordItem[] = (captionTrack?.clips || []).map((c: any) => ({
    word: c.word || '',
    start: c.start || 0,
    end: c.end || 0,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', overflow: 'hidden' }}>
      {/* 1. Base Textured Canvas Layer */}
      <BackgroundLayer />

      {/* ======================================================================= */}
      {/* TOP 50% (Y: 0 - 960): DYNAMIC MOTION GRAPHICS & STOCK B-ROLL STAGE      */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 960,
          overflow: 'hidden',
          zIndex: 10,
          backgroundColor: '#F4F1EA',
        }}
      >
        {/* Render intelligent directed scenes with sequential waterfall elements */}
        {activeScenes.map((scene, idx) => {
          const from = Math.round(scene.start * fps);
          const durationInFrames = Math.max(1, Math.round(scene.duration * fps));

          return (
            <Sequence key={`scene_${idx}`} from={from} durationInFrames={durationInFrames}>
              <SplitScreenWaterfallScene 
                scene={scene} 
                totalScenes={activeScenes.length} 
                sceneNumber={idx + 1} 
              />
            </Sequence>
          );
        })}

        {/* =================================================================== */}
        {/* SYNCHRONIZED SEQUENTIAL SOUND EFFECTS (ONE-BY-ONE ELEMENT ARRIVALS)   */}
        {/* =================================================================== */}
        {activeScenes.map((scene, idx) => {
          const startF = Math.round(scene.start * fps);
          return (
            <React.Fragment key={`sfx_group_${idx}`}>
              {/* Scene Cut Transition Whoosh (if not the very first scene) */}
              {idx > 0 && (
                <Sequence from={Math.max(0, startF - 4)} durationInFrames={18}>
                  <Audio src={resolveAsset('audio/sfx/whoosh.wav')} volume={0.16} />
                </Sequence>
              )}

              {/* Element 1: Category/Step Badge Pop */}
              <Sequence from={startF} durationInFrames={14}>
                <Audio src={resolveAsset('audio/sfx/pop.wav')} volume={0.12} />
              </Sequence>

              {/* Element 2: Headline Slide Whoosh */}
              <Sequence from={startF + 10} durationInFrames={16}>
                <Audio src={resolveAsset('audio/sfx/whoosh.wav')} volume={0.14} />
              </Sequence>

              {/* Element 3: Primary Visual Card Pop */}
              <Sequence from={startF + 24} durationInFrames={14}>
                <Audio src={resolveAsset('audio/sfx/pop.wav')} volume={0.12} />
              </Sequence>

              {/* Element 4: Sub-item / Code Line Click */}
              <Sequence from={startF + 42} durationInFrames={10}>
                <Audio src={resolveAsset('audio/sfx/click.wav')} volume={0.14} />
              </Sequence>

              {/* Element 5: Secondary Sub-item Click */}
              <Sequence from={startF + 58} durationInFrames={10}>
                <Audio src={resolveAsset('audio/sfx/click.wav')} volume={0.14} />
              </Sequence>

              {/* Element 6: Stat / Metric Badge Chime */}
              <Sequence from={startF + 72} durationInFrames={20}>
                <Audio src={resolveAsset('audio/sfx/ding.wav')} volume={0.16} />
              </Sequence>
            </React.Fragment>
          );
        })}
      </div>

      {/* ======================================================================= */}
      {/* BOTTOM 50% (Y: 960 - 1920): FULL-BLEED TALKING VIDEO WITH BACKGROUND    */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 960,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 20,
          backgroundColor: '#0F172A',
        }}
      >
        <Loop durationInFrames={240}>
          <Video
            src={avatarVideoSrc}
            onError={(e) => console.warn('Spider-Man video playback fallback:', e)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
            }}
            volume={0}
          />
        </Loop>
        {/* Subtle top seam gradient to frame the split line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ======================================================================= */}
      {/* MIDDLE SEAM (Y: 900 - 1020): KINETIC WORD-BY-WORD HIGHLIGHT CAPTIONS   */}
      {/* ======================================================================= */}
      <KineticCaptions 
        words={words} 
        color="#FFFFFF" 
        activeColor="#F95738" 
        positionMode="middle" 
      />

      {/* ======================================================================= */}
      {/* AUDIO: BACKGROUND VIRAL MUSIC & SPOKEN VOICEOVER                        */}
      {/* ======================================================================= */}
      <Audio src={musicSrc} volume={0.12} loop />
      <Audio src={audioSrc} volume={1.0} />
    </AbsoluteFill>
  );
};

/**
 * Intelligent Top-Half Scene Component:
 * Renders multiple rich motion graphic and stock B-roll elements that arrive
 * SEQUENTIALLY ONE-BY-ONE according to the script timeline.
 */
const SplitScreenWaterfallScene: React.FC<{
  scene: DirectedScene;
  totalScenes: number;
  sceneNumber: number;
}> = ({ scene, totalScenes, sceneNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sequential Waterfall Springs (Elements arrive one by one):
  // 1. Category / Step Badge (Frame 0-14)
  const spring1 = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 130, mass: 0.7 },
  });

  // 2. Main Headline (Frame 10-26)
  const spring2 = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.8 },
  });

  // 3. Primary Card (Frame 24-42)
  const spring3 = spring({
    frame: frame - 24,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.75 },
  });

  // 4. Sub-item 1 / Code Line 1 (Frame 42-58)
  const spring4 = spring({
    frame: frame - 42,
    fps,
    config: { damping: 12, stiffness: 125, mass: 0.7 },
  });

  // 5. Sub-item 2 / Code Line 2 (Frame 58-74)
  const spring5 = spring({
    frame: frame - 58,
    fps,
    config: { damping: 12, stiffness: 125, mass: 0.7 },
  });

  // 6. Floating KPI / Metric Badge (Frame 72-90)
  const spring6 = spring({
    frame: frame - 72,
    fps,
    config: { damping: 11, stiffness: 135, mass: 0.6 },
  });

  // Micro-motion continuous physics so the scene performs without going stale
  const floatY1 = Math.sin((frame / fps) * 2.2) * 6;
  const floatY2 = Math.cos((frame / fps) * 2.5) * 6;

  const isLastScene = sceneNumber === totalScenes;
  const isCodeScene = scene.visualType === 'motion_graphics' && (sceneNumber === 2 || scene.motionGraphicTitle.toLowerCase().includes('agent') || scene.motionGraphicTitle.toLowerCase().includes('code') || scene.motionGraphicTitle.toLowerCase().includes('prompt'));
  const isPipelineScene = scene.visualType === 'motion_graphics' && (sceneNumber === 4 || scene.motionGraphicTitle.toLowerCase().includes('pipeline') || scene.motionGraphicTitle.toLowerCase().includes('render'));

  // ===========================================================================
  // SCENE 1: THE OLD WAY VS AUTOMATION (Stock B-Roll + Sequential Cards)
  // ===========================================================================
  if (sceneNumber === 1 || (scene.stockVideoUrl && sceneNumber <= 2)) {
    const zoom = interpolate(frame, [0, 240], [1.0, 1.06], { extrapolateRight: 'clamp' });

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Cinematic Stock Video Background */}
        {scene.stockVideoUrl && (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <Video
              src={scene.stockVideoUrl}
              onError={(e) => console.warn('B-roll playback warning:', e)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) brightness(0.92)' }}
              volume={0}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(15,23,42,0.45) 0%, transparent 60%, rgba(244,241,234,0.96) 100%)',
              }}
            />
          </div>
        )}

        {/* Content Container */}
        <div style={{ position: 'absolute', top: 50, left: 45, right: 45, zIndex: 20 }}>
          {/* Element 1: Category Badge (Frame 0) */}
          <div
            style={{
              transform: `scale(${spring1}) translateY(${(1 - spring1) * -18}px)`,
              opacity: spring1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              border: '1.5px solid #F95738',
              padding: '7px 20px',
              borderRadius: 30,
              boxShadow: '0 8px 24px rgba(249, 87, 56, 0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F95738' }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.08em' }}>
              ✦ AI VIDEO AUTOMATION PIPELINE
            </span>
          </div>

          {/* Element 2: Headline (Frame 10) */}
          <div
            style={{
              marginTop: 14,
              transform: `translateY(${(1 - spring2) * 20}px)`,
              opacity: spring2,
            }}
          >
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: '#1E1B4B',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0,
                textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif",
                textShadow: '0 2px 10px rgba(255,255,255,0.9)',
              }}
            >
              STOP MANUAL EDITING
            </h2>
          </div>

          {/* Element 3: Comparison Card 1 - Red Old Way (Frame 24) */}
          <div
            style={{
              marginTop: 18,
              transform: `scale(${spring3}) translateY(${floatY1}px)`,
              opacity: spring3,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid #FECACA',
              borderRadius: 18,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 12px 30px rgba(239, 68, 68, 0.12)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              ✕
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#991B1B' }}>THE HARD WAY</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Dragging keyframes & manual timeline cuts</div>
            </div>
          </div>

          {/* Element 4: Comparison Card 2 - Green AI Way (Frame 42) */}
          <div
            style={{
              marginTop: 12,
              transform: `scale(${spring4}) translateY(${floatY2}px)`,
              opacity: spring4,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid #A7F3D0',
              borderRadius: 18,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 12px 30px rgba(16, 185, 129, 0.12)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#166534' }}>THE AI AUTOMATION WAY</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#4B5563' }}>3-step prompt architecture with Remotion</div>
            </div>
          </div>

          {/* Element 5: Floating Stat Badge (Frame 72) */}
          <div
            style={{
              marginTop: 14,
              transform: `scale(${spring6})`,
              opacity: spring6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#1E2229',
              color: '#FBBF24',
              padding: '8px 18px',
              borderRadius: 24,
              fontSize: 12,
              fontWeight: 800,
              boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
            }}
          >
            <span>⚡ 98% TIME SAVED</span>
            <span style={{ color: '#94A3B8' }}>•</span>
            <span style={{ color: '#FFFFFF' }}>Instant Velocity</span>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // SCENE 2: STYLE 2 - SOFTWARE WALKTHROUGH (Screen & UI + Animated Cursor Click)
  // Matches Instagram Reference (@ai.akshu) with Ambient Neon Glow & Toggles
  // ===========================================================================
  if (isCodeScene || sceneNumber === 2) {
    // Cursor waypoint and click physics
    const cursorProgress = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const cursorX = interpolate(cursorProgress, [0, 1], [640, 480]);
    const cursorY = interpolate(cursorProgress, [0, 1], [280, 222]);
    const isClicked = frame >= 45;
    const clickRipple = isClicked ? spring({ frame: frame - 45, fps, config: { damping: 10, stiffness: 180 } }) : 0;

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 36,
        }}
      >
        {/* Vibrant Purple/Magenta Ambient Glow (Software Walkthrough signature) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.4) 0%, rgba(217, 70, 239, 0.2) 40%, rgba(11, 15, 25, 0.98) 80%)',
          }}
        />

        {/* Element 1: Step Pill (Frame 0) */}
        <div
          style={{
            transform: `scale(${spring1}) translateY(${(1 - spring1) * -16}px)`,
            opacity: spring1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#0F172A',
            border: '1.5px solid #C084FC',
            padding: '7px 20px',
            borderRadius: 30,
            marginBottom: 10,
            boxShadow: '0 8px 25px rgba(192, 132, 252, 0.3)',
            zIndex: 10,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#C084FC' }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.08em' }}>
            ✦ STEP 01: PROMPT INTO AUTOMATION
          </span>
        </div>

        {/* Element 2: Headline (Frame 10) */}
        <h2
          style={{
            transform: `translateY(${(1 - spring2) * 16}px)`,
            opacity: spring2,
            fontSize: 32,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: 14,
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
            textShadow: '0 4px 20px rgba(168,85,247,0.5)',
            zIndex: 10,
          }}
        >
          SOFTWARE WALKTHROUGH ENGINE
        </h2>

        {/* Element 3: Dark Mode App Window (Frame 24) */}
        <div
          style={{
            transform: `scale(${spring3}) translateY(${floatY1}px)`,
            opacity: spring3,
            width: 780,
            backgroundColor: 'rgba(17, 24, 39, 0.94)',
            borderRadius: 20,
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.15)',
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
            zIndex: 10,
            position: 'relative',
          }}
        >
          {/* App Window Header Bar */}
          <div
            style={{
              height: 38,
              backgroundColor: '#1E293B',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              gap: 8,
            }}
          >
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#27C93F' }} />
            <span style={{ marginLeft: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
              AI Video Director Studio v2.4
            </span>
          </div>

          {/* App Body: Prompt input + Interactive Toggles */}
          <div style={{ padding: '16px 20px' }}>
            {/* Prompt Box */}
            <div
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: 12,
                padding: '10px 14px',
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 4 }}>SYSTEM PROMPT</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#38BDF8' }}>
                $ ai generate --script "Viral AI Workflow" --layout split-screen --style 4k
              </div>
            </div>

            {/* Toggle rows matching Instagram Reference */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              {/* Toggle 1: Generate with Credits */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC' }}>Generate with Credits</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>Unlimited Pro Access</div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: '#7C3AED',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                </div>
              </div>

              {/* Toggle 2: Sound Effects & Motion (Clicked by cursor!) */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: isClicked ? 'rgba(124, 58, 237, 0.15)' : '#0F172A',
                  border: isClicked ? '1.5px solid #A855F7' : '1px solid #334155',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  boxShadow: isClicked ? '0 0 20px rgba(168,85,247,0.3)' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC' }}>Sound Effects & Motion</div>
                  <div style={{ fontSize: 10, color: isClicked ? '#C084FC' : '#94A3B8' }}>
                    {isClicked ? 'Active • Synced' : 'Disabled'}
                  </div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: isClicked ? '#10B981' : '#475569',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isClicked ? 'flex-end' : 'flex-start',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hand Pointer Cursor (Oversized, matching @ai.akshu video!) */}
          <div
            style={{
              position: 'absolute',
              left: cursorX,
              top: cursorY,
              pointerEvents: 'none',
              transform: `scale(${isClicked ? 0.92 : 1})`,
              transition: 'transform 0.1s ease',
              zIndex: 30,
            }}
          >
            {/* Click Ripple Effect */}
            {isClicked && (
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: -12,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: '2px solid #A855F7',
                  transform: `scale(${clickRipple * 2.2})`,
                  opacity: 1 - clickRipple,
                  pointerEvents: 'none',
                }}
              />
            )}
            {/* SVG Hand Pointer */}
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 2L10 12M10 12L7.5 9.5C6.7 8.7 5.3 8.7 4.5 9.5C3.7 10.3 3.7 11.7 4.5 12.5L10 18C12 20 15 21 18 21C20.2 21 21 19.5 21 17V12C21 10.3 19.7 9 18 9C17.5 9 17 9.2 16.5 9.5M10 12L13.5 8.5C14.3 7.7 15.7 7.7 16.5 8.5"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#1E293B"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}
              />
            </svg>
          </div>
        </div>

        {/* Element 6: Floating Verification Pill (Frame 72) */}
        <div
          style={{
            marginTop: 16,
            transform: `scale(${spring6}) translateY(${floatY2}px)`,
            opacity: spring6,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1.5px solid #E2E8F0',
            borderRadius: 20,
            padding: '8px 20px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 15,
          }}
        >
          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 11, fontWeight: 900 }}>
            ✓
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B' }}>
            Zero Ambiguity • High Retention Prompt
          </span>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // SCENE 3: STEP 02 - DEPLOY AI AGENT (Tech Stack Badges + Progress)
  // ===========================================================================
  if (sceneNumber === 3) {
    const zoom = interpolate(frame, [0, 240], [1.0, 1.05], { extrapolateRight: 'clamp' });
    const progressBar = interpolate(frame, [45, 90], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {scene.stockVideoUrl && (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <Video
              src={scene.stockVideoUrl}
              onError={(e) => console.warn('B-roll playback warning:', e)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) brightness(0.92)' }}
              volume={0}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(15,23,42,0.45) 0%, transparent 60%, rgba(244,241,234,0.96) 100%)',
              }}
            />
          </div>
        )}

        <div style={{ position: 'absolute', top: 50, left: 45, right: 45, zIndex: 20 }}>
          {/* Element 1: Step Pill (Frame 0) */}
          <div
            style={{
              transform: `scale(${spring1}) translateY(${(1 - spring1) * -16}px)`,
              opacity: spring1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#0F172A',
              border: '1.5px solid #A855F7',
              padding: '7px 20px',
              borderRadius: 30,
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.08em' }}>
              🤖 STEP 02: DEPLOY CLAUDE CODE
            </span>
          </div>

          {/* Element 2: Headline (Frame 10) */}
          <h2
            style={{
              transform: `translateY(${(1 - spring2) * 16}px)`,
              opacity: spring2,
              fontSize: 32,
              fontWeight: 900,
              color: '#1E1B4B',
              letterSpacing: '-0.02em',
              margin: '14px 0 0 0',
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif",
              textShadow: '0 2px 10px rgba(255,255,255,0.9)',
            }}
          >
            CODE GENERATES THE MOTION
          </h2>

          {/* Element 3: Claude Code Agent Card (Frame 24) */}
          <div
            style={{
              marginTop: 16,
              transform: `scale(${spring3}) translateY(${floatY1}px)`,
              opacity: spring3,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid #E9D5FF',
              borderRadius: 18,
              padding: '16px 22px',
              boxShadow: '0 15px 35px rgba(168, 85, 247, 0.12)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#6B21A8' }}>Claude Code Autonomous Remotion Rig</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#4B5563' }}>
              AI directly writes JavaScript animation physics, springs, and SVG transforms.
            </p>
          </div>

          {/* Element 4: Tech Stack Badges (Frame 42) */}
          <div
            style={{
              marginTop: 12,
              transform: `scale(${spring4})`,
              opacity: spring4,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {['React', 'Remotion', 'TypeScript', 'Whisper AI', 'Pexels HD'].map((tag, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  color: '#38BDF8',
                  padding: '5px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Element 5: Animated Live Progress Bar (Frame 58) */}
          <div
            style={{
              marginTop: 14,
              transform: `scale(${spring5})`,
              opacity: spring5,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '12px 18px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#1E1B4B', marginBottom: 6 }}>
              <span>Timeline Composition</span>
              <span style={{ color: '#10B981' }}>{Math.round(progressBar)}%</span>
            </div>
            <div style={{ height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${progressBar}%`, height: '100%', backgroundColor: '#10B981', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // SCENE 4: STEP 03 - 3-NODE CONNECTED WORKFLOW PIPELINE
  // ===========================================================================
  if (isPipelineScene || sceneNumber === 4) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 45,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 30%, rgba(249, 87, 56, 0.12) 0%, rgba(244, 241, 234, 1) 85%)',
          }}
        />

        {/* Element 1: Step Pill (Frame 0) */}
        <div
          style={{
            transform: `scale(${spring1}) translateY(${(1 - spring1) * -16}px)`,
            opacity: spring1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#0F172A',
            border: '1.5px solid #F95738',
            padding: '7px 20px',
            borderRadius: 30,
            marginBottom: 12,
            boxShadow: '0 8px 24px rgba(249, 87, 56, 0.25)',
            zIndex: 10,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F95738' }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.08em' }}>
            ✦ STEP 03: INSTANT RENDER PIPELINE
          </span>
        </div>

        {/* Element 2: Headline (Frame 10) */}
        <h2
          style={{
            transform: `translateY(${(1 - spring2) * 16}px)`,
            opacity: spring2,
            fontSize: 32,
            fontWeight: 900,
            color: '#1E1B4B',
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: 20,
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
            zIndex: 10,
          }}
        >
          DIRECT RENDER TO 4K MP4
        </h2>

        {/* 3-Node Connected Pipeline - Elements 3, 4, 5 arriving sequentially */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            width: 780,
            zIndex: 10,
            transform: `translateY(${floatY1}px)`,
          }}
        >
          {/* Element 3: Node 1 (Frame 24) */}
          <div
            style={{
              flex: 1,
              transform: `scale(${spring3})`,
              opacity: spring3,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              borderRadius: 18,
              padding: '16px 12px',
              textAlign: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 4 }}>📝</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>PROMPT</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Natural Script</div>
          </div>

          {/* Connector 1 */}
          <div style={{ opacity: spring4, fontSize: 22, color: '#F95738', fontWeight: 900 }}>⚡➔</div>

          {/* Element 4: Node 2 (Frame 42) */}
          <div
            style={{
              flex: 1.2,
              transform: `scale(${spring4})`,
              opacity: spring4,
              backgroundColor: '#1E2229',
              border: '2px solid #F95738',
              borderRadius: 18,
              padding: '18px 14px',
              textAlign: 'center',
              boxShadow: '0 16px 36px rgba(249, 87, 56, 0.22)',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>⚙️</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF' }}>REMOTION AI</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F95738' }}>Code Engine</div>
          </div>

          {/* Connector 2 */}
          <div style={{ opacity: spring5, fontSize: 22, color: '#10B981', fontWeight: 900 }}>⚡➔</div>

          {/* Element 5: Node 3 (Frame 58) */}
          <div
            style={{
              flex: 1,
              transform: `scale(${spring5})`,
              opacity: spring5,
              backgroundColor: '#FFFFFF',
              border: '2px solid #10B981',
              borderRadius: 18,
              padding: '16px 12px',
              textAlign: 'center',
              boxShadow: '0 12px 30px rgba(16, 185, 129, 0.12)',
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 4 }}>🎬</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>VIRAL MP4</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>Instant Output</div>
          </div>
        </div>

        {/* Element 6: Bottom KPI Banner (Frame 72) */}
        <div
          style={{
            marginTop: 24,
            transform: `scale(${spring6}) translateY(${floatY2}px)`,
            opacity: spring6,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            border: '1.5px solid #E5E3EB',
            borderRadius: 20,
            padding: '14px 32px',
            boxShadow: '0 12px 35px rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
            ZERO TIMELINE DRAGGING • 100% AUTOMATED
          </span>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // SCENE 5: SCALE YOUR PRODUCTION (Stock B-Roll + Growth Metrics)
  // ===========================================================================
  if (sceneNumber === 5) {
    const zoom = interpolate(frame, [0, 240], [1.0, 1.05], { extrapolateRight: 'clamp' });

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {scene.stockVideoUrl && (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <Video
              src={scene.stockVideoUrl}
              onError={(e) => console.warn('B-roll playback warning:', e)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) brightness(0.92)' }}
              volume={0}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(15,23,42,0.45) 0%, transparent 60%, rgba(244,241,234,0.96) 100%)',
              }}
            />
          </div>
        )}

        <div style={{ position: 'absolute', top: 50, left: 45, right: 45, zIndex: 20 }}>
          {/* Element 1: Scale Badge (Frame 0) */}
          <div
            style={{
              transform: `scale(${spring1}) translateY(${(1 - spring1) * -16}px)`,
              opacity: spring1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#0F172A',
              border: '1.5px solid #10B981',
              padding: '7px 20px',
              borderRadius: 30,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.08em' }}>
              📈 SCALE YOUR PRODUCTION
            </span>
          </div>

          {/* Element 2: Headline (Frame 10) */}
          <h2
            style={{
              transform: `translateY(${(1 - spring2) * 16}px)`,
              opacity: spring2,
              fontSize: 32,
              fontWeight: 900,
              color: '#1E1B4B',
              letterSpacing: '-0.02em',
              margin: '14px 0 0 0',
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif",
              textShadow: '0 2px 10px rgba(255,255,255,0.9)',
            }}
          >
            10X CONTENT VELOCITY
          </h2>

          {/* Element 3: Growth Metric 1 (Frame 24) */}
          <div
            style={{
              marginTop: 16,
              transform: `scale(${spring3}) translateY(${floatY1}px)`,
              opacity: spring3,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid #BBF7D0',
              borderRadius: 18,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 12px 30px rgba(16, 185, 129, 0.12)',
            }}
          >
            <span style={{ fontSize: 26 }}>🚀</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#166534' }}>10X MORE VIDEO OUTPUT</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Generate high-retention shorts in seconds</div>
            </div>
          </div>

          {/* Element 4: Growth Metric 2 (Frame 42) */}
          <div
            style={{
              marginTop: 12,
              transform: `scale(${spring4}) translateY(${floatY2}px)`,
              opacity: spring4,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid #E2E8F0',
              borderRadius: 18,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 26 }}>💰</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>90% LOWER PRODUCTION COST</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Full studio quality without an editing team</div>
            </div>
          </div>

          {/* Element 5: Proven Formula Pill (Frame 72) */}
          <div
            style={{
              marginTop: 14,
              transform: `scale(${spring6})`,
              opacity: spring6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#1E2229',
              color: '#10B981',
              padding: '8px 18px',
              borderRadius: 24,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            ★ PROVEN HIGH RETENTION SPLIT-SCREEN FORMULA
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // SCENE 6: FINALE & CALL TO ACTION (Stop Editing. Start Directing.)
  // ===========================================================================
  if (isLastScene || sceneNumber >= 6) {
    const pulseScale = 1 + Math.sin((frame / fps) * 4) * 0.03;

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 25,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(249, 87, 56, 0.16) 0%, rgba(244, 241, 234, 1) 85%)',
          }}
        />

        {/* Element 1: Category Pill (Frame 0) */}
        <div
          style={{
            transform: `scale(${spring1})`,
            opacity: spring1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#1E2229',
            color: '#F95738',
            padding: '7px 22px',
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 10,
          }}
        >
          ✦ MASTER AI VIDEO AUTOMATION
        </div>

        {/* Element 2: Dual Punchline Typography (Frames 10 and 24) */}
        <div style={{ textAlign: 'center', zIndex: 10, marginBottom: 22 }}>
          <div
            style={{
              transform: `translateY(${(1 - spring2) * 20}px)`,
              opacity: spring2,
              fontFamily: "'Inter', sans-serif",
              fontSize: 52,
              fontWeight: 900,
              color: '#1E1B4B',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            STOP EDITING.
          </div>
          <div
            style={{
              transform: `scale(${spring3}) translateY(${(1 - spring3) * 16}px)`,
              opacity: spring3,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 58,
              fontWeight: 900,
              color: '#F95738',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginTop: 4,
              textShadow: '0 4px 18px rgba(249, 87, 56, 0.35)',
            }}
          >
            START DIRECTING.
          </div>
        </div>

        {/* Element 3: Action Button with Glowing Pulse (Frame 42) */}
        <div
          style={{
            transform: `scale(${spring4 * pulseScale})`,
            opacity: spring4,
            backgroundColor: '#F95738',
            color: '#FFFFFF',
            padding: '14px 34px',
            borderRadius: 40,
            fontFamily: "'Inter', sans-serif",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: '0.04em',
            boxShadow: '0 16px 40px rgba(249, 87, 56, 0.40)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 10,
          }}
        >
          <span>FOLLOW TO LEARN MORE</span>
          <span style={{ fontSize: 18 }}>➔</span>
        </div>

        {/* Element 4: Floating Verification Pill (Frame 72) */}
        <div
          style={{
            marginTop: 16,
            transform: `scale(${spring6}) translateY(${floatY2}px)`,
            opacity: spring6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E5E3EB',
            borderRadius: 20,
            padding: '6px 18px',
            fontSize: 12,
            fontWeight: 700,
            color: '#4B5563',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
            zIndex: 10,
          }}
        >
          ★ Save This Reel & Build Your Engine
        </div>
      </div>
    );
  }

  // Fallback Motion Graphics Scene
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 60,
      }}
    >
      <div
        style={{
          transform: `scale(${spring1})`,
          opacity: spring1,
          backgroundColor: '#0F172A',
          border: `1.5px solid ${scene.accentColor}`,
          padding: '7px 20px',
          borderRadius: 30,
          color: '#FFF',
          fontSize: 13,
          fontWeight: 800,
          marginBottom: 16,
        }}
      >
        {scene.motionGraphicBadge}
      </div>

      <div
        style={{
          transform: `scale(${spring2}) translateY(${floatY1}px)`,
          opacity: spring2,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: '24px 32px',
          maxWidth: 680,
          textAlign: 'center',
          boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ fontSize: 30, fontWeight: 900, color: '#1E1B4B', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
          {scene.motionGraphicTitle}
        </h2>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#4B5563', margin: 0 }}>
          {scene.motionGraphicSubtitle}
        </p>
      </div>
    </div>
  );
};
