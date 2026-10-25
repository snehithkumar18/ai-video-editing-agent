import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene14ReviewRelease: React.FC = () => {
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

  const fixProgress = interpolate(frame, [40, 75], [0, 1], {
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
          It scores its own motion
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
          and auto-fixes weak pacing
        </span>
      </div>

      {/* QC Film Cell Review Card */}
      <div
        style={{
          position: 'relative',
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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#0F1115',
            }}
          >
            Autonomous QC Inspector
          </span>
          <span
            style={{
              backgroundColor: fixProgress < 0.8 ? '#FEF2F2' : '#ECFDF5',
              color: fixProgress < 0.8 ? '#DC2626' : '#10B981',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 20,
            }}
          >
            {fixProgress < 0.8 ? 'AUTOTESTING...' : 'PASSED BENCHMARK'}
          </span>
        </div>

        {/* Film Strip Display */}
        <div
          style={{
            height: 120,
            backgroundColor: '#0F172A',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inspection Reticle */}
          <div
            style={{
              position: 'absolute',
              left: interpolate(frame % 80, [0, 80], [30, 450]),
              top: 0,
              bottom: 0,
              width: 50,
              border: '2px solid #E11D48',
              backgroundColor: 'rgba(225, 29, 72, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#E11D48', fontSize: 16 }}>🔍</span>
          </div>

          <div style={{ zIndex: 10 }}>
            <div style={{ color: '#94A3B8', fontFamily: "'Fira Code', monospace", fontSize: 12 }}>
              HOOK IMPACT
            </div>
            <div
              style={{
                color: fixProgress < 0.8 ? '#EF4444' : '#10B981',
                fontFamily: "'Inter', sans-serif",
                fontSize: 32,
                fontWeight: 900,
              }}
            >
              {fixProgress < 0.8 ? '2.9 / 10' : '9.8 / 10'}
            </div>
          </div>

          <div style={{ zIndex: 10, textAlign: 'right' }}>
            <div style={{ color: '#94A3B8', fontFamily: "'Fira Code', monospace", fontSize: 12 }}>
              ACTION TAKEN
            </div>
            <div
              style={{
                color: '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {fixProgress < 0.8 ? 'Tightening dead air...' : 'Speedup 1.15x applied'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene14ReviewRelease;
