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

  const phoneSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 115, mass: 0.75 },
  });

  const badgeSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.65 },
  });

  // Playhead scrubber across timeline
  const playheadPercent = interpolate(frame % 90, [0, 90], [10, 90]);

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
          maxWidth: 960,
          marginBottom: 30,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 56,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          THIS REEL YOU'RE WATCHING RIGHT NOW?
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 68,
            fontWeight: 800,
            color: '#F95738',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 6,
          }}
        >
          Claude Made It.
        </span>
      </div>

      {/* Interactive Smartphone Video Player Card */}
      <div
        style={{
          width: 860,
          backgroundColor: '#0F172A',
          borderRadius: 36,
          padding: '24px 32px',
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          transform: `translateY(${(1 - phoneSpring) * 60}px) scale(${0.92 + phoneSpring * 0.08})`,
          opacity: phoneSpring,
          marginBottom: 24,
        }}
      >
        {/* Top Video Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444', animation: 'blink 1s infinite' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
              LIVE PLAYBACK • 1080 × 1920
            </span>
          </div>
          <span
            style={{
              backgroundColor: 'rgba(249, 87, 56, 0.2)',
              color: '#F95738',
              fontFamily: "'Fira Code', monospace",
              fontSize: 13,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 20,
            }}
          >
            FRAME {frame} / 1486
          </span>
        </div>

        {/* Video Scrubber Timeline Track */}
        <div style={{ position: 'relative', height: 12, backgroundColor: '#334155', borderRadius: 6, marginBottom: 24 }}>
          {/* Filled progress bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${playheadPercent}%`,
              backgroundColor: '#F95738',
              borderRadius: 6,
            }}
          />
          {/* Active playhead scrubber circle */}
          <div
            style={{
              position: 'absolute',
              left: `${playheadPercent}%`,
              top: -6,
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 12px rgba(249, 87, 56, 0.8)',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* Multi-Track Composition Layers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Track 1: Video Graphics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 100, fontSize: 13, fontWeight: 700, color: '#94A3B8', fontFamily: "'Fira Code', monospace" }}>
              VIDEO 1
            </span>
            <div style={{ flex: 1, height: 36, backgroundColor: '#1E293B', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 16px', border: '1px solid #38BDF8' }}>
              <span style={{ color: '#38BDF8', fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                🎨 Motion Graphic Scenes & SVG Layers
              </span>
            </div>
          </div>

          {/* Track 2: Presenter Character */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 100, fontSize: 13, fontWeight: 700, color: '#94A3B8', fontFamily: "'Fira Code', monospace" }}>
              AVATAR
            </span>
            <div style={{ flex: 1, height: 36, backgroundColor: '#1E293B', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 16px', border: '1px solid #F95738' }}>
              <span style={{ color: '#F95738', fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                👤 Tech Hoodie Guy (Speech Lip-Sync & Hands)
              </span>
            </div>
          </div>

          {/* Track 3: Voiceover Audio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 100, fontSize: 13, fontWeight: 700, color: '#94A3B8', fontFamily: "'Fira Code', monospace" }}>
              AUDIO 1
            </span>
            <div style={{ flex: 1, height: 36, backgroundColor: '#1E293B', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 16px', border: '1px solid #10B981' }}>
              <span style={{ color: '#10B981', fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                🎙️ Master Voiceover (Whisper Word Timestamps)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Verification Badge */}
      <div
        style={{
          transform: `scale(${badgeSpring})`,
          opacity: badgeSpring,
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          padding: '12px 32px',
          border: '2px solid #E2E8F0',
          boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ color: '#10B981', fontSize: 22 }}>✓</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 800, color: '#0F172A' }}>
          EVERY SINGLE FRAME GENERATED VIA CODE
        </span>
      </div>
    </div>
  );
};

export default Scene07EditingProcess;
