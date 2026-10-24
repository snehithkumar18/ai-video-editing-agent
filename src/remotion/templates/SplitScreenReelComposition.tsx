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

export interface SplitScreenStep {
  stepNumber: number;
  totalSteps: number;
  tag: string;
  title: string;
  codeOrSubtitle: string;
  badge: string;
  accentColor: string;
  from: number;
  duration: number;
}

export interface SplitScreenReelProps {
  presenterCutoutSrc?: string;
  audioSrc?: string;
  timestamps?: CaptionWord[];
  presenterName?: string;
  topicTag?: string;
  brollSrc?: string;
}

export const SplitScreenReelComposition: React.FC<SplitScreenReelProps> = ({
  presenterCutoutSrc = staticFile('presenter_cutout.png'),
  audioSrc = staticFile('speech_female.wav'),
  timestamps = [],
  presenterName = 'Sarah K. (Creator)',
  topicTag = 'AI AUTOMATION MASTERCLASS',
  brollSrc = staticFile('broll/broll_2_ai.mp4'),
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const currentTime = frame / fps;

  // 1. Audio Cadence & Active Word Detection
  const activeWordIndex = timestamps.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );
  const activeWord = activeWordIndex !== -1 ? timestamps[activeWordIndex] : null;
  const isSpeaking = !!activeWord;

  // 2. Cascade 3-Step Motion Graphics (engineered for watch-time retention)
  const steps: SplitScreenStep[] = [
    {
      stepNumber: 1,
      totalSteps: 3,
      tag: 'STEP 1 OF 3: THE SECRET PROMPT',
      title: 'Stop Staring At A Blank Screen',
      codeOrSubtitle: '$ ai generate --script "Viral Hook 95%"',
      badge: '⚡ 10 SEC GENERATION',
      accentColor: '#38BDF8',
      from: 0,
      duration: 480, // 0s - 16s
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      tag: 'STEP 2 OF 3: AUTO ASSET MATCH',
      title: 'Auto B-Roll & Lifelike Voiceover',
      codeOrSubtitle: '> Matched 4K clips • Studio voice synched',
      badge: '🎙️ 100+ VOICES READY',
      accentColor: '#EC4899',
      from: 480,
      duration: 490, // 16s - 32.3s
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      tag: 'STEP 3 OF 3: 1-CLICK VIRAL EXPORT',
      title: 'TikTok • Reels • Shorts Ready',
      codeOrSubtitle: 'Saved 10+ hours per week • Zero editing fatigue',
      badge: '🚀 85% FASTER WORKFLOW',
      accentColor: '#10B981',
      from: 970,
      duration: 458, // 32.3s - 47.6s
    },
  ];

  // Active step
  const currentStep =
    steps.find((s) => frame >= s.from && frame < s.from + s.duration) || steps[0];

  // 3. Caption Chunking (3-4 words, NO background box)
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

  // Presenter natural breathing & gestural swaying
  const swayX = Math.sin(frame * 0.04) * 3.5;
  const breathY = Math.sin(frame * 0.08) * 4;
  const speakingPulse = isSpeaking ? Math.sin(frame * 0.3) * 0.012 : 0;
  const presenterScale = 1.01 + speakingPulse;

  // Equalizer bars for audio reactivity
  const eq1 = isSpeaking ? 14 + Math.abs(Math.sin(frame * 0.5)) * 14 : 5;
  const eq2 = isSpeaking ? 10 + Math.abs(Math.cos(frame * 0.7)) * 18 : 6;
  const eq3 = isSpeaking ? 16 + Math.abs(Math.sin(frame * 0.8)) * 12 : 4;

  return (
    <AbsoluteFill style={{ backgroundColor: '#07090E', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ======================================================================= */}
      {/* BACKGROUND: AMBIENT CINEMATIC CANVAS WITH SUBTLE B-ROLL DEPTH           */}
      {/* ======================================================================= */}
      <AbsoluteFill>
        {brollSrc && (
          <Video
            src={brollSrc}
            style={{
              width: '100%',
              height: '65%',
              objectFit: 'cover',
              opacity: 0.18,
              filter: 'blur(3px)',
            }}
            volume={0}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 25%, rgba(30, 41, 59, 0.7) 0%, rgba(7, 9, 14, 0.98) 70%)',
          }}
        />
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '65%',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      {/* ======================================================================= */}
      {/* TOP 65%: CONTROLLED MOTION GRAPHICS & UI STACK (0px - 1100px)           */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 80,
          zIndex: 10,
        }}
      >
        {/* Category Pill & Progress Tracker */}
        <div
          style={{
            width: 960,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          {/* Tag Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '10px 20px',
              borderRadius: 20,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: currentStep.accentColor,
                boxShadow: `0 0 10px ${currentStep.accentColor}`,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#E2E8F0',
                letterSpacing: '0.08em',
              }}
            >
              {topicTag}
            </span>
          </div>

          {/* Step Progress Pill */}
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: `1px solid ${currentStep.accentColor}66`,
              padding: '10px 18px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 800,
              color: currentStep.accentColor,
              letterSpacing: '0.05em',
            }}
          >
            {currentStep.tag}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div
          style={{
            width: 960,
            height: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            overflow: 'hidden',
            marginBottom: 36,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(currentStep.stepNumber / currentStep.totalSteps) * 100}%`,
              background: `linear-gradient(90deg, #38BDF8 0%, ${currentStep.accentColor} 100%)`,
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>

        {/* Cascading Step Cards */}
        {steps.map((step, idx) => (
          <Sequence
            key={idx}
            from={step.from}
            durationInFrames={step.duration}
            style={{
              position: 'absolute',
              top: 170,
              left: (width - 960) / 2,
              width: 960,
              height: 480,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <StepMotionCard step={step} />
          </Sequence>
        ))}

        {/* ======================================================================= */}
        {/* KINETIC SUBTITLES (NO BACKGROUND COLOR / NO BACKGROUND BOX)            */}
        {/* Placed at Top 720px - perfectly in the open zone above presenter       */}
        {/* ======================================================================= */}
        <div
          style={{
            position: 'absolute',
            top: 720,
            left: 40,
            right: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            zIndex: 25,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px 18px',
              backgroundColor: 'transparent',
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
                    fontSize: isCurrentActive ? 62 : 52,
                    fontWeight: 900,
                    fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1.15,
                    backgroundColor: 'transparent',
                    color: isCurrentActive ? '#FFE600' : '#FFFFFF',
                    WebkitTextStroke: isCurrentActive ? '3.5px #000000' : '3px #000000',
                    paintOrder: 'stroke fill',
                    textShadow: isCurrentActive
                      ? '0 6px 24px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 230, 0, 0.8)'
                      : '0 5px 20px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0, 0, 0, 0.9)',
                    transform: isCurrentActive ? 'scale(1.12)' : 'scale(1.0)',
                    transition: 'transform 0.08s ease, color 0.08s ease',
                    display: 'inline-block',
                    margin: '0 4px',
                  }}
                >
                  {item.word.replace(/[.,!?]/g, '')}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* BOTTOM 35%: REAL PERSON / TRANSPARENT PRESENTER CUTOUT (1150px - 1920px)*/}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translate(${swayX}px, ${breathY}px) scale(${presenterScale})`,
          width: 920,
          height: 860,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 35,
          filter:
            'drop-shadow(0 -15px 45px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 25px rgba(56, 189, 248, 0.15))',
        }}
      >
        {presenterCutoutSrc.endsWith('.webm') ? (
          <Video
            src={presenterCutoutSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center bottom',
            }}
            volume={0}
          />
        ) : (
          <Img
            src={presenterCutoutSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center bottom',
            }}
          />
        )}
      </div>

      {/* Presenter Audio Reactivity Badge (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(10, 14, 22, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 20,
          padding: '8px 16px',
          backdropFilter: 'blur(12px)',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 18, width: 16 }}>
          <div style={{ width: 3, height: `${eq1}px`, backgroundColor: '#22C55E', borderRadius: 2 }} />
          <div style={{ width: 3, height: `${eq2}px`, backgroundColor: '#22C55E', borderRadius: 2 }} />
          <div style={{ width: 3, height: `${eq3}px`, backgroundColor: '#22C55E', borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{presenterName}</span>
      </div>

      {/* ======================================================================= */}
      {/* AUDIO TRACK                                                             */}
      {/* ======================================================================= */}
      <Audio src={audioSrc} volume={1} />
    </AbsoluteFill>
  );
};

// Sub-component: Animated Glassmorphism Step Card with Spring Physics
const StepMotionCard: React.FC<{ step: SplitScreenStep }> = ({ step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const translateY = interpolate(scale, [0, 1], [50, 0]);
  const opacity = interpolate(scale, [0, 0.3, 1], [0, 0.85, 1]);

  return (
    <div
      style={{
        width: 960,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Main Glassmorphism Terminal Card */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(12, 17, 28, 0.92)',
          border: `2px solid ${step.accentColor}55`,
          borderRadius: 28,
          padding: '28px 32px',
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${step.accentColor}25`,
          backdropFilter: 'blur(24px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              backgroundColor: `${step.accentColor}25`,
              color: step.accentColor,
              border: `1px solid ${step.accentColor}66`,
              padding: '4px 12px',
              borderRadius: 12,
              letterSpacing: '0.04em',
            }}
          >
            {step.badge}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 14,
          }}
        >
          {step.title}
        </div>

        {/* Code / Command Prompt Box */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: '16px 20px',
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            fontSize: 19,
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>{step.codeOrSubtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenReelComposition;
