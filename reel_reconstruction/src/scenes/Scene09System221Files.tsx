import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene09System221Files: React.FC = () => {
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

  // Rolling counter from 0 to 221
  const fileCount = Math.floor(
    interpolate(frame, [25, 65], [0, 221], {
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
            fontSize: 38,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          Mine don't. It's not one prompt.
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
          It's 221 modular files.
        </span>
      </div>

      {/* Dark System Card with Big Rolling Counter */}
      <div
        style={{
          width: 540,
          backgroundColor: '#0F1115',
          borderRadius: 24,
          padding: '28px 32px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
          transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.9 + cardSpring * 0.1})`,
          opacity: cardSpring,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📁</span>
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                color: '#94A3B8',
              }}
            >
              /system-architecture/
            </span>
          </div>
          <span
            style={{
              backgroundColor: '#E11D48',
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 20,
            }}
          >
            ENTERPRISE PIPELINE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 68,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            {fileCount}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: '#E11D48',
            }}
          >
            Files & Engine Components
          </div>
        </div>

        {/* Directory Structure Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['hooks.json', 'springs.ts', 'whisper_sync.py', 'elevenlabs.sh', 'render.config.js'].map(
            (fname, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#CBD5E1',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 12,
                  padding: '6px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                📄 {fname}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Scene09System221Files;
