import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PresenterAvatar } from '../components/PresenterAvatar';

export const Scene11Reusability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Cycle through 3 concepts:
  // 0-40 frames: "AI Video Editing"
  // 40-80 frames: "Finance Automation"
  // 80-120 frames: "Design Systems"
  const stage = Math.min(2, Math.floor(frame / 40));

  const concepts = [
    { topic: 'AI VIDEO AGENTS', asset: 'Remotion + Whisper', color: '#F95738', icon: '🎬' },
    { topic: 'FINANCIAL AUTOMATION', asset: 'Pandas + Charts', color: '#10B981', icon: '📈' },
    { topic: 'DESIGN SYSTEMS 2026', asset: 'Figma + SVG Stack', color: '#3B82F6', icon: '🎨' },
  ];

  const current = concepts[stage];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 180,
        pointerEvents: 'none',
      }}
    >
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -50}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 920,
          marginBottom: 35,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 56,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          NEW TOPIC • NEW ASSETS
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 48,
            fontWeight: 700,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          Same Reusable Engine
        </span>
      </div>

      {/* Dynamically Transforming Project Card */}
      <div
        style={{
          width: 860,
          backgroundColor: '#FFFFFF',
          borderRadius: 32,
          padding: '28px 34px',
          border: `3px solid ${current.color}`,
          boxShadow: `0 25px 60px ${current.color}25`,
          transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.92 + cardSpring * 0.08})`,
          opacity: cardSpring,
          transition: 'border 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>{current.icon}</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: current.color,
                letterSpacing: '0.06em',
              }}
            >
              CONCEPT 0{stage + 1} OF 03
            </span>
          </div>

          <div
            style={{
              backgroundColor: `${current.color}15`,
              color: current.color,
              fontFamily: "'Fira Code', monospace",
              fontSize: 13,
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: 20,
            }}
          >
            ACTIVE REEL
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 36,
              fontWeight: 900,
              color: '#0D0F12',
              letterSpacing: '-0.02em',
              marginBottom: 8,
            }}
          >
            {current.topic}
          </div>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 16,
              color: '#6B7280',
            }}
          >
            Connected Assets: {current.asset}
          </div>
        </div>

        {/* Workflow Consistency Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC',
            padding: '12px 18px',
            borderRadius: 14,
            border: '1px solid #E2E8F0',
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
            Core Skill Pipeline
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#10B981', fontWeight: 800 }}>
            ✓ 100% UNCHANGED
          </span>
        </div>
      </div>

      {/* Presenter Avatar Anchored at Bottom */}
      <PresenterAvatar pose="pose_point_up_right" scale={0.9} bottomOffset={0} />
    </div>
  );
};

export default Scene11Reusability;
