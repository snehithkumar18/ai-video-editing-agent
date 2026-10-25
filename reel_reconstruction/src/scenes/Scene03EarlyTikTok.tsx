import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene03EarlyTikTok: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const phoneSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Curve draw progress
  const curveProgress = interpolate(frame, [25, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Target pin drop
  const pinSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.5 },
  });

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
            fontSize: 42,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          Right now, AI-animated reels are
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
          early TikTok was
        </span>
      </div>

      {/* Visual Composition: Phone Mockup & Growth Curve */}
      <div
        style={{
          position: 'relative',
          width: 540,
          height: 380,
          transform: `translateY(${(1 - phoneSpring) * 60}px) scale(${0.9 + phoneSpring * 0.1})`,
          opacity: phoneSpring,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Growth Curve Line Behind */}
        <svg
          width="480"
          height="240"
          viewBox="0 0 480 240"
          style={{
            position: 'absolute',
            top: 20,
            zIndex: 10,
          }}
        >
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#868C98" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#E11D48" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1="40" y1="200" x2="440" y2="200" stroke="#E2E0D8" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="40" y1="120" x2="440" y2="120" stroke="#E2E0D8" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="40" y1="40" x2="440" y2="40" stroke="#E2E0D8" strokeWidth="2" strokeDasharray="4 4" />

          {/* Spline Exponential Path */}
          <path
            d="M 50 190 Q 220 185 320 110 T 430 30"
            fill="none"
            stroke="url(#curveGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset={500 * (1 - curveProgress)}
          />
        </svg>

        {/* Target Pin Marker at Early Stage */}
        {frame >= 50 && (
          <div
            style={{
              position: 'absolute',
              left: 170,
              top: 155,
              transform: `translateY(${(1 - pinSpring) * -60}px) scale(${0.7 + pinSpring * 0.3})`,
              opacity: pinSpring,
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#E11D48',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 20,
                boxShadow: '0 4px 12px rgba(225,29,72,0.4)',
                whiteSpace: 'nowrap',
              }}
            >
              📍 WE ARE HERE
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '6px solid #E11D48',
              }}
            />
          </div>
        )}

        {/* Central Phone Mockup */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            width: 220,
            height: 330,
            backgroundColor: '#0F1115',
            borderRadius: 36,
            border: '6px solid #23262D',
            boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Phone Notch */}
          <div
            style={{
              width: 80,
              height: 16,
              backgroundColor: '#23262D',
              borderRadius: '0 0 10px 10px',
              margin: '0 auto',
            }}
          />

          {/* Reel Content Preview Inside Phone */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#1E293B',
              margin: 8,
              borderRadius: 24,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 12,
                width: 'fit-content',
              }}
            >
              🔥 1.2M Views
            </div>

            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 4,
                }}
              >
                Zero to 40K followers
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                }}
              >
                #ai #growth #motion
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene03EarlyTikTok;
