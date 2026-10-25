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

  const deskSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Steam animation for coffee cup
  const steamY = (frame * 1.5) % 40;
  const steamOpacity = interpolate(steamY, [0, 20, 40], [0.8, 0.4, 0]);

  // Creator subtle typing pulse
  const handPulse = Math.sin(frame * 0.8) * 3;

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
            fontSize: 58,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          EVERY SCENE HAS A PURPOSE
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
          Visuals that support the message
        </span>
      </div>

      {/* Warm Editorial Illustration: Creator at Desk */}
      <div
        style={{
          position: 'relative',
          width: 860,
          height: 480,
          backgroundColor: '#FFFFFF',
          borderRadius: 36,
          border: '3px solid #E5E1D8',
          boxShadow: '0 25px 65px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transform: `translateY(${(1 - deskSpring) * 60}px) scale(${0.92 + deskSpring * 0.08})`,
          opacity: deskSpring,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Soft studio window light beam in background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            width: 300,
            height: '100%',
            background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.4) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Editorial SVG Scene: Desk, Laptop, Coffee, Creator */}
        <svg width="780" height="420" viewBox="0 0 780 420">
          {/* Wooden Modern Desk Surface */}
          <rect x="60" y="270" width="660" height="24" rx="6" fill="#D97706" />
          <rect x="100" y="294" width="20" height="120" fill="#92400E" />
          <rect x="660" y="294" width="20" height="120" fill="#92400E" />

          {/* Steaming Coffee Mug */}
          <rect x="140" y="225" width="34" height="45" rx="6" fill="#F95738" />
          <path d="M 174 235 C 185 235 185 255 174 255" stroke="#F95738" strokeWidth="5" fill="none" />
          {/* Steam wisps */}
          <path
            d={`M 152 ${215 - steamY} Q 158 ${205 - steamY} 150 ${195 - steamY}`}
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity={steamOpacity}
          />

          {/* Desk Plant in Terracotta Pot */}
          <rect x="600" y="235" width="40" height="35" rx="4" fill="#C2410C" />
          <ellipse cx="620" cy="210" rx="20" ry="30" fill="#10B981" />
          <ellipse cx="635" cy="220" rx="16" ry="24" fill="#059669" />

          {/* Laptop Body & Glowing Screen */}
          <rect x="250" y="160" width="200" height="110" rx="8" fill="#1E293B" />
          <rect x="260" y="170" width="180" height="90" rx="4" fill="#0EA5E9" opacity="0.9" />
          {/* Code/Storyboard preview lines inside laptop screen */}
          <rect x="275" y="185" width="90" height="8" rx="2" fill="#FFFFFF" />
          <rect x="275" y="200" width="130" height="6" rx="2" fill="rgba(255,255,255,0.7)" />
          <rect x="275" y="212" width="110" height="6" rx="2" fill="rgba(255,255,255,0.7)" />
          <rect x="275" y="224" width="70" height="6" rx="2" fill="#F95738" />
          {/* Laptop Base */}
          <polygon points="230,270 470,270 450,265 250,265" fill="#334155" />

          {/* Creator Figure sitting and working */}
          <ellipse cx="500" cy="140" rx="36" ry="42" fill="#FCD34D" />
          {/* Styled hair */}
          <path d="M 465 130 C 470 95 530 95 535 130 Z" fill="#1E293B" />
          {/* Torso with animated typing arm */}
          <path d="M 455 182 Q 500 170 545 182 L 535 270 L 465 270 Z" fill="#3B82F6" />
          {/* Arm extending to laptop with subtle typing pulse */}
          <path
            d={`M 465 200 Q 420 220 370 ${255 + handPulse}`}
            stroke="#FCD34D"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Floating Purpose Badge */}
        <div
          style={{
            position: 'absolute',
            top: 25,
            right: 35,
            backgroundColor: '#FFF1EE',
            color: '#F95738',
            border: '2px solid #F95738',
            borderRadius: 20,
            padding: '8px 18px',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          🎯 INTENTIONAL PACING
        </div>
      </div>
    </div>
  );
};

export default Scene06StoryPurpose;
