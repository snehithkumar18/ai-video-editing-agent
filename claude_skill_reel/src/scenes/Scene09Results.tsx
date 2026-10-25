import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene09Results: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const reels = [
    { title: 'SaaS Launch Promo', tag: 'TECH', bg: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', icon: '🚀' },
    { title: 'AI Productivity Tips', tag: 'TOOLS', bg: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)', icon: '⚡' },
    { title: 'Storytelling Reel', tag: 'MEDIA', bg: 'linear-gradient(135deg, #831843 0%, #9D174D 100%)', icon: '📖' },
    { title: 'Crypto Market Brief', tag: 'FINANCE', bg: 'linear-gradient(135deg, #78350F 0%, #92400E 100%)', icon: '📈' },
    { title: 'Coding Masterclass', tag: 'DEV', bg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', icon: '💻' },
    { title: 'Fitness Motivation', tag: 'WELLNESS', bg: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)', icon: '🔥' },
  ];

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
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -50}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 920,
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
          ONE WORKFLOW
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 50,
            fontWeight: 800,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          Many Video Ideas
        </span>
      </div>

      {/* Grid of Completed Vertical-Video Previews */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
          width: 880,
        }}
      >
        {reels.map((r, i) => {
          const itemSpring = spring({
            frame: frame - 10 - i * 4,
            fps,
            config: { damping: 12, stiffness: 130, mass: 0.6 },
          });

          return (
            <div
              key={i}
              style={{
                background: r.bg,
                borderRadius: 22,
                height: 185,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 15px 35px rgba(0,0,0,0.14)',
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                border: '1.5px solid rgba(255,255,255,0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 12,
                  }}
                >
                  {r.tag}
                </span>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
              </div>

              <div>
                <div
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    fontWeight: 800,
                    lineHeight: 1.25,
                  }}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    color: '#CBD5E1',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  Completed 9:16 Reel
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scene09Results;
