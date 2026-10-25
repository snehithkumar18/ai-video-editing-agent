import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene07DotTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const ticketSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.6 },
  });

  // Dot wipe wave progress
  const wipeProgress = interpolate(frame, [25, 48], [0, 1], {
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
        paddingTop: 130,
        pointerEvents: 'none',
      }}
    >
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - headlineSpring) * -40}px) scale(${0.9 + headlineSpring * 0.1})`,
          opacity: headlineSpring,
          textAlign: 'center',
          maxWidth: 600,
          marginBottom: 35,
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 52,
            fontWeight: 800,
            color: '#E11D48',
            letterSpacing: '-0.02em',
            display: 'block',
          }}
        >
          First come,
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 44,
            fontWeight: 900,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
            marginTop: 4,
          }}
        >
          first served.
        </span>
      </div>

      {/* Red Priority Ticket No. 2481 */}
      <div
        style={{
          position: 'relative',
          width: 460,
          height: 180,
          backgroundColor: '#E11D48',
          borderRadius: 20,
          boxShadow: '0 25px 60px rgba(225,29,72,0.35)',
          padding: '24px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF',
          transform: `translateY(${(1 - ticketSpring) * 80}px) rotate(${-4 + ticketSpring * 4}deg) scale(${0.85 + ticketSpring * 0.15})`,
          opacity: ticketSpring,
          border: '2px dashed rgba(255,255,255,0.4)',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.9,
              marginBottom: 4,
            }}
          >
            Priority Access Ticket
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            NO. 002481
          </div>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 13,
              opacity: 0.85,
            }}
          >
            TIER: EARLY SYSTEM OPERATOR
          </div>
        </div>

        {/* Barcode Mockup */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            height: 90,
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: '10px 14px',
            borderRadius: 12,
          }}
        >
          {[4, 2, 6, 3, 2, 5, 2, 7, 3, 5, 2, 4, 6].map((w, i) => (
            <div key={i} style={{ width: w, height: '100%', backgroundColor: '#0F1115' }} />
          ))}
        </div>
      </div>

      {/* Dot Matrix Wipe Wave */}
      {wipeProgress > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle, #E11D48 ${wipeProgress * 80}%, transparent ${wipeProgress * 100}%)`,
              opacity: interpolate(wipeProgress, [0, 0.7, 1], [0.1, 0.4, 0]),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Scene07DotTransition;
