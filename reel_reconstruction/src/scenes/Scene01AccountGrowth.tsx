import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene01AccountGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline entrance
  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Dark notification card entrance
  const notifSpring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.7 },
  });

  // Profile card entrance
  const cardSpring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.8 },
  });

  // Follower counter rolling effect
  const followersCount = Math.floor(
    interpolate(frame, [30, 90], [1240, 39512], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

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
      {/* Scene Headline */}
      <div
        style={{
          transform: `translateY(${(1 - headlineSpring) * -40}px) scale(${0.9 + headlineSpring * 0.1})`,
          opacity: headlineSpring,
          textAlign: 'center',
          maxWidth: 620,
          marginBottom: 35,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 44,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            display: 'block',
          }}
        >
          I grew this account to almost
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
          40,000 followers
        </span>
      </div>

      {/* Floating Card Stack */}
      <div style={{ position: 'relative', width: 560, height: 380 }}>
        {/* Dark Notification Card */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            transform: `translateY(${(1 - notifSpring) * 60}px) scale(${0.85 + notifSpring * 0.15})`,
            opacity: notifSpring,
            backgroundColor: '#121417',
            borderRadius: 22,
            padding: '18px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.08)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#E11D48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 22,
              }}
            >
              ⚡
            </div>
            <div>
              <div
                style={{
                  color: '#FFFFFF',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Viral Growth Velocity
              </div>
              <div
                style={{
                  color: '#868C98',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                }}
              >
                +1,280 new followers today
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: '#E11D48',
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              padding: '6px 14px',
              borderRadius: 30,
            }}
          >
            +18%
          </div>
        </div>

        {/* Profile Stats White Card */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 40,
            right: 40,
            transform: `translateY(${(1 - cardSpring) * 80}px) scale(${0.9 + cardSpring * 0.1})`,
            opacity: cardSpring,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: '24px 28px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.05)',
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 800,
                border: '3px solid #E11D48',
              }}
            >
              AI
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#0F1115',
                }}
              >
                @aicreator.system
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#525866',
                }}
              >
                High-Retention Motion Lab
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8F7F4',
              borderRadius: 16,
              padding: '14px 20px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: '#868C98',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Followers (35 Days)
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#0F1115',
                  letterSpacing: '-0.03em',
                }}
              >
                {followersCount.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#E11D48',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 20,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)',
              }}
            >
              +39.5K 🔥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene01AccountGrowth;
