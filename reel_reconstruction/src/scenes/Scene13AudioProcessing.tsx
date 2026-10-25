import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene13AudioProcessing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const rackSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const knobs = [
    { label: 'CUT', val: '-30dB', rot: -20 },
    { label: 'SPEED', val: '1.08x', rot: 35 },
    { label: 'LOUD', val: '-14 LUFS', rot: 50 },
    { label: 'PEAK', val: '-1.0 dB', rot: 15 },
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
          Multi-step audio chain on
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
          ElevenLabs mastered for IG
        </span>
      </div>

      {/* Audio Mastering Rack Card */}
      <div
        style={{
          width: 540,
          backgroundColor: '#0F1115',
          borderRadius: 24,
          padding: '24px 28px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.22)',
          transform: `translateY(${(1 - rackSpring) * 60}px) scale(${0.9 + rackSpring * 0.1})`,
          opacity: rackSpring,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎛️</span>
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                color: '#FFFFFF',
                fontWeight: 700,
              }}
            >
              MasteringRackPro v2
            </span>
          </div>
          <span
            style={{
              backgroundColor: '#1E293B',
              color: '#38BDF8',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 20,
              border: '1px solid #38BDF8',
            }}
          >
            ELEVENLABS SYNC
          </span>
        </div>

        {/* 4 Dials / Knobs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {knobs.map((knob, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {/* Dial Wheel */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: '#1E293B',
                  border: '3px solid #334155',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  position: 'relative',
                  transform: `rotate(${knob.rot}deg)`,
                }}
              >
                {/* Dial indicator dot */}
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 12,
                    backgroundColor: '#E11D48',
                    borderRadius: 2,
                  }}
                />
              </div>

              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#FFFFFF',
                }}
              >
                {knob.label}
              </span>
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 11,
                  color: '#E11D48',
                  fontWeight: 600,
                }}
              >
                {knob.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scene13AudioProcessing;
