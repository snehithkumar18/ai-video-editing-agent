import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene19CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const bubbleSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 11, stiffness: 130, mass: 0.6 },
  });

  const commentCardsSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.7 },
  });

  // Pulse effect on SKILL bubble
  const pulse = 1.0 + Math.sin(frame * 0.15) * 0.03;

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
            fontSize: 42,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          Comment
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
          below to get the system
        </span>
      </div>

      {/* Giant Coral Red Speech Bubble "SKILL" */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#E11D48',
          borderRadius: 36,
          padding: '24px 50px',
          boxShadow:
            '0 25px 60px rgba(225, 29, 72, 0.45), 0 0 30px rgba(225, 29, 72, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transform: `scale(${bubbleSpring * pulse}) translateY(${(1 - bubbleSpring) * 60}px)`,
          opacity: bubbleSpring,
          marginBottom: 30,
        }}
      >
        <span style={{ fontSize: 44 }}>💬</span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 54,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          "SKILL"
        </span>

        {/* Speech Bubble Pointer Tail */}
        <div
          style={{
            position: 'absolute',
            bottom: -16,
            left: 60,
            width: 0,
            height: 0,
            borderLeft: '16px solid transparent',
            borderRight: '16px solid transparent',
            borderTop: '18px solid #E11D48',
          }}
        />
      </div>

      {/* Simulated Automated DM Comments Incoming */}
      <div
        style={{
          width: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          transform: `translateY(${(1 - commentCardsSpring) * 50}px)`,
          opacity: commentCardsSpring,
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '14px 20px',
            border: '1px solid #E2E0D8',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              M
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700 }}>
              @mark_tech: <span style={{ color: '#E11D48' }}>SKILL</span>
            </div>
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: '#10B981',
              fontWeight: 700,
            }}
          >
            ✓ Sent in DMs
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '14px 20px',
            border: '1px solid #E2E0D8',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              E
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700 }}>
              @elena_design: <span style={{ color: '#E11D48' }}>SKILL</span>
            </div>
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: '#10B981',
              fontWeight: 700,
            }}
          >
            ✓ Sent in DMs
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scene19CallToAction;
