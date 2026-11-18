import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene11Reusability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cardSpring = spring({
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
          marginBottom: 30,
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 58,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          ALL WITH JUST A CLAUDE SUBSCRIPTION
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
          Zero Extra Costs • 100% Free Tooling
        </span>
      </div>

      {/* Value Comparison Card */}
      <div
        style={{
          width: 880,
          backgroundColor: '#FFFFFF',
          borderRadius: 32,
          padding: '24px 32px',
          border: '2px solid #E2E8F0',
          boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
          transform: `translateY(${(1 - cardSpring) * 50}px)`,
          opacity: cardSpring,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
          marginBottom: 30,
        }}
      >
        {/* Cost Comparison Left: Traditional */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: 20, fontWeight: 900 }}>
            ✕
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748B', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
              TRADITIONAL TOOLS
            </div>
            <div style={{ fontSize: 22, color: '#94A3B8', fontFamily: "'Inter', sans-serif", fontWeight: 800, textDecoration: 'line-through' }}>
              $500–$2,000 / mo
            </div>
          </div>
        </div>

        <div style={{ height: 40, width: 2, backgroundColor: '#E2E8F0' }} />

        {/* Cost Comparison Right: Claude Skill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontSize: 22, fontWeight: 900 }}>
            ✓
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#10B981', fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              CLAUDE SKILL WORKFLOW
            </div>
            <div style={{ fontSize: 28, color: '#0F172A', fontFamily: "'Inter', sans-serif", fontWeight: 900 }}>
              $20 / mo (Pro Account)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene11Reusability;
