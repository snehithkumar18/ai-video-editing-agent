import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PresenterAvatar } from '../components/PresenterAvatar';

export const Scene12CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const ctaSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.7 },
  });

  const badgeSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.6 },
  });

  // Pulse effect on main CTA card
  const pulse = 1.0 + Math.sin(frame * 0.12) * 0.02;

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
      {/* Grand Finale Headline */}
      <div
        style={{
          transform: `translateY(${(1 - titleSpring) * -50}px) scale(${0.9 + titleSpring * 0.1})`,
          opacity: titleSpring,
          textAlign: 'center',
          maxWidth: 920,
          marginBottom: 35,
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
          BUILD YOUR OWN WORKFLOW
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
          Start with one skill.
        </span>
      </div>

      {/* Main Action / Promotional Card */}
      <div
        style={{
          width: 860,
          backgroundColor: '#F95738',
          borderRadius: 36,
          padding: '34px 44px',
          boxShadow: '0 30px 80px rgba(249, 87, 56, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transform: `scale(${ctaSpring * pulse}) translateY(${(1 - ctaSpring) * 60}px)`,
          opacity: ctaSpring,
          marginBottom: 35,
          zIndex: 25,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Autonomous Creative Agent
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 44,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            START CREATING REELS
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            color: '#F95738',
            fontFamily: "'Inter', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            padding: '14px 28px',
            borderRadius: 24,
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          }}
        >
          NOW 🚀
        </div>
      </div>

      {/* 3 Step Micro-Pills */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          transform: `translateY(${(1 - badgeSpring) * 30}px)`,
          opacity: badgeSpring,
          zIndex: 20,
        }}
      >
        <span
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E1D8',
            color: '#1E293B',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            padding: '8px 18px',
            borderRadius: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          1. Add the Skill
        </span>
        <span
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E1D8',
            color: '#1E293B',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            padding: '8px 18px',
            borderRadius: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          2. Type Your Prompt
        </span>
        <span
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E1D8',
            color: '#1E293B',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            padding: '8px 18px',
            borderRadius: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          3. Export Ready Reel
        </span>
      </div>

      {/* Presenter Avatar with Direct Point Forward CTA */}
      <PresenterAvatar pose="pose_direct_point" scale={0.92} bottomOffset={0} />
    </div>
  );
};

export default Scene12CallToAction;
