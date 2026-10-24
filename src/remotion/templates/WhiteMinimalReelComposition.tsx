import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Audio,
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

export interface MinimalStep {
  stepNumber: number;
  totalSteps: number;
  tag: string;
  badge: string;
  title: string;
  codeOrMetrics: string[];
  accentColor: string;
  from: number;
  duration: number;
}

export interface WhiteMinimalReelProps {
  audioSrc?: string;
  timestamps?: CaptionWord[];
  topicTag?: string;
}

export const WhiteMinimalReelComposition: React.FC<WhiteMinimalReelProps> = ({
  audioSrc = staticFile('speech_female.wav'),
  timestamps = [],
  topicTag = 'AI VIRAL ENGINE 2026',
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

  // 2. Cascading 3-Step Motion Graphics engineered for maximum watch time
  const steps: MinimalStep[] = [
    {
      stepNumber: 1,
      totalSteps: 3,
      tag: 'STEP 1 OF 3: THE INSTANT SCRIPT',
      badge: '⚡ 3-SECOND PROMPT',
      title: 'Stop Staring At A Blank Page',
      codeOrMetrics: [
        '$ ai generate --topic "Viral Reel" --retention 98%',
        '✔ Hook written (Score: 94/100) • 3 Key Beats Mapped',
      ],
      accentColor: '#2563EB', // Royal Blue
      from: 0,
      duration: 480, // 0s - 16s
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      tag: 'STEP 2 OF 3: ASSET & VOICE SYNC',
      badge: '🎙️ 100+ STUDIO VOICES',
      title: 'Auto B-Roll & Lifelike Audio',
      codeOrMetrics: [
        '> Auto-matching 4K vertical footage clips...',
        '✔ Digital voiceover generated with zero mic setup',
      ],
      accentColor: '#7C3AED', // Vivid Purple
      from: 480,
      duration: 490, // 16s - 32.3s
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      tag: 'STEP 3 OF 3: 1-CLICK VIRAL EXPORT',
      badge: '🚀 MULTI-PLATFORM READY',
      title: 'TikTok • Instagram Reels • Shorts',
      codeOrMetrics: [
        '📈 +85% Average Audience Watch Time',
        '⏱️ 10+ Hours Saved Every Week • Stress Less',
      ],
      accentColor: '#059669', // Emerald Green
      from: 970,
      duration: 458, // 32.3s - 47.6s
    },
  ];

  // Current active step
  const currentStep =
    steps.find((s) => frame >= s.from && frame < s.from + s.duration) || steps[0];

  // 3. Caption Chunking (3-4 words per phrase, strictly NO background box)
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

  // Equalizer audio visualizer bars
  const eq1 = isSpeaking ? 16 + Math.abs(Math.sin(frame * 0.5)) * 16 : 6;
  const eq2 = isSpeaking ? 12 + Math.abs(Math.cos(frame * 0.7)) * 20 : 8;
  const eq3 = isSpeaking ? 18 + Math.abs(Math.sin(frame * 0.8)) * 14 : 5;
  const eq4 = isSpeaking ? 14 + Math.abs(Math.cos(frame * 0.4)) * 16 : 7;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F8FAFC', // Premium clean studio off-white
        fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ======================================================================= */}
      {/* BACKGROUND: CLEAN STUDIO GRID & AMBIENT SOFT LIGHTING                   */}
      {/* ======================================================================= */}
      <AbsoluteFill>
        {/* Subtle minimalist grid dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
            opacity: 0.65,
          }}
        />

        {/* Soft studio ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1000,
            height: 900,
            background:
              'radial-gradient(circle, rgba(238, 242, 255, 0.9) 0%, rgba(248, 250, 252, 0) 70%)',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      {/* ======================================================================= */}
      {/* TOP 65%: CONTROLLED MOTION GRAPHICS & CARDS STACK (0px - 1240px)        */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1240,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 80,
          zIndex: 10,
        }}
      >
        {/* Category Pill & Progress Tracker Header */}
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
              gap: 10,
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              padding: '10px 22px',
              borderRadius: 24,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: currentStep.accentColor,
                boxShadow: `0 0 10px ${currentStep.accentColor}`,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '0.08em',
              }}
            >
              {topicTag}
            </span>
          </div>

          {/* Step Badge Pill */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: `2px solid ${currentStep.accentColor}`,
              padding: '10px 20px',
              borderRadius: 24,
              fontSize: 14,
              fontWeight: 800,
              color: currentStep.accentColor,
              letterSpacing: '0.04em',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
            }}
          >
            {currentStep.tag}
          </div>
        </div>

        {/* Global Step Progress Bar */}
        <div
          style={{
            width: 960,
            height: 8,
            backgroundColor: '#E2E8F0',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 36,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(currentStep.stepNumber / currentStep.totalSteps) * 100}%`,
              background: `linear-gradient(90deg, #2563EB 0%, ${currentStep.accentColor} 100%)`,
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>

        {/* Cascading Step Motion Cards */}
        {steps.map((step, idx) => (
          <Sequence
            key={idx}
            from={step.from}
            durationInFrames={step.duration}
            style={{
              position: 'absolute',
              top: 176,
              left: (width - 960) / 2,
              width: 960,
              height: 480,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <WhiteMinimalStepCard step={step} />
          </Sequence>
        ))}

        {/* ======================================================================= */}
        {/* KINETIC SUBTITLES (NO BACKGROUND BOX / STRICTLY CLEAN TEXT)             */}
        {/* High contrast: Pitch black text with active electric highlight         */}
        {/* ======================================================================= */}
        <div
          style={{
            position: 'absolute',
            top: 710,
            left: 40,
            right: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent', // STRICT RULE: ZERO BACKGROUND COLOR
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
                    fontSize: isCurrentActive ? 64 : 54,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1.15,
                    backgroundColor: 'transparent', // ZERO BACKGROUND BOX
                    color: isCurrentActive ? currentStep.accentColor : '#0F172A',
                    WebkitTextStroke: isCurrentActive
                      ? `2px ${currentStep.accentColor}`
                      : '1.5px #0F172A',
                    textShadow: isCurrentActive
                      ? `0 4px 20px ${currentStep.accentColor}44`
                      : '0 2px 10px rgba(0, 0, 0, 0.08)',
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
      {/* BOTTOM 35%: RESERVED PLACEHOLDER FOR SPEAKER CUTOUT (1240px - 1920px)   */}
      {/* Clean stage ready for the user's video, with soft ground pedestal       */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 680,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 40,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      >
        {/* Soft ground contact shadow for when presenter is dropped in */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            width: 700,
            height: 90,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.12) 0%, rgba(15, 23, 42, 0.02) 60%, transparent 100%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Minimalist Floating Audio Sync Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: 24,
            padding: '12px 24px',
            boxShadow:
              '0 12px 30px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
            zIndex: 40,
          }}
        >
          {/* Animated Equalizer Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 22, width: 24 }}>
            <div
              style={{
                width: 3.5,
                height: `${eq1}px`,
                backgroundColor: currentStep.accentColor,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 3.5,
                height: `${eq2}px`,
                backgroundColor: currentStep.accentColor,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 3.5,
                height: `${eq3}px`,
                backgroundColor: currentStep.accentColor,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 3.5,
                height: `${eq4}px`,
                backgroundColor: currentStep.accentColor,
                borderRadius: 2,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '0.02em' }}>
              PRESENTER STAGE
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
              {isSpeaking ? '● AUDIO SYNCHRONIZED' : 'READY FOR CUTOUT VIDEO'}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* AUDIO TRACK                                                             */}
      {/* ======================================================================= */}
      <Audio src={audioSrc} volume={1} />
    </AbsoluteFill>
  );
};

// Sub-component: High-end Minimalist Card with Spring Physics
const WhiteMinimalStepCard: React.FC<{ step: MinimalStep }> = ({ step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const translateY = interpolate(scale, [0, 1], [40, 0]);
  const opacity = interpolate(scale, [0, 0.3, 1], [0, 0.9, 1]);

  return (
    <div
      style={{
        width: 960,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Card Window Container */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '2px solid #E2E8F0',
          borderRadius: 32,
          padding: '32px 36px',
          boxShadow:
            '0 25px 60px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            borderBottom: '1.5px solid #F1F5F9',
            paddingBottom: 16,
          }}
        >
          {/* macOS Style Window Dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>

          {/* Action Badge */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              backgroundColor: `${step.accentColor}12`,
              color: step.accentColor,
              border: `1.5px solid ${step.accentColor}33`,
              padding: '6px 14px',
              borderRadius: 14,
              letterSpacing: '0.04em',
            }}
          >
            {step.badge}
          </div>
        </div>

        {/* Step Title */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 18,
          }}
        >
          {step.title}
        </div>

        {/* Code / Command Prompt Box */}
        <div
          style={{
            backgroundColor: '#0F172A', // Dark contrasting terminal inside white card
            borderRadius: 18,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
          }}
        >
          {step.codeOrMetrics.map((line, lIdx) => (
            <div
              key={lIdx}
              style={{
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                fontSize: 18,
                color: lIdx === 0 ? '#38BDF8' : '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhiteMinimalReelComposition;
