import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene02TheSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.8 },
  });

  // Stamp slam down at frame 28
  const stampSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.5 },
  });

  // Lock snap at frame 42
  const lockSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.6 },
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
          maxWidth: 600,
          marginBottom: 30,
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
          I'm giving you the system, because in
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
          3 months everyone will do this
        </span>
      </div>

      {/* Main System Card */}
      <div
        style={{
          position: 'relative',
          width: 540,
          height: 380,
          transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.9 + cardSpring * 0.1})`,
          opacity: cardSpring,
        }}
      >
        {/* Calendar Tear Card Behind */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 40,
            width: 140,
            height: 150,
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            border: '2px solid #E2E0D8',
            transform: 'rotate(6deg)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              textAlign: 'center',
              padding: '4px 0',
            }}
          >
            WINDOW
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 42,
              fontWeight: 900,
              color: '#0F1115',
              marginTop: 12,
            }}
          >
            NOW
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: '#868C98',
            }}
          >
            90 DAYS LEFT
          </div>
        </div>

        {/* Black Vault / System Container */}
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 20,
            right: 20,
            backgroundColor: '#121417',
            borderRadius: 24,
            padding: '30px 28px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.22)',
            zIndex: 15,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                color: '#868C98',
              }}
            >
              system_blueprint.enc
            </div>
          </div>

          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: 8,
            }}
          >
            Viral Retention Architecture
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: '#9CA3AF',
              lineHeight: 1.4,
            }}
          >
            Automated code pipelines, spring physics curves & dynamic voiceover keyframing.
          </div>

          {/* Padlock Icon Indicator */}
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transform: `scale(${0.8 + lockSpring * 0.2})`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🔒
            </div>
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                color: '#34D399',
                fontWeight: 600,
              }}
            >
              Status: UNLOCKING FOR YOU
            </span>
          </div>

          {/* Red SEALED Rubber Stamp Ribbon Slam */}
          {frame >= 28 && (
            <div
              style={{
                position: 'absolute',
                top: 45,
                right: 25,
                transform: `rotate(-14deg) scale(${1.8 - stampSpring * 0.8})`,
                opacity: stampSpring,
                border: '5px solid #E11D48',
                borderRadius: 12,
                padding: '6px 20px',
                color: '#E11D48',
                fontFamily: "'Inter', sans-serif",
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(225, 29, 72, 0.12)',
                boxShadow: '0 0 25px rgba(225, 29, 72, 0.4)',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
              }}
            >
              SEALED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scene02TheSystem;
