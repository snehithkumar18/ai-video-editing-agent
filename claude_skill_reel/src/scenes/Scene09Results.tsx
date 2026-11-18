import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene09Results: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const dashboardSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const cardsSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.7 },
  });

  // Animated creator count rolling up from 0 to 4,850+
  const creatorCount = Math.floor(interpolate(frame, [10, 60], [1200, 4850], { extrapolateRight: 'clamp' }));
  const videosProduced = Math.floor(interpolate(frame, [15, 75], [5000, 48200], { extrapolateRight: 'clamp' }));

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
      {/* Category Pill */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 24px',
          backgroundColor: '#0D0F12',
          borderRadius: 100,
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <span style={{ color: '#F95738' }}>⚡</span> CREATOR WORKFLOW ENGINE
      </div>

      {/* Main Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -45}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 960,
          marginBottom: 35,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 58,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          POSTED 60 IN TWO WEEKS
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
          Creators Using This Workflow
        </span>
      </div>

      {/* Main Multi-Creator Dashboard Card */}
      <div
        style={{
          width: 890,
          backgroundColor: '#FFFFFF',
          borderRadius: 36,
          padding: '34px 40px',
          border: '2px solid #E2E8F0',
          boxShadow: '0 30px 80px rgba(0,0,0,0.08)',
          transform: `translateY(${(1 - dashboardSpring) * 60}px)`,
          opacity: dashboardSpring,
          marginBottom: 20,
        }}
      >
        {/* Metric Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Active Creators Scaling
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color: '#0F172A', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
              {creatorCount.toLocaleString()}+
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: '#ECFDF5',
              borderRadius: 100,
              color: '#059669',
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            <span>🚀</span> 100% Code-Based
          </div>
        </div>

        {/* 3 Horizontal Workflow Progress Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '18px 20px', borderRadius: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#64748B' }}>TOTAL REELS CODE-BUILT</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>{videosProduced.toLocaleString()}+</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '18px 20px', borderRadius: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#64748B' }}>PRODUCTION SPEED</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#F95738', marginTop: 4 }}>10x Faster</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '18px 20px', borderRadius: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#64748B' }}>FILMING REQUIRED</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10B981', marginTop: 4 }}>Zero Camera</div>
          </div>
        </div>
      </div>

      {/* Floating Live Creator Avatars Strip */}
      <div
        style={{
          width: 890,
          backgroundColor: '#0F172A',
          borderRadius: 24,
          padding: '18px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF',
          transform: `translateY(${(1 - cardsSpring) * 40}px)`,
          opacity: cardsSpring,
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', marginLeft: 8 }}>
            <span style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#F95738', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid #0F172A' }}>👨‍💻</span>
            <span style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#3B82F6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid #0F172A', marginLeft: -10 }}>👩‍🎨</span>
            <span style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid #0F172A', marginLeft: -10 }}>🧑‍🚀</span>
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
            Tech • SaaS • Education • Storytelling
          </span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#10B981' }}>
          ● LIVE BATCH QUEUE
        </div>
      </div>
    </div>
  );
};

export default Scene09Results;
