import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene15SingleLineInput: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const termSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const fullCommand = 'claude "make a reel about my app"';
  const charCount = Math.floor(
    interpolate(frame, [20, 65], [0, fullCommand.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedCommand = fullCommand.slice(0, charCount);

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
          You type one single line into
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
          Claude Code, Cursor, or Codex
        </span>
      </div>

      {/* Dark IDE Terminal Card */}
      <div
        style={{
          width: 540,
          backgroundColor: '#0B0D0F',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          transform: `translateY(${(1 - termSpring) * 60}px) scale(${0.9 + termSpring * 0.1})`,
          opacity: termSpring,
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            backgroundColor: '#16191E',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 12,
              color: '#94A3B8',
            }}
          >
            bash — zsh (agent-terminal)
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Terminal Body */}
        <div style={{ padding: '24px 28px', minHeight: 140 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                color: '#E11D48',
                fontFamily: "'Fira Code', monospace",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              ~/reels $
            </span>
            <span
              style={{
                color: '#38BDF8',
                fontFamily: "'Fira Code', monospace",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {typedCommand}
            </span>
            <span
              style={{
                width: 10,
                height: 20,
                backgroundColor: '#E11D48',
                display: 'inline-block',
                opacity: frame % 16 < 8 ? 1 : 0,
              }}
            />
          </div>

          {frame >= 68 && (
            <div
              style={{
                marginTop: 18,
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                color: '#10B981',
                lineHeight: 1.6,
              }}
            >
              <div>✨ Parsed intent: Viral Reel Master</div>
              <div>⚡ Generating script, audio synth & motion composition...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scene15SingleLineInput;
