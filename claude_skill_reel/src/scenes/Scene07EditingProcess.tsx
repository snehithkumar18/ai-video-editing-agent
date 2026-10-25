import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene07EditingProcess: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const editorSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Playhead scrubber movement
  const playheadX = interpolate(frame % 120, [0, 120], [200, 500]);

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
            fontSize: 60,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          ASSEMBLE THE VIDEO
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
          From timeline blocks to final Reel
        </span>
      </div>

      {/* Video Editor NLE Interface Mockup */}
      <div
        style={{
          width: 880,
          backgroundColor: '#0F1115',
          borderRadius: 32,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: '24px 28px',
          transform: `translateY(${(1 - editorSpring) * 60}px) scale(${0.92 + editorSpring * 0.08})`,
          opacity: editorSpring,
        }}
      >
        {/* Editor Top Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🎞️</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
              ReelTimeline.nle — 1080x1920 @ 30fps
            </span>
          </div>
          <div
            style={{
              backgroundColor: '#1E293B',
              color: '#34D399',
              fontFamily: "'Fira Code', monospace",
              fontSize: 13,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 16,
            }}
          >
            PLAYHEAD: 00:26.15
          </div>
        </div>

        {/* Multitrack Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          {/* Red Scrubbing Playhead */}
          <div
            style={{
              position: 'absolute',
              left: playheadX,
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: '#EF4444',
              boxShadow: '0 0 14px #EF4444',
              zIndex: 30,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: '#EF4444',
                position: 'absolute',
                top: 0,
                left: -5.5,
                clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
              }}
            />
          </div>

          {/* Track 1: Video Motion Graphics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 110, color: '#94A3B8', fontFamily: "'Fira Code', monospace", fontSize: 13 }}>
              V1 Motion
            </span>
            <div style={{ flex: 1, height: 42, display: 'flex', gap: 8 }}>
              <div
                style={{
                  width: '32%',
                  backgroundColor: '#3B82F6',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12,
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Hook_Intro.comp
              </div>
              <div
                style={{
                  width: '40%',
                  backgroundColor: '#0EA5E9',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12,
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Parallax_Scene.comp
              </div>
              <div
                style={{
                  width: '28%',
                  backgroundColor: '#6366F1',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12,
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Grid_Reveal.comp
              </div>
            </div>
          </div>

          {/* Track 2: Kinetic Subtitles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 110, color: '#94A3B8', fontFamily: "'Fira Code', monospace", fontSize: 13 }}>
              V2 Titles
            </span>
            <div style={{ flex: 1, height: 38, display: 'flex', gap: 6 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    backgroundColor: '#F95738',
                    borderRadius: 8,
                    opacity: 0.9,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  Word_{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Track 3: Master Audio Voiceover */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 110, color: '#94A3B8', fontFamily: "'Fira Code', monospace", fontSize: 13 }}>
              A1 Voice
            </span>
            <div
              style={{
                flex: 1,
                height: 38,
                backgroundColor: '#1E293B',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                gap: 4,
              }}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 8 + Math.abs(Math.sin(i * 0.5)) * 24,
                    backgroundColor: '#10B981',
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene07EditingProcess;
