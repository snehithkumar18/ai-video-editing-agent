import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene12CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const commentBoxSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const slotsSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.7 },
  });

  const stepStampSpring = spring({
    frame: frame - 90, // Syncs with "Step by step" at the end of audio
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.65 },
  });

  // Typing simulation in comment box
  const typingChars = Math.min(9, Math.max(0, Math.floor((frame - 15) * 0.8)));
  const commentText = 'UNLIMITED'.slice(0, typingChars);

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
      {/* Grand Finale Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -45}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 950,
          marginBottom: 26,
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
          COMMENT "UNLIMITED"
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
          First 150 People Get These Skills Free
        </span>
      </div>

      {/* Step 1: Interactive Instagram Comment Box Mockup */}
      <div
        style={{
          width: 860,
          backgroundColor: '#FFFFFF',
          borderRadius: 28,
          padding: '16px 24px',
          border: '2.5px solid #F95738',
          boxShadow: '0 20px 60px rgba(249, 87, 56, 0.25)',
          transform: `translateY(${(1 - commentBoxSpring) * 50}px)`,
          opacity: commentBoxSpring,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 25,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>💬</span>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 900, color: '#0D0F12' }}>
            {commentText}
            {typingChars < 9 && <span style={{ color: '#F95738' }}>|</span>}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#F95738',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            padding: '10px 22px',
            borderRadius: 20,
            boxShadow: '0 4px 15px rgba(249, 87, 56, 0.4)',
          }}
        >
          POST COMMENT ➔
        </div>
      </div>

      {/* Step 2: Slot Limit Counter Badge */}
      <div
        style={{
          transform: `scale(${slotsSpring})`,
          opacity: slotsSpring,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 28px',
          borderRadius: 30,
          zIndex: 25,
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 800, color: '#10B981' }}>
            LIMITED ACCESS:
          </span>
        </div>
        <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 15, fontWeight: 700 }}>
          127 / 150 CLAIMED (23 SPOTS REMAINING)
        </span>
      </div>

      {/* Step 3: Slamming Stamp on "Step by step" */}
      {frame >= 85 && (
        <div
          style={{
            marginTop: 18,
            transform: `scale(${stepStampSpring}) rotate(-2deg)`,
            opacity: stepStampSpring,
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '12px 32px',
            borderRadius: 24,
            fontFamily: "'Inter', sans-serif",
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '0.04em',
            boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
            zIndex: 30,
          }}
        >
          🚀 STEP BY STEP SETUP INCLUDED FREE
        </div>
      )}
    </div>
  );
};

export default Scene12CallToAction;
