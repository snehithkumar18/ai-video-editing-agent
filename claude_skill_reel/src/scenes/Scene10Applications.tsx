import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene10Applications: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const viewsCardSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const retentionCardSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const notifsSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.7 },
  });

  // Animated view counter from 10M to 54.8M
  const viewCount = Math.floor(interpolate(frame, [10, 85], [12000000, 54800000], { extrapolateRight: 'clamp' }));
  const millionsDisplay = (viewCount / 1000000).toFixed(1);

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
        <span style={{ color: '#10B981' }}>📈</span> SCALE & REACH ON AUTOPILOT
      </div>

      {/* Headline */}
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
            fontSize: 54,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          OVER 1M+ VIEWS & 11,000+ FOLLOWERS
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 64,
            fontWeight: 800,
            color: '#10B981',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 6,
          }}
        >
          Getting Millions of Views
        </span>
      </div>

      {/* Two Big Social Proof Impact Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          width: 890,
          marginBottom: 24,
        }}
      >
        {/* Card 1: Millions of Views */}
        <div
          style={{
            backgroundColor: '#0F172A',
            borderRadius: 36,
            padding: '36px 32px',
            color: '#FFFFFF',
            transform: `scale(${0.9 + viewsCardSpring * 0.1}) translateY(${(1 - viewsCardSpring) * 50}px)`,
            opacity: viewsCardSpring,
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.35)',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              TOTAL COMBINED VIEWS
            </span>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '6px 14px', borderRadius: 100, fontSize: 18, fontWeight: 800 }}>
              +380% Viral
            </span>
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em', color: '#10B981' }}>
            {millionsDisplay}M+
          </div>
          <div style={{ fontSize: 20, color: '#94A3B8', marginTop: 8, fontWeight: 600 }}>
            Verified across YouTube Shorts & Reels
          </div>
        </div>

        {/* Card 2: Viral Audience Retention */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 36,
            padding: '36px 32px',
            border: '2px solid #E2E8F0',
            transform: `scale(${0.9 + retentionCardSpring * 0.1}) translateY(${(1 - retentionCardSpring) * 50}px)`,
            opacity: retentionCardSpring,
            boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AVG COMPLETION RATE
            </span>
            <span style={{ backgroundColor: '#FFF1EE', color: '#F95738', padding: '6px 14px', borderRadius: 100, fontSize: 18, fontWeight: 800 }}>
              Top 1% Rank
            </span>
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em', color: '#0F172A' }}>
            84.2%
          </div>
          <div style={{ fontSize: 20, color: '#64748B', marginTop: 8, fontWeight: 600 }}>
            Retention driven by dynamic motion UI
          </div>
        </div>
      </div>

      {/* Floating Trending Creator Notification Card */}
      <div
        style={{
          width: 890,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          border: '2px solid #E2E8F0',
          boxShadow: '0 16px 45px rgba(0,0,0,0.06)',
          transform: `translateY(${(1 - notifsSpring) * 40}px)`,
          opacity: notifsSpring,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          🔥
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
            Trending: Explainer Reel hit 2.4M views in 48 hours
          </div>
          <div style={{ fontSize: 18, color: '#64748B', fontWeight: 600 }}>
            Generated 100% via Claude Skill • Zero Manual Keyframing
          </div>
        </div>
        <div
          style={{
            padding: '8px 18px',
            backgroundColor: '#0F172A',
            borderRadius: 100,
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          VIRAL VERIFIED ✓
        </div>
      </div>
    </div>
  );
};

export default Scene10Applications;
