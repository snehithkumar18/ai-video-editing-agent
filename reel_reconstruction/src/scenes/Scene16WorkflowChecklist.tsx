import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene16WorkflowChecklist: React.FC = () => {
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

  const steps = [
    { title: 'Writes Script', icon: '✍️', delay: 10 },
    { title: 'Voices Audio', icon: '🎙️', delay: 25 },
    { title: 'Animates Graphics', icon: '⚡', delay: 40 },
    { title: 'Renders Reel', icon: '🎬', delay: 55 },
  ];

  const overallProgress = interpolate(frame, [15, 70], [10, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
            fontSize: 40,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          and it writes, voices, animates,
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 46,
            fontWeight: 700,
            color: '#E11D48',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          and renders the whole reel
        </span>
      </div>

      {/* Workflow Stages Card */}
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
        {/* Progress Bar Header */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
              }}
            >
              End-to-End Pipeline
            </span>
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                fontWeight: 700,
                color: '#E11D48',
              }}
            >
              {Math.floor(overallProgress)}% DONE
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 10,
              backgroundColor: '#F1F5F9',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${overallProgress}%`,
                height: '100%',
                backgroundColor: '#E11D48',
                borderRadius: 6,
                transition: 'width 0.1s ease',
              }}
            />
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {steps.map((st, i) => {
            const isDone = frame >= st.delay;
            const itemSpring = spring({
              frame: frame - st.delay,
              fps,
              config: { damping: 11, stiffness: 140, mass: 0.5 },
            });

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  backgroundColor: isDone ? '#ECFDF5' : '#F8FAFC',
                  border: isDone ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  transform: `scale(${isDone ? 0.95 + itemSpring * 0.05 : 0.95})`,
                }}
              >
                <span style={{ fontSize: 20 }}>{st.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: isDone ? '#065F46' : '#64748B',
                    }}
                  >
                    {st.title}
                  </div>
                </div>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#10B981' : '#CBD5E1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Scene16WorkflowChecklist;
