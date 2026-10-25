import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene17GrowthAnalytics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const viewsCount = Math.floor(
    interpolate(frame, [15, 75], [120000, 4942108], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 120,
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
            fontSize: 40,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          That's what got this account almost
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 48,
            fontWeight: 700,
            color: '#E11D48',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          5 million views in a month
        </span>
      </div>

      {/* Analytics Dashboard Card */}
      <div
        style={{
          width: 540,
          backgroundColor: '#0F1115',
          borderRadius: 24,
          padding: '24px 28px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.9 + cardSpring * 0.1})`,
          opacity: cardSpring,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: '#94A3B8',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Insights • Past 30 Days
          </span>
          <span
            style={{
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 20,
            }}
          >
            +1,420% EXPLOSION
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 52,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {viewsCount.toLocaleString()}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: '#34D399',
              marginTop: 6,
            }}
          >
            ↗ Accounts reached: 3,892,100 (94% non-followers)
          </div>
        </div>

        {/* Spline Chart SVG */}
        <div style={{ height: 80, width: '100%', position: 'relative' }}>
          <svg width="100%" height="80" viewBox="0 0 480 80">
            <path
              d="M 10 70 Q 120 68 220 55 T 380 25 T 470 5"
              fill="none"
              stroke="#E11D48"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Area fill */}
            <path
              d="M 10 70 Q 120 68 220 55 T 380 25 T 470 5 L 470 80 L 10 80 Z"
              fill="url(#chartGrad)"
            />
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E11D48" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Scene17GrowthAnalytics;
