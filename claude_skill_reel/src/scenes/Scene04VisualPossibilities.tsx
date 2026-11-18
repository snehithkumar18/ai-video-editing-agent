import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene04VisualPossibilities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const card1Spring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const card2Spring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 13, stiffness: 115, mass: 0.8 },
  });

  const pillSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.6 },
  });

  // Floating stars animation
  const starPulse = (offset: number) => 0.6 + Math.sin((frame + offset) * 0.15) * 0.4;
  const moonSway = Math.sin((frame / fps) * 2) * 5;
  const creatureBounce = Math.abs(Math.sin((frame / fps) * 4)) * 14;

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
          ANY STYLE YOU WANT
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
          Bedtime Stories to Kids Animations
        </span>
      </div>

      {/* Two Illustrated Showcase Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          width: 880,
          marginBottom: 30,
        }}
      >
        {/* Card 1: Bedtime Stories for Kids */}
        <div
          style={{
            backgroundColor: '#1E1B4B',
            borderRadius: 28,
            padding: '24px 26px',
            border: '2px solid rgba(129, 140, 248, 0.4)',
            boxShadow: '0 25px 60px rgba(30, 27, 75, 0.4)',
            transform: `translateY(${(1 - card1Spring) * 60}px)`,
            opacity: card1Spring,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                backgroundColor: 'rgba(129, 140, 248, 0.25)',
                color: '#C7D2FE',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              🌙 BEDTIME STORIES
            </span>
            <span style={{ fontSize: 13, color: '#A5B4FC', fontFamily: "'Fira Code', monospace" }}>
              STYLE #01
            </span>
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
            Whimsical Dreamscape
          </div>

          {/* SVG Illustrated Night Sky with Moon & Stars */}
          <div style={{ position: 'relative', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glowing Golden Crescent Moon */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              style={{ transform: `translateY(${moonSway}px)` }}
            >
              <path
                d="M 50 10 A 40 40 0 1 0 85 75 A 32 32 0 1 1 50 10 Z"
                fill="#FDE047"
                filter="drop-shadow(0 0 12px rgba(253, 224, 71, 0.6))"
              />
              {/* Moon eye */}
              <circle cx="48" cy="46" r="3" fill="#854D0E" />
              <path d="M 44 58 Q 50 64 56 58" stroke="#854D0E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>

            {/* Twinkling Stars */}
            <div style={{ position: 'absolute', top: 20, left: 30, fontSize: 18, opacity: starPulse(0) }}>✨</div>
            <div style={{ position: 'absolute', top: 30, right: 40, fontSize: 14, opacity: starPulse(15) }}>⭐</div>
            <div style={{ position: 'absolute', bottom: 30, left: 50, fontSize: 16, opacity: starPulse(30) }}>🌟</div>
            <div style={{ position: 'absolute', bottom: 20, right: 50, fontSize: 12, opacity: starPulse(45) }}>✨</div>
          </div>
        </div>

        {/* Card 2: Kids Animations */}
        <div
          style={{
            backgroundColor: '#FFFBEB',
            borderRadius: 28,
            padding: '24px 26px',
            border: '2px solid #FCD34D',
            boxShadow: '0 25px 60px rgba(245, 158, 11, 0.15)',
            transform: `translateY(${(1 - card2Spring) * 60}px)`,
            opacity: card2Spring,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: 20,
              }}
            >
              🎨 KIDS ANIMATION
            </span>
            <span style={{ fontSize: 13, color: '#B45309', fontFamily: "'Fira Code', monospace" }}>
              STYLE #02
            </span>
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: '#1E293B', marginBottom: 16 }}>
            Bouncy Cartoon Play
          </div>

          {/* SVG Cute Bouncy Monster Character */}
          <div style={{ position: 'relative', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width="140"
              height="140"
              viewBox="0 0 100 100"
              style={{ transform: `translateY(${-creatureBounce}px)` }}
            >
              {/* Cute Round Creature Body */}
              <circle cx="50" cy="55" r="36" fill="#F95738" />
              {/* Soft belly */}
              <ellipse cx="50" cy="62" rx="22" ry="18" fill="#FDBA74" />
              {/* Big Expressive Cartoon Eyes */}
              <circle cx="40" cy="46" r="11" fill="#FFFFFF" />
              <circle cx="60" cy="46" r="11" fill="#FFFFFF" />
              <circle cx="42" cy="46" r="6" fill="#0F172A" />
              <circle cx="62" cy="46" r="6" fill="#0F172A" />
              <circle cx="44" cy="43" r="2.5" fill="#FFFFFF" />
              <circle cx="64" cy="43" r="2.5" fill="#FFFFFF" />
              {/* Cheerful Smile */}
              <path d="M 44 60 Q 50 68 56 60" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Little cute waving hands */}
              <circle cx="16" cy="52" r="6" fill="#F95738" />
              <circle cx="84" cy="52" r="6" fill="#F95738" />
            </svg>
          </div>
        </div>
      </div>

      {/* Step 3: Interactive Style Switcher Pills */}
      <div
        style={{
          width: 880,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '16px 28px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
          transform: `scale(${pillSpring})`,
          opacity: pillSpring,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
          GENERATE ANY GENRE IN CODE:
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          {['🌙 Bedtime Stories', '🎨 Kids Cartoons', '📊 Data Visuals', '🎬 Cinematic Story'].map((st, i) => (
            <span
              key={i}
              style={{
                backgroundColor: i === 0 || i === 1 ? '#0F172A' : '#F1F5F9',
                color: i === 0 || i === 1 ? '#FFFFFF' : '#475569',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 16,
              }}
            >
              {st}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scene04VisualPossibilities;
