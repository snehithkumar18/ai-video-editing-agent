import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene01Hook: React.FC = () => {
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
    config: { damping: 12, stiffness: 110, mass: 0.7 },
  });

  const card2Spring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.7 },
  });

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
      {/* Oversized Black Headline with Coral-Orange Highlight */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -60}px) scale(${0.88 + titleSpring * 0.12})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 920,
          marginBottom: 50,
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: 66,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            display: 'block',
            textTransform: 'uppercase',
          }}
        >
          ONE CLAUDE SKILL
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 74,
            fontWeight: 800,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 10,
          }}
        >
          Unlimited Animated Reels?
        </span>
      </div>

      {/* Floating Video Cards Around Text */}
      <div style={{ position: 'relative', width: 900, height: 420 }}>
        {/* Floating Card Left: 3D Physics */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 20,
            width: 380,
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            padding: '24px 28px',
            border: '2px solid #E5E1D8',
            boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
            transform: `translateY(${(1 - card1Spring) * 60 + Math.sin(frame * 0.08) * 8}px) rotate(-4deg)`,
            opacity: card1Spring,
            zIndex: 15,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span
              style={{
                backgroundColor: '#FFF1EE',
                color: '#F95738',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              ⚡ AUTO-ANIMATED
            </span>
            <span style={{ fontSize: 20 }}>🎬</span>
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: '#0D0F12',
              marginBottom: 6,
            }}
          >
            Kinetic Motion Graphics
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#6B7280' }}>
            Spring curves & word-timed events
          </div>
        </div>

        {/* Floating Card Right: Scale & Multi-Format */}
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: 90,
            width: 380,
            backgroundColor: '#111418',
            borderRadius: 28,
            padding: '24px 28px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.22)',
            transform: `translateY(${(1 - card2Spring) * 80 + Math.cos(frame * 0.08) * 8}px) rotate(3deg)`,
            opacity: card2Spring,
            zIndex: 18,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span
              style={{
                backgroundColor: 'rgba(249, 87, 56, 0.2)',
                color: '#F95738',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              🚀 PRODUCTION SCALE
            </span>
            <span style={{ fontSize: 20 }}>🔥</span>
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: 6,
            }}
          >
            100% Code-Driven
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#9CA3AF' }}>
            Prompt to 4K / 1080p vertical video
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene01Hook;
