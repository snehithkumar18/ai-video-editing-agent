import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene10Applications: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Spotlight active index based on frame time:
  // 0-30: Explainers, 30-60: Stories, 60-90: Product Demos, 90-120: Tutorials
  const activeIndex = Math.min(3, Math.floor(frame / 30));

  const apps = [
    { title: 'Explainers', icon: '🧠', tag: 'EDUCATIONAL', desc: 'Complex topics made simple & visual' },
    { title: 'Stories', icon: '🎭', tag: 'CREATIVE', desc: 'Narrative arcs with animated emotion' },
    { title: 'Product Demos', icon: '📱', tag: 'SAAS & TECH', desc: 'Feature walkthroughs that convert' },
    { title: 'Tutorials', icon: '🛠️', tag: 'STEP-BY-STEP', desc: 'Actionable workflows viewers save' },
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
            fontSize: 56,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          VERSATILE APPLICATIONS
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 46,
            fontWeight: 700,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          Built for every content vertical
        </span>
      </div>

      {/* 4 Application Cards with Active Spotlight */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 22,
          width: 860,
        }}
      >
        {apps.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: isActive ? '#FFFFFF' : '#F9F8F5',
                borderRadius: 26,
                padding: '24px 26px',
                border: isActive ? '3px solid #F95738' : '2px solid #E5E1D8',
                boxShadow: isActive ? '0 20px 50px rgba(249, 87, 56, 0.22)' : '0 8px 20px rgba(0,0,0,0.04)',
                transform: isActive ? 'scale(1.04)' : 'scale(1.0)',
                transition: 'all 0.15s ease',
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: isActive ? '#FFF1EE' : '#E2E8F0',
                    color: isActive ? '#F95738' : '#64748B',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 16,
                  }}
                >
                  {item.tag}
                </span>
                <span style={{ fontSize: 26 }}>{item.icon}</span>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 26,
                    fontWeight: 900,
                    color: isActive ? '#F95738' : '#0D0F12',
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: '#6B7280',
                    fontWeight: 500,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scene10Applications;
