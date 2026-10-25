import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene11MotionPhysics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const panelSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Spring dial needle rotation
  const dialRotation = interpolate(
    frame % 60,
    [0, 20, 40, 60],
    [-45, 60, 40, -45]
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
            fontSize: 40,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          Spring physics & zoom kicks
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
          tuned with precision damping
        </span>
      </div>

      {/* Software Physics Panel Card */}
      <div
        style={{
          width: 540,
          backgroundColor: '#121417',
          borderRadius: 24,
          padding: '24px 28px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 55px rgba(0,0,0,0.22)',
          transform: `translateY(${(1 - panelSpring) * 60}px) scale(${0.9 + panelSpring * 0.1})`,
          opacity: panelSpring,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#E11D48',
                boxShadow: '0 0 10px #E11D48',
              }}
            />
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                color: '#F8FAFC',
                fontWeight: 600,
              }}
            >
              ZoomKickEngine.tsx
            </span>
          </div>
          <span
            style={{
              backgroundColor: 'rgba(225,29,72,0.15)',
              color: '#E11D48',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 20,
              border: '1px solid rgba(225,29,72,0.3)',
            }}
          >
            VELOCITY SNAP
          </span>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {/* Target Reticle */}
          <div
            style={{
              position: 'relative',
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: '2px dashed #E11D48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: 1,
                backgroundColor: '#E11D48',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                height: '100%',
                width: 1,
                backgroundColor: '#E11D48',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '3px solid #FFFFFF',
                backgroundColor: '#E11D48',
                boxShadow: '0 0 15px #E11D48',
              }}
            />
          </div>

          {/* Damping & Stiffness Slider Gauges */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#94A3B8',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span>mass: 0.8</span>
                <span style={{ color: '#E11D48' }}>stiffness: 140</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 8,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '85%',
                    height: '100%',
                    backgroundColor: '#E11D48',
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#94A3B8',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span>damping: 12</span>
                <span style={{ color: '#10B981' }}>overshoot: 1.14x</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 8,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '70%',
                    height: '100%',
                    backgroundColor: '#10B981',
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene11MotionPhysics;
