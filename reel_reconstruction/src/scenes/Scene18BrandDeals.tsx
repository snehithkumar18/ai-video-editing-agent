import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene18BrandDeals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  // Stamp slam down at frame 8
  const stampSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 8, stiffness: 220, mass: 0.4 },
  });

  // Screen shake on impact
  const shakeX = frame >= 8 && frame <= 16 ? Math.sin(frame * 4) * 5 : 0;
  const shakeY = frame >= 8 && frame <= 16 ? Math.cos(frame * 4) * 4 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 120,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - headlineSpring) * -40}px) scale(${0.9 + headlineSpring * 0.1})`,
          opacity: headlineSpring,
          textAlign: 'center',
          maxWidth: 620,
          marginBottom: 25,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 44,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          and over
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 50,
            fontWeight: 800,
            color: '#E11D48',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          $2,500 in brand deals.
        </span>
      </div>

      {/* Financial Metric Card */}
      <div
        style={{
          position: 'relative',
          width: 520,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '30px 32px',
          border: '1px solid #E2E0D8',
          boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
          transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.9 + cardSpring * 0.1})`,
          opacity: cardSpring,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: '#868C98',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 6,
          }}
        >
          Verified Inbound Revenue
        </div>

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 64,
            fontWeight: 900,
            color: '#0F1115',
            letterSpacing: '-0.03em',
          }}
        >
          $2,500.00+
        </div>

        {/* Giant Red Distressed Rubber Stamp Slam */}
        {frame >= 8 && (
          <div
            style={{
              position: 'absolute',
              top: 35,
              transform: `rotate(-10deg) scale(${1.8 - stampSpring * 0.8})`,
              opacity: stampSpring,
              border: '6px solid #E11D48',
              borderRadius: 16,
              padding: '10px 36px',
              color: '#E11D48',
              fontFamily: "'Inter', sans-serif",
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(254, 242, 242, 0.96)',
              boxShadow: '0 10px 30px rgba(225, 29, 72, 0.4)',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
            }}
          >
            BRAND DEALS
          </div>
        )}
      </div>
    </div>
  );
};

export default Scene18BrandDeals;
