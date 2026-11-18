import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene06StoryPurpose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const filmSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const stampSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.7 }, // Snappy stamp impact
  });

  // Film strip drift
  const filmDrift = (frame * 1.5) % 200;

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
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -45}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 950,
          marginBottom: 35,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 60,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          EVEN A SHORT FILM
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
          That Tells A Real Story
        </span>
      </div>

      {/* Cinematic Film Strip Component */}
      <div
        style={{
          width: 880,
          backgroundColor: '#0F172A',
          borderRadius: 32,
          padding: '24px 28px',
          border: '1.5px solid rgba(255,255,255,0.15)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          transform: `translateY(${(1 - filmSpring) * 60}px)`,
          opacity: filmSpring,
          marginBottom: 30,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Film Strip Sprocket Holes Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 14,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        {/* 3 Storyboard Scene Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {/* Beat 1 */}
          <div
            style={{
              backgroundColor: '#1E293B',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F95738', fontFamily: "'Fira Code', monospace" }}>
              SCENE 01 • 00:00
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
              The Hook & Struggle
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
              Creator overwhelmed by manual video editing
            </div>
          </div>

          {/* Beat 2 */}
          <div
            style={{
              backgroundColor: '#1E293B',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', fontFamily: "'Fira Code', monospace" }}>
              SCENE 02 • 00:24
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
              The Breakthrough
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
              Discovering the automated Claude Skill workflow
            </div>
          </div>

          {/* Beat 3 */}
          <div
            style={{
              backgroundColor: '#1E293B',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', fontFamily: "'Fira Code', monospace" }}>
              SCENE 03 • 00:48
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
              Viral Explosion
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
              1M+ views & thousands of automated Reels
            </div>
          </div>
        </div>

        {/* Film Strip Sprocket Holes Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 14,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Slamming Impact Stamp Badge: "SAME SKILL EVERY TIME" */}
      <div
        style={{
          transform: `scale(${stampSpring}) rotate(-3deg)`,
          opacity: stampSpring,
          backgroundColor: '#F95738',
          color: '#FFFFFF',
          padding: '16px 36px',
          borderRadius: 24,
          fontFamily: "'Inter', sans-serif",
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          boxShadow: '0 15px 40px rgba(249, 87, 56, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 24 }}>✨</span>
        <span>SAME SKILL EVERY TIME</span>
      </div>
    </div>
  );
};

export default Scene06StoryPurpose;
