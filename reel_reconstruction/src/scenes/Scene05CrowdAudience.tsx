import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene05CrowdAudience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const crowdSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
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
          marginBottom: 30,
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
          and hardly anyone knows
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
          it's even possible yet
        </span>
      </div>

      {/* Secret Mystery Graphic: Crowd Silhouettes with Question Marks */}
      <div
        style={{
          position: 'relative',
          width: 520,
          height: 320,
          transform: `translateY(${(1 - crowdSpring) * 50}px)`,
          opacity: crowdSpring,
        }}
      >
        {/* Floating Question Marks */}
        {[
          { x: 80, y: 50, scale: 1.1, rot: -8, delay: 15 },
          { x: 240, y: 30, scale: 1.4, rot: 5, delay: 20 },
          { x: 400, y: 60, scale: 1.2, rot: 12, delay: 25 },
        ].map((item, i) => {
          const qSpring = spring({
            frame: frame - item.delay,
            fps,
            config: { damping: 10, stiffness: 140, mass: 0.5 },
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                transform: `scale(${qSpring * item.scale}) rotate(${item.rot}deg)`,
                opacity: qSpring,
                backgroundColor: '#FFFFFF',
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                border: '2px solid #E2E0D8',
                zIndex: 25,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#E11D48',
                }}
              >
                ?
              </span>
            </div>
          );
        })}

        {/* Crowd Silhouette Vector Graphic */}
        <svg
          width="520"
          height="220"
          viewBox="0 0 520 220"
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            zIndex: 15,
          }}
        >
          {/* Back Row heads */}
          <circle cx="90" cy="110" r="28" fill="#D1D5DB" />
          <circle cx="170" cy="95" r="30" fill="#CBD5E1" />
          <circle cx="260" cy="90" r="32" fill="#D1D5DB" />
          <circle cx="350" cy="95" r="30" fill="#CBD5E1" />
          <circle cx="430" cy="110" r="28" fill="#D1D5DB" />

          {/* Front Row heads & shoulders */}
          <ellipse cx="60" cy="170" rx="34" ry="40" fill="#64748B" />
          <ellipse cx="140" cy="150" rx="38" ry="45" fill="#475569" />
          <ellipse cx="230" cy="140" rx="42" ry="50" fill="#334155" />
          <ellipse cx="320" cy="145" rx="40" ry="48" fill="#475569" />
          <ellipse cx="410" cy="160" rx="38" ry="44" fill="#64748B" />
          <ellipse cx="480" cy="180" rx="32" ry="38" fill="#94A3B8" />

          {/* Bottom gradient cover */}
          <rect x="0" y="180" width="520" height="40" fill="url(#crowdFade)" />
          <defs>
            <linearGradient id="crowdFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Scene05CrowdAudience;
