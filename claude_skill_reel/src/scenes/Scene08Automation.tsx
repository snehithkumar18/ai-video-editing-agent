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

  const cardSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Laser highlight sweep across pipeline
  const laserX = interpolate(frame % 90, [0, 90], [-50, 900]);

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
            fontSize: 58,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          REUSABLE WORKFLOW
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 48,
            fontWeight: 700,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          Streamlined Video Production
        </span>
      </div>

      {/* Automated Pipeline Automation Card */}
      <div
        style={{
          position: 'relative',
          width: 860,
          backgroundColor: '#FFFFFF',
          borderRadius: 32,
          padding: '28px 32px',
          border: '2px solid #E5E1D8',
          boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
          transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.92 + cardSpring * 0.08})`,
          opacity: cardSpring,
          overflow: 'hidden',
        }}
      >
        {/* Laser Sweep Beam */}
        <div
          style={{
            position: 'absolute',
            left: laserX,
            top: 0,
            bottom: 0,
            width: 80,
            background: 'linear-gradient(90deg, transparent, rgba(249, 87, 56, 0.25), transparent)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: '#0D0F12',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Batch Production Engine
            </span>
          </div>
          <span
            style={{
              backgroundColor: '#ECFDF5',
              color: '#059669',
              fontFamily: "'Fira Code', monospace",
              fontSize: 14,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 20,
            }}
          >
            STATUS: 100% AUTOMATED
          </span>
        </div>

        {/* 3 Pipeline Milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { step: '01', title: 'Script & Word-Level Whispers Sync', time: '1.2s' },
            { step: '02', title: 'Remotion Scene Assembly & Physics Curves', time: '2.4s' },
            { step: '03', title: '4K H.264 Parallel Render & Export', time: '18.5s' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                backgroundColor: '#F8FAFC',
                borderRadius: 16,
                border: '1.5px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 900,
                    fontSize: 14,
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#1E293B',
                  }}
                >
                  {item.title}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 14,
                  color: '#64748B',
                  fontWeight: 600,
                }}
              >
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scene08Automation;
