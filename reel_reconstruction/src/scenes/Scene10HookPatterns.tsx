import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene10HookPatterns: React.FC = () => {
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

  const rules = [
    { title: 'Hook in <= 1.5 seconds', delay: 20 },
    { title: 'Visual event on every stressed word', delay: 42 },
    { title: 'Zero static frames > 1.2 seconds', delay: 64 },
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
          Hook patterns & pacing rules
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
          decoded in patterns.md
        </span>
      </div>

      {/* Code / Markdown Document Card */}
      <div
        style={{
          width: 540,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 28px',
          border: '1px solid #E2E0D8',
          boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
          transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.9 + cardSpring * 0.1})`,
          opacity: cardSpring,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>📝</span>
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontWeight: 700,
                fontSize: 14,
                color: '#0F1115',
              }}
            >
              patterns.md
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              color: '#10B981',
              backgroundColor: '#ECFDF5',
              padding: '4px 10px',
              borderRadius: 16,
            }}
          >
            ACTIVE ALGORITHM
          </span>
        </div>

        {/* 3 Checklist Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rules.map((rule, idx) => {
            const checkSpring = spring({
              frame: frame - rule.delay,
              fps,
              config: { damping: 11, stiffness: 140, mass: 0.6 },
            });
            const isChecked = frame >= rule.delay;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: '#F8FAFC',
                  padding: '12px 18px',
                  borderRadius: 14,
                  border: isChecked ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  transform: `translateX(${(1 - checkSpring) * -20}px)`,
                  opacity: Math.max(0.3, checkSpring),
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isChecked ? '#10B981' : '#CBD5E1',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 900,
                    transform: `scale(${isChecked ? 1 : 0.8})`,
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: isChecked ? '#0F172A' : '#64748B',
                  }}
                >
                  {rule.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Scene10HookPatterns;
