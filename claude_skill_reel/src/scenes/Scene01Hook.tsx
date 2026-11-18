import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Step 1: Category Tag Entrance (Frame 0-15)
  const tagSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  // Step 2: Main Headline Entrance (Frame 8-28)
  const title1Spring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  // Step 3: Italic Sub-headline Entrance (Frame 20-40)
  const title2Spring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Step 4: Floating Card 1 Entrance (Frame 35-60)
  const card1Spring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, stiffness: 115, mass: 0.7 },
  });

  // Step 5: Floating Card 2 Entrance (Frame 50-75)
  const card2Spring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 115, mass: 0.7 },
  });

  // Step 6: Bottom Indicator Badge (Frame 68-90)
  const badgeSpring = spring({
    frame: frame - 68,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.6 },
  });

  // Micro-motion floating physics
  const floatY1 = Math.sin((frame / fps) * 2.2) * 8;
  const floatY2 = Math.cos((frame / fps) * 2.5) * 8;

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
      {/* Step 1: Category Pill */}
      <div
        style={{
          transform: `scale(${tagSpring}) translateY(${(1 - tagSpring) * -20}px)`,
          opacity: tagSpring,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#1E2229',
          color: '#F95738',
          padding: '8px 22px',
          borderRadius: 40,
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 20,
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
        }}
      >
        <span style={{ fontSize: 18 }}>⚡</span>
        <span>AI VIDEO AUTOMATION 2026</span>
      </div>

      {/* Step 2 & 3: Oversized Black Headline with Coral Highlight */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: 940,
          marginBottom: 35,
          zIndex: 20,
        }}
      >
        {/* Step 2 */}
        <span
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: 68,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            display: 'block',
            textTransform: 'uppercase',
            transform: `translateY(${(1 - title1Spring) * -40}px)`,
            opacity: title1Spring,
          }}
        >
          ONE CLAUDE SKILL
        </span>

        {/* Step 3 */}
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 76,
            fontWeight: 800,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 8,
            transform: `translateY(${(1 - title2Spring) * -30}px) scale(${0.92 + title2Spring * 0.08})`,
            opacity: title2Spring,
          }}
        >
          Unlimited Animated Reels?
        </span>
      </div>

      {/* Interactive Step-by-Step Floating Cards */}
      <div style={{ position: 'relative', width: 920, height: 420 }}>
        {/* Step 4: Left Floating Card - 3D Motion */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 20,
            width: 390,
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            padding: '24px 28px',
            border: '2px solid #E5E1D8',
            boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
            transform: `translateY(${(1 - card1Spring) * 70 + floatY1}px) rotate(-4deg)`,
            opacity: card1Spring,
            zIndex: 15,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span
              style={{
                backgroundColor: 'rgba(249, 87, 56, 0.12)',
                color: '#F95738',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              🎬 SCENE 01
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981', fontFamily: "'Inter', sans-serif" }}>
                30 FPS SYNC
              </span>
            </div>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: '#0D0F12', marginBottom: 10 }}>
            Dynamic Motion UI
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#F95738',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 18,
                boxShadow: '0 6px 18px rgba(249, 87, 56, 0.45)',
              }}
            >
              ▶
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0F12', fontFamily: "'Inter', sans-serif" }}>
                +40,000 Followers
              </div>
              <div style={{ fontSize: 12, color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                Viral retention format
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Right Floating Card - Code Engine */}
        <div
          style={{
            position: 'absolute',
            right: 30,
            top: 50,
            width: 390,
            backgroundColor: '#0F1115',
            borderRadius: 28,
            padding: '24px 28px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            transform: `translateY(${(1 - card2Spring) * 70 + floatY2}px) rotate(3deg)`,
            opacity: card2Spring,
            zIndex: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              ⚡ REMOTION + SVG
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>
              1080 × 1920
            </span>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
            Zero Video Credits
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#10B981', fontSize: 18 }}>✓</span>
            <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: '#94A3B8' }}>
              Written 100% in pure code
            </span>
          </div>
        </div>
      </div>

      {/* Step 6: Bottom Interactive Pill Indicator */}
      <div
        style={{
          transform: `scale(${badgeSpring})`,
          opacity: badgeSpring,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: '#FFFFFF',
          padding: '12px 28px',
          borderRadius: 30,
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 12px 35px rgba(0,0,0,0.06)',
          zIndex: 25,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F95738', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 800, color: '#0D0F12' }}>
          WATCH STEP-BY-STEP BREAKDOWN
        </span>
        <span style={{ color: '#F95738', fontSize: 18 }}>↓</span>
      </div>
    </div>
  );
};

export default Scene01Hook;
