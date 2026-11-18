import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene08Automation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Beat 1: "Every word." (Arrives at frame ~10)
  const wordCardSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.65 },
  });

  // Beat 2: "Every animation." (Arrives at frame ~38)
  const animCardSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.65 },
  });

  // Beat 3: "Every sound effect." (Arrives at frame ~72)
  const soundCardSpring = spring({
    frame: frame - 72,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.65 },
  });

  // Audio spectrum EQ bouncing animation
  const eqBars = [0.4, 0.8, 1.0, 0.6, 0.9, 0.5, 0.7, 0.95, 0.65, 0.85, 0.3, 0.75];

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
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -45}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 950,
          marginBottom: 35,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 60,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          STEP-BY-STEP PERFECTION
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 66,
            fontWeight: 800,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 6,
          }}
        >
          Words • Animations • Audio
        </span>
      </div>

      {/* 3 Step-by-Step Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          width: 900,
        }}
      >
        {/* Card 1: Every Word */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            padding: '24px 22px',
            border: '2px solid #E2E8F0',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
            transform: `translateY(${(1 - wordCardSpring) * 60}px) scale(${0.9 + wordCardSpring * 0.1})`,
            opacity: wordCardSpring,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span
              style={{
                backgroundColor: 'rgba(249, 87, 56, 0.12)',
                color: '#F95738',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 12px',
                borderRadius: 16,
              }}
            >
              BEAT 01
            </span>
            <span style={{ fontSize: 18 }}>📝</span>
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>
            Every Word.
          </div>

          <div style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: '#64748B' }}>
              word: "Claude"
            </div>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: '#10B981', marginTop: 4 }}>
              start: 28.78s • end: 29.90s
            </div>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: '#F95738', marginTop: 4 }}>
              color: "#F95738" (Zero Box)
            </div>
          </div>
        </div>

        {/* Card 2: Every Animation */}
        <div
          style={{
            backgroundColor: '#0F172A',
            borderRadius: 28,
            padding: '24px 22px',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)',
            transform: `translateY(${(1 - animCardSpring) * 60}px) scale(${0.9 + animCardSpring * 0.1})`,
            opacity: animCardSpring,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span
              style={{
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                color: '#38BDF8',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 12px',
                borderRadius: 16,
              }}
            >
              BEAT 02
            </span>
            <span style={{ fontSize: 18 }}>⚡</span>
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 12 }}>
            Every Animation.
          </div>

          {/* SVG Spring Curve Graph */}
          <div style={{ backgroundColor: '#1E293B', borderRadius: 16, padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <svg width="100%" height="60" viewBox="0 0 200 60">
              <path
                d="M 10 50 C 40 10 70 5 110 5 C 150 5 170 5 190 5"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3"
              />
              {/* Tracing Dot */}
              <circle
                cx={interpolate(frame % 40, [0, 40], [10, 190])}
                cy={15}
                r="6"
                fill="#F95738"
                filter="drop-shadow(0 0 6px #F95738)"
              />
            </svg>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
              spring: damping 14, mass 0.8
            </div>
          </div>
        </div>

        {/* Card 3: Every Sound Effect */}
        <div
          style={{
            backgroundColor: '#1E1B4B',
            borderRadius: 28,
            padding: '24px 22px',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 20px 50px rgba(30, 27, 75, 0.3)',
            transform: `translateY(${(1 - soundCardSpring) * 60}px) scale(${0.9 + soundCardSpring * 0.1})`,
            opacity: soundCardSpring,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                color: '#10B981',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 12px',
                borderRadius: 16,
              }}
            >
              BEAT 03
            </span>
            <span style={{ fontSize: 18 }}>🎵</span>
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 12 }}>
            Every Sound.
          </div>

          {/* Dynamic Audio Spectrum Visualizer */}
          <div style={{ backgroundColor: '#0F172A', borderRadius: 16, padding: '14px 10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 75 }}>
            {eqBars.map((baseHeight, idx) => {
              const liveH = Math.max(10, Math.sin(frame * 0.3 + idx * 0.8) * 35 + baseHeight * 25);
              return (
                <div
                  key={idx}
                  style={{
                    width: 10,
                    height: liveH,
                    backgroundColor: idx % 2 === 0 ? '#10B981' : '#F95738',
                    borderRadius: 4,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene08Automation;
