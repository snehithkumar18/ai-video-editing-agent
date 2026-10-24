import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  Audio,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from 'remotion';

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

export interface ZoomReelProps {
  presenterSrc?: string;
  audioSrc?: string;
  timestamps?: CaptionWord[];
  presenterName?: string;
}

export const ZoomReelComposition: React.FC<ZoomReelProps> = ({
  presenterSrc = staticFile('presenter.jpg'),
  audioSrc = staticFile('speech_male.wav'),
  timestamps = [],
  presenterName = 'Alex J. (Presenter)',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTime = frame / fps;

  // 1. Determine currently spoken word
  const activeWordIndex = timestamps.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );
  const activeWord = activeWordIndex !== -1 ? timestamps[activeWordIndex] : null;
  const isSpeaking = !!activeWord;

  // 2. Background B-Roll Cutaways configuration (5 segments)
  const brollSegments = [
    { src: staticFile('broll/broll_1_intro.mp4'), from: 0, duration: 225 }, // 0s - 7.5s
    { src: staticFile('broll/broll_2_ai.mp4'), from: 225, duration: 270 }, // 7.5s - 16.5s
    { src: staticFile('broll/broll_3_type.mp4'), from: 495, duration: 270 }, // 16.5s - 25.5s
    { src: staticFile('broll/broll_4_audio.mp4'), from: 765, duration: 270 }, // 25.5s - 34.5s
    { src: staticFile('broll/broll_5_social.mp4'), from: 1035, duration: 440 }, // 34.5s - 49.2s
  ];

  // 3. Motion Graphics Callout Badges synced to script moments
  const motionBadges = [
    {
      from: 230,
      duration: 250, // 7.7s - 16.0s
      icon: '⚡',
      tag: 'AI ENGINE ACTIVATED',
      title: 'Do The Heavy Lifting',
      desc: 'Instant scripts, stock video & voice generation',
      gradient: 'linear-gradient(135deg, #7928CA 0%, #FF0080 100%)',
    },
    {
      from: 505,
      duration: 250, // 16.8s - 25.1s
      icon: '✍️',
      tag: 'SMART GENERATOR',
      title: 'Type 1 Idea ➔ Full Video',
      desc: 'Writes hook, main points & matches stock footage',
      gradient: 'linear-gradient(135deg, #0070F3 0%, #00DFD8 100%)',
    },
    {
      from: 775,
      duration: 250, // 25.8s - 34.1s
      icon: '🎙️',
      tag: 'DIGITAL VOICEOVER',
      title: '100+ Lifelike AI Voices',
      desc: 'Choose your style & convert raw text to voice',
      gradient: 'linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)',
    },
    {
      from: 1045,
      duration: 220, // 34.8s - 42.1s
      icon: '🚀',
      tag: 'VIRAL MULTI-FORMAT',
      title: 'TikTok • Reels • Shorts',
      desc: 'Save 10+ hours per week, create more, stress less',
      gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    },
    {
      from: 1275,
      duration: 195, // 42.5s - 49.0s
      icon: '✨',
      tag: 'GROW YOUR AUDIENCE',
      title: 'Hit Follow For More AI Tips',
      desc: 'Tap follow to master the new AI content stack',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    },
  ];

  // 4. Subtle presenter micro-gestures (breathing, speaking sway)
  const presenterSway = Math.sin(frame * 0.05) * 4;
  const presenterBreath = Math.sin(frame * 0.08) * 3;
  const presenterScale = 1.02 + (isSpeaking ? Math.sin(frame * 0.25) * 0.015 : Math.sin(frame * 0.06) * 0.008);

  // 5. Active microphone equalizer bars (4 bars)
  const eqBar1 = isSpeaking ? 16 + Math.abs(Math.sin(frame * 0.5)) * 16 : 6;
  const eqBar2 = isSpeaking ? 12 + Math.abs(Math.cos(frame * 0.6)) * 20 : 8;
  const eqBar3 = isSpeaking ? 18 + Math.abs(Math.sin(frame * 0.7)) * 14 : 5;
  const eqBar4 = isSpeaking ? 10 + Math.abs(Math.cos(frame * 0.4)) * 18 : 7;

  // 6. Kinetic Caption Phrase Chunking (3-4 words per group)
  // Find active word, or recently spoken word within a 0.5s pause window
  let effectiveWordIndex = activeWordIndex;
  if (effectiveWordIndex === -1) {
    const prevIdx = timestamps.findLastIndex((w) => w.end <= currentTime);
    if (prevIdx !== -1 && currentTime - timestamps[prevIdx].end < 0.6) {
      effectiveWordIndex = prevIdx;
    }
  }

  const wordsPerChunk = 4;
  const showCaptions = effectiveWordIndex !== -1;
  const currentChunkIndex = showCaptions ? Math.floor(effectiveWordIndex / wordsPerChunk) : 0;
  const currentPhraseWords = showCaptions
    ? timestamps.slice(
        currentChunkIndex * wordsPerChunk,
        currentChunkIndex * wordsPerChunk + wordsPerChunk
      )
    : [];

  return (
    <AbsoluteFill style={{ backgroundColor: '#05070A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ============================================================== */}
      {/* LAYER 1: CINEMATIC B-ROLL SEQUENCE                             */}
      {/* ============================================================== */}
      <AbsoluteFill>
        {brollSegments.map((seg, idx) => (
          <Sequence key={idx} from={seg.from} durationInFrames={seg.duration}>
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
              <Video
                src={seg.src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${1.05 + (frame - seg.from) * 0.00025})`,
                }}
                volume={0}
              />
            </div>
          </Sequence>
        ))}

        {/* Cinematic Scrim & Vignette Gradient */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(7, 10, 16, 0.72) 0%, rgba(7, 10, 16, 0.35) 40%, rgba(7, 10, 16, 0.82) 80%, rgba(7, 10, 16, 0.95) 100%)',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      {/* ============================================================== */}
      {/* LAYER 2: ZOOM MEETING / VIDEO CALL FLOATING PRESENTER CARD     */}
      {/* ============================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: (width - 860) / 2, // 110px
          width: 860,
          height: 600,
          borderRadius: 32,
          overflow: 'hidden',
          backgroundColor: '#0F141C',
          border: isSpeaking ? '2.5px solid #22C55E' : '2px solid rgba(255, 255, 255, 0.22)',
          boxShadow: isSpeaking
            ? '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(34, 197, 94, 0.55), inset 0 0 15px rgba(34, 197, 94, 0.2)'
            : '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 255, 255, 0.08)',
          transition: 'border 0.15s ease, box-shadow 0.15s ease',
          zIndex: 20,
        }}
      >
        {/* Presenter Portrait Image with Breathing & Sway */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${presenterScale}) translate(${presenterSway}px, ${presenterBreath}px)`,
            transformOrigin: 'center 40%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Img
            src={presenterSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
            }}
          />
        </div>

        {/* Zoom Top Bar (Meeting Title & Window Controls) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 48,
            backgroundColor: 'rgba(10, 14, 22, 0.78)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            zIndex: 10,
          }}
        >
          {/* Live Recording Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 10px #EF4444',
                opacity: Math.sin(frame * 0.1) > 0 ? 1 : 0.4,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#F87171',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              REC
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0', marginLeft: 6 }}>
              Zoom AI Studio
            </span>
          </div>

          {/* Window Buttons */}
          <div style={{ display: 'flex', gap: 7 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
        </div>

        {/* Zoom Participant Badge (Bottom Left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(7, 10, 16, 0.82)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: 20,
            padding: '8px 16px',
            zIndex: 10,
          }}
        >
          {/* Animated Green Equalizer Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 22, width: 20 }}>
            <div
              style={{
                width: 3.5,
                height: `${eqBar1}px`,
                backgroundColor: '#22C55E',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 3.5,
                height: `${eqBar2}px`,
                backgroundColor: '#22C55E',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 3.5,
                height: `${eqBar3}px`,
                backgroundColor: '#22C55E',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 3.5,
                height: `${eqBar4}px`,
                backgroundColor: '#22C55E',
                borderRadius: 2,
              }}
            />
          </div>

          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.02em',
            }}
          >
            {presenterName}
          </span>

          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              backgroundColor: isSpeaking ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: isSpeaking ? '#4ADE80' : '#94A3B8',
              padding: '2px 8px',
              borderRadius: 8,
              border: isSpeaking ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid transparent',
            }}
          >
            {isSpeaking ? '● SPEAKING' : 'MUTED'}
          </span>
        </div>

        {/* Zoom Mini UI (Bottom Right Controls) */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(7, 10, 16, 0.82)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: 20,
            padding: '8px 12px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>1080p 60fps</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LAYER 3: SCRIPT-MATCHED MOTION GRAPHICS BADGES                 */}
      {/* ============================================================== */}
      {motionBadges.map((badge, idx) => (
        <Sequence key={idx} from={badge.from} durationInFrames={badge.duration}>
          <MotionBadgeCard badge={badge} />
        </Sequence>
      ))}

      {/* ============================================================== */}
      {/* LAYER 4: CLEAN KINETIC CAPTIONS (NO BACKGROUND BOX / COLOR)    */}
      {/* ============================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: 220,
          left: 60,
          right: 60,
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent', // STRICT RULE: NO BACKGROUND COLOR!
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px 18px',
            backgroundColor: 'transparent', // STRICT RULE: NO BACKGROUND COLOR!
            maxWidth: 960,
          }}
        >
          {currentPhraseWords.map((item, wIdx) => {
            const isCurrentActive =
              currentTime >= item.start && currentTime <= item.end;

            return (
              <span
                key={wIdx}
                style={{
                  fontSize: isCurrentActive ? 62 : 54,
                  fontWeight: 900,
                  fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  lineHeight: 1.15,
                  // STRICT RULE: Clean captions without ANY background box / background color
                  backgroundColor: 'transparent',
                  padding: 0,
                  margin: 0,
                  borderRadius: 0,
                  color: isCurrentActive ? '#FFE600' : '#FFFFFF',
                  WebkitTextStroke: isCurrentActive ? '3.5px #000000' : '3px #000000',
                  paintOrder: 'stroke fill',
                  textShadow: isCurrentActive
                    ? '0 6px 24px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 230, 0, 0.7)'
                    : '0 5px 20px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0, 0, 0, 0.9)',
                  transform: isCurrentActive ? 'scale(1.12)' : 'scale(1.0)',
                  transition: 'transform 0.08s ease, color 0.08s ease',
                  display: 'inline-block',
                }}
              >
                {item.word.replace(/[.,!?]/g, '')}
              </span>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* LAYER 5: AUDIO TRACK                                           */}
      {/* ============================================================== */}
      <Audio src={audioSrc} volume={1} />
    </AbsoluteFill>
  );
};

// Sub-component for spring-animated motion graphics badge
const MotionBadgeCard: React.FC<{ badge: any }> = ({ badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const translateY = interpolate(scale, [0, 1], [40, 0]);
  const opacity = interpolate(scale, [0, 0.4, 1], [0, 0.8, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 810,
        left: 80,
        right: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 25,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          width: 780,
          background: 'rgba(10, 14, 22, 0.88)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: '20px 28px',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(0, 112, 243, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
        }}
      >
        {/* Icon Circle */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: badge.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            flexShrink: 0,
          }}
        >
          {badge.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#38BDF8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {badge.tag}
            </span>
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {badge.title}
          </div>

          <div
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: '#94A3B8',
              lineHeight: 1.3,
            }}
          >
            {badge.desc}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomReelComposition;
