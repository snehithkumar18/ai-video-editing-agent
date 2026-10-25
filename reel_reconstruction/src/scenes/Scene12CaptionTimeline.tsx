import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene12CaptionTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const dawSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Playhead scrub across timeline
  const playheadX = interpolate(frame % 90, [0, 90], [60, 460]);

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
          Word-timed kinetic captions
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
          where keywords land early
        </span>
      </div>

      {/* DAW Timeline Card */}
      <div
        style={{
          position: 'relative',
          width: 540,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 28px',
          border: '1px solid #E2E0D8',
          boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
          transform: `translateY(${(1 - dawSpring) * 60}px) scale(${0.9 + dawSpring * 0.1})`,
          opacity: dawSpring,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>⏱️</span>
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                fontWeight: 700,
                color: '#0F1115',
              }}
            >
              00:41.17 / 65.80
            </span>
          </div>
          <span
            style={{
              backgroundColor: '#FEF2F2',
              color: '#E11D48',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 16,
            }}
          >
            BEAT OFFSET: -120ms
          </span>
        </div>

        {/* Audio Waveform Track */}
        <div
          style={{
            position: 'relative',
            height: 90,
            backgroundColor: '#0F172A',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 4,
          }}
        >
          {/* Waveform bars */}
          {Array.from({ length: 48 }).map((_, i) => {
            const h = 12 + Math.abs(Math.sin((i + frame * 0.2) * 0.4)) * 55;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: h,
                  backgroundColor: i > 20 && i < 28 ? '#E11D48' : '#38BDF8',
                  borderRadius: 2,
                  opacity: 0.85,
                }}
              />
            );
          })}

          {/* Red DAW Playhead Line */}
          <div
            style={{
              position: 'absolute',
              left: playheadX,
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: '#EF4444',
              boxShadow: '0 0 12px #EF4444',
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#EF4444',
                position: 'absolute',
                top: 0,
                left: -4.5,
                clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
              }}
            />
          </div>
        </div>

        {/* Word Preview Strip */}
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: 15,
            color: '#64748B',
          }}
        >
          <span>lands</span>
          <span>a</span>
          <span>beat</span>
          <span
            style={{
              color: '#E11D48',
              fontSize: 20,
              border: '2px solid #E11D48',
              padding: '2px 8px',
              borderRadius: 8,
              backgroundColor: '#FFF1F2',
            }}
          >
            BEFORE
          </span>
          <span>said</span>
        </div>
      </div>
    </div>
  );
};

export default Scene12CaptionTimeline;
