import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene03Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const card1Spring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const card2Spring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 13, stiffness: 115, mass: 0.8 },
  });

  const energySpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.6 },
  });

  // Pulse animation along connector
  const pulseOffset = (frame * 5) % 300;

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
          maxWidth: 950,
          marginBottom: 35,
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
          NOT A VIDEO AI, CODE.
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 66,
            fontWeight: 800,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 6,
          }}
        >
          No Video Credits To Burn
        </span>
      </div>

      {/* Comparison Grid: Old Way vs Code Way */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          width: 880,
          marginBottom: 30,
        }}
      >
        {/* Card 1: Traditional Video AI (Crossed Out) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            padding: '28px 26px',
            border: '2px solid #FCA5A5',
            boxShadow: '0 20px 50px rgba(239, 68, 68, 0.08)',
            transform: `translateY(${(1 - card1Spring) * 50}px)`,
            opacity: card1Spring,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span
              style={{
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              TRADITIONAL AI VIDEO
            </span>
            <span style={{ fontSize: 20 }}>❌</span>
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: '#1E293B', marginBottom: 16 }}>
            Pay-Per-Generation
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B', fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: '#EF4444', fontWeight: 900 }}>✕</span>
              <span>Burn $50–$100 in API credits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B', fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: '#EF4444', fontWeight: 900 }}>✕</span>
              <span>Inconsistent character faces</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B', fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: '#EF4444', fontWeight: 900 }}>✕</span>
              <span>Cloud queues & blurry 720p text</span>
            </div>
          </div>
        </div>

        {/* Card 2: Claude Skill + Code Engine (Winner) */}
        <div
          style={{
            backgroundColor: '#0F172A',
            borderRadius: 28,
            padding: '28px 26px',
            border: '2px solid #10B981',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.22)',
            transform: `translateY(${(1 - card2Spring) * 50}px)`,
            opacity: card2Spring,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              CLAUDE SKILL (HYPERFRAMES)
            </span>
            <span style={{ fontSize: 20 }}>✅</span>
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
            100% Free & Unlimited
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#E2E8F0', fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
              <span>Zero credit cost — purely local</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#E2E8F0', fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
              <span>Crisp vector SVG & typography</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#E2E8F0', fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
              <span>Exact 30 FPS deterministic sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Interactive Energy Flow Bar */}
      <div
        style={{
          width: 880,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '16px 28px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
          transform: `scale(${energySpring})`,
          opacity: energySpring,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
            EXECUTION PIPELINE:
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 14, fontWeight: 700, color: '#F95738' }}>
            IDEA
          </span>
          <span style={{ color: '#94A3B8' }}>➔</span>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 14, fontWeight: 700, color: '#38BDF8' }}>
            REMOTION CODE
          </span>
          <span style={{ color: '#94A3B8' }}>➔</span>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 14, fontWeight: 700, color: '#10B981' }}>
            1080p MP4
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scene03Workflow;
