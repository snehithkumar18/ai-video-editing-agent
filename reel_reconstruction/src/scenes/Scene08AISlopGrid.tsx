import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene08AISlopGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const gridSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const badCards = [
    { title: 'Talking Head Loop', tag: 'LOW EFFORT' },
    { title: 'Generic Stock Collage', tag: 'NO HOOK' },
    { title: 'Robotic TTS Monotone', tag: 'ZERO PACING' },
    { title: 'Boring Static Image', tag: 'SWIPE AWAY' },
    { title: 'Bad Lip-Sync Glitch', tag: 'SLOPPY' },
    { title: 'Cluttered AI Artifacts', tag: 'NO RETENTION' },
  ];

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
          maxWidth: 600,
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
          And most AI reels look like
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
          AI slop.
        </span>
      </div>

      {/* 6-Card AI Slop Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          width: 560,
          transform: `translateY(${(1 - gridSpring) * 60}px) scale(${0.9 + gridSpring * 0.1})`,
          opacity: gridSpring,
        }}
      >
        {badCards.map((card, i) => {
          const itemSpring = spring({
            frame: frame - 12 - i * 3,
            fps,
            config: { damping: 12, stiffness: 140, mass: 0.6 },
          });

          return (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                border: '1.5px solid #CBD5E1',
                padding: '14px 12px',
                height: 125,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                filter: 'grayscale(0.4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 18 }}>⚠️</span>
                <span
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 10,
                    letterSpacing: '0.04em',
                  }}
                >
                  {card.tag}
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#334155',
                    lineHeight: 1.25,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: 10,
                    color: '#94A3B8',
                    marginTop: 4,
                  }}
                >
                  Avg Watch: 1.4s
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scene08AISlopGrid;
