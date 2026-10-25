import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene04RealMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const promptSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.8 },
  });

  const stackSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.8 },
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
          Real motion graphics,
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
          voiceover & captions
        </span>
      </div>

      {/* Dark Prompt Command Bar */}
      <div
        style={{
          transform: `translateY(${(1 - promptSpring) * 40}px) scale(${0.9 + promptSpring * 0.1})`,
          opacity: promptSpring,
          backgroundColor: '#0F1115',
          borderRadius: 20,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.14)',
          marginBottom: 20,
          width: 480,
        }}
      >
        <span style={{ color: '#E11D48', fontFamily: "'Fira Code', monospace", fontWeight: 700, fontSize: 18 }}>
          ❯
        </span>
        <span
          style={{
            color: '#F8FAFC',
            fontFamily: "'Fira Code', monospace",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          make a viral reel about my SaaS...
        </span>
        <span
          style={{
            width: 8,
            height: 18,
            backgroundColor: '#E11D48',
            display: 'inline-block',
            opacity: frame % 16 < 8 ? 1 : 0,
          }}
        />
      </div>

      {/* Exploded Isometric Layers Stack */}
      <div
        style={{
          position: 'relative',
          width: 500,
          height: 250,
          perspective: 1000,
          transform: `scale(${0.85 + stackSpring * 0.15})`,
          opacity: stackSpring,
        }}
      >
        {/* Layer 3 (Bottom): Captions Layer */}
        <div
          style={{
            position: 'absolute',
            top: interpolate(stackSpring, [0, 1], [40, 120]),
            left: 50,
            right: 50,
            height: 60,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            border: '2px solid #E2E0D8',
            boxShadow: '0 15px 30px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            transform: 'rotateX(25deg) rotateZ(-3deg)',
            zIndex: 10,
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: '#0F1115' }}>
            Layer 01: Subtitle Keyframes
          </span>
          <span
            style={{
              backgroundColor: '#FEF2F2',
              color: '#E11D48',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 20,
            }}
          >
            PRECISION SYNC
          </span>
        </div>

        {/* Layer 2 (Middle): Voiceover Audio */}
        <div
          style={{
            position: 'absolute',
            top: interpolate(stackSpring, [0, 1], [40, 60]),
            left: 40,
            right: 40,
            height: 60,
            backgroundColor: '#1E293B',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            transform: 'rotateX(25deg) rotateZ(-3deg)',
            zIndex: 20,
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
            Layer 02: Cloned Neural Audio
          </span>
          <span
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 20,
            }}
          >
            STUDIO MASTERED
          </span>
        </div>

        {/* Layer 1 (Top): Motion Graphics */}
        <div
          style={{
            position: 'absolute',
            top: interpolate(stackSpring, [0, 1], [40, 0]),
            left: 30,
            right: 30,
            height: 60,
            backgroundColor: '#E11D48',
            borderRadius: 16,
            boxShadow: '0 25px 50px rgba(225,29,72,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            transform: 'rotateX(25deg) rotateZ(-3deg)',
            zIndex: 30,
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 16, color: '#FFFFFF' }}>
            Layer 03: Spring Physics UI
          </span>
          <span
            style={{
              backgroundColor: '#FFFFFF',
              color: '#E11D48',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 20,
            }}
          >
            60 FPS SMOOTH
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scene04RealMotion;
