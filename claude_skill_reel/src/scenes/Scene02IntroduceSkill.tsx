import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene02IntroduceSkill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Step 1: Headline Spring (Frame 0-20)
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Step 2: Prompt Input Box Entrance (Frame 12-32)
  const promptSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Step 3: Terminal Code Window (Frame 30-55)
  const terminalSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 13, stiffness: 115, mass: 0.8 },
  });

  // Step 4: Live Compiler Output Pill (Frame 65-88)
  const pillSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 12, stiffness: 125, mass: 0.7 },
  });

  // Typing simulation: number of code lines revealed based on frame
  const typingCharCount = Math.min(68, Math.max(0, Math.floor((frame - 18) * 2.2)));
  const fullPromptText = 'Make a high-retention vertical reel using Remotion & code';
  const displayedPrompt = fullPromptText.slice(0, typingCharCount);

  // Streaming code lines reveal
  const codeLines = [
    { text: '// 1. Initialize Claude Skill: hyperframes', color: '#64748B' },
    { text: 'import { Composition, Sequence, spring } from "remotion";', color: '#38BDF8' },
    { text: 'export const Reel = () => (', color: '#F43F5E' },
    { text: '  <Composition id="ViralReel" fps={30} width={1080} height={1920}>', color: '#10B981' },
    { text: '    <Scene01Hook title="ONE REUSABLE SKILL" />', color: '#F95738' },
    { text: '    <CodedPresenterAvatar pose="typing_keyboard" />', color: '#FBBF24' },
    { text: '  </Composition>', color: '#10B981' },
    { text: '); // ⚡ Rendered locally in 1080p with $0 video credits', color: '#64748B' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 160,
        pointerEvents: 'none',
      }}
    >
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -45}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 920,
          marginBottom: 30,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 60,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          ONE REUSABLE SKILL
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 64,
            fontWeight: 800,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 6,
          }}
        >
          You Give One Idea, It Writes The Code
        </span>
      </div>

      {/* Step 2: Interactive Prompt Input Card */}
      <div
        style={{
          width: 880,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '16px 24px',
          border: '2px solid #E2E8F0',
          boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
          transform: `translateY(${(1 - promptSpring) * 35}px)`,
          opacity: promptSpring,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            backgroundColor: '#F95738',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 800,
            padding: '6px 14px',
            borderRadius: 16,
          }}
        >
          YOUR IDEA
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 600, color: '#0F172A', flex: 1 }}>
          {displayedPrompt}
          {typingCharCount < fullPromptText.length && (
            <span style={{ color: '#F95738', fontWeight: 900, animation: 'blink 0.8s infinite' }}> |</span>
          )}
        </div>
        <div style={{ color: '#10B981', fontSize: 20 }}>✓</div>
      </div>

      {/* Step 3: Dark Coding Interface Mockup */}
      <div
        style={{
          width: 880,
          backgroundColor: '#0F1115',
          borderRadius: 28,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          transform: `translateY(${(1 - terminalSpring) * 60}px) scale(${0.92 + terminalSpring * 0.08})`,
          opacity: terminalSpring,
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            backgroundColor: '#181B20',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                color: '#94A3B8',
                marginLeft: 12,
              }}
            >
              .agents/skills/hyperframes/ReelComposition.tsx
            </span>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              color: '#10B981',
              fontFamily: "'Fira Code', monospace",
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 14,
            }}
          >
            ● COMPILING REEL
          </div>
        </div>

        {/* Code Output Streaming Area */}
        <div
          style={{
            padding: '22px 28px',
            fontFamily: "'Fira Code', monospace",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {codeLines.map((line, idx) => {
            const lineDelay = 35 + idx * 8;
            const isVisible = frame >= lineDelay;
            if (!isVisible) return null;

            return (
              <div key={idx} style={{ display: 'flex', gap: 20 }}>
                <span style={{ color: '#475569', userSelect: 'none', width: 24, textAlign: 'right' }}>
                  {idx + 1}
                </span>
                <span style={{ color: line.color }}>{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 4: Bottom Result Tag */}
      <div
        style={{
          marginTop: 24,
          transform: `scale(${pillSpring})`,
          opacity: pillSpring,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: '#1E2229',
          padding: '10px 24px',
          borderRadius: 30,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ color: '#10B981', fontSize: 16 }}>⚡</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
          Zero Video Generators Needed — Fully Deterministic Code
        </span>
      </div>
    </div>
  );
};

export default Scene02IntroduceSkill;
