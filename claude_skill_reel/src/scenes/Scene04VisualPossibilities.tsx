import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene04VisualPossibilities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Parallax camera drift
  const camX = Math.sin((frame / fps) * 0.8) * 30;
  const camY = Math.cos((frame / fps) * 0.6) * 15;

  // Swimming fish animation
  const fish1X = interpolate(frame % 120, [0, 120], [-100, 950]);
  const fish1Wag = Math.sin(frame * 0.4) * 6;

  const fish2X = interpolate((frame + 60) % 120, [0, 120], [950, -100]);
  const fish2Wag = Math.sin(frame * 0.35) * 5;

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
      {/* Headline Badges */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -40}px)`,
          opacity: titleSpring,
          display: 'flex',
          gap: 16,
          marginBottom: 35,
          zIndex: 30,
        }}
      >
        <span
          style={{
            backgroundColor: '#0EA5E9',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            padding: '8px 20px',
            borderRadius: 30,
            boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
          }}
        >
          🎨 ILLUSTRATIONS
        </span>
        <span
          style={{
            backgroundColor: '#F95738',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            padding: '8px 20px',
            borderRadius: 30,
            boxShadow: '0 8px 25px rgba(249, 87, 56, 0.4)',
          }}
        >
          ✨ CHARACTERS
        </span>
        <span
          style={{
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            padding: '8px 20px',
            borderRadius: 30,
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
          }}
        >
          🎬 MOTION GRAPHICS
        </span>
      </div>

      {/* Colorful Illustrated Underwater Parallax Window */}
      <div
        style={{
          position: 'relative',
          width: 880,
          height: 520,
          borderRadius: 36,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(14, 165, 233, 0.25)',
          border: '4px solid #FFFFFF',
          background: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 45%, #0369A1 80%, #0C4A6E 100%)',
          transform: `translate(${camX}px, ${camY}px)`,
        }}
      >
        {/* Caustic light rays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 70%)',
            opacity: 0.7,
          }}
        />

        {/* Floating Air Bubbles */}
        {[
          { x: 140, base: 450, r: 8, sp: 1.8 },
          { x: 320, base: 420, r: 12, sp: 2.2 },
          { x: 580, base: 480, r: 10, sp: 1.5 },
          { x: 740, base: 440, r: 14, sp: 2.5 },
        ].map((b, i) => {
          const bY = b.base - ((frame * b.sp * 3) % 480);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: b.x + Math.sin(frame * 0.1 + i) * 10,
                top: bY,
                width: b.r * 2,
                height: b.r * 2,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.45)',
                border: '1.5px solid rgba(255,255,255,0.8)',
              }}
            />
          );
        })}

        {/* Fish 1 (Swimming Left to Right) */}
        <div
          style={{
            position: 'absolute',
            left: fish1X,
            top: 180 + Math.sin(frame * 0.1) * 15,
            zIndex: 15,
          }}
        >
          <svg width="120" height="70" viewBox="0 0 120 70">
            {/* Body */}
            <ellipse cx="60" cy="35" rx="38" ry="24" fill="#F97316" />
            <ellipse cx="60" cy="35" rx="38" ry="24" fill="url(#fishGrad)" />
            {/* Tail fin with wag */}
            <polygon
              points="22,35 0,15 0,55"
              fill="#EA580C"
              transform={`rotate(${fish1Wag} 22 35)`}
            />
            {/* Stripes */}
            <path d="M 50 15 Q 52 35 50 55" stroke="#FFFFFF" strokeWidth="5" fill="none" />
            <path d="M 68 13 Q 70 35 68 57" stroke="#FFFFFF" strokeWidth="5" fill="none" />
            {/* Eye */}
            <circle cx="85" cy="30" r="5" fill="#FFFFFF" />
            <circle cx="87" cy="30" r="2.5" fill="#000000" />
            <defs>
              <linearGradient id="fishGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Fish 2 (Swimming Right to Left) */}
        <div
          style={{
            position: 'absolute',
            left: fish2X,
            top: 280 + Math.cos(frame * 0.08) * 12,
            zIndex: 14,
            transform: 'scaleX(-1)',
          }}
        >
          <svg width="100" height="60" viewBox="0 0 100 60">
            <ellipse cx="50" cy="30" rx="30" ry="18" fill="#FACC15" />
            <polygon
              points="20,30 0,15 0,45"
              fill="#EAB308"
              transform={`rotate(${fish2Wag} 20 30)`}
            />
            <circle cx="70" cy="26" r="4" fill="#FFFFFF" />
            <circle cx="72" cy="26" r="2" fill="#000000" />
          </svg>
        </div>

        {/* Aquatic Sea Plants Swaying */}
        <svg
          width="880"
          height="180"
          viewBox="0 0 880 180"
          style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 12 }}
        >
          <path
            d={`M 60 180 Q ${80 + Math.sin(frame * 0.05) * 20} 90 90 20 Q 95 90 80 180 Z`}
            fill="#10B981"
          />
          <path
            d={`M 110 180 Q ${140 + Math.cos(frame * 0.06) * 25} 80 160 10 Q 150 90 130 180 Z`}
            fill="#059669"
          />
          <path
            d={`M 720 180 Q ${700 + Math.sin(frame * 0.05) * 22} 85 710 15 Q 735 90 740 180 Z`}
            fill="#10B981"
          />
          <path
            d={`M 790 180 Q ${820 + Math.cos(frame * 0.05) * 20} 95 830 30 Q 815 100 810 180 Z`}
            fill="#047857"
          />
        </svg>

        {/* Sandy Sea Bed Floor */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 35,
            backgroundColor: '#D97706',
            borderRadius: '50% 50% 0 0 / 20px 20px 0 0',
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};

export default Scene04VisualPossibilities;
