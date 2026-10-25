import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene05Variety: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cards = [
    {
      title: 'Kinetic Typography',
      tag: 'BOLD EDITORIAL',
      color: '#F95738',
      bg: '#111418',
      anim: 'slide',
      delay: 10,
      preview: 'TEXT SNAP & JUMP',
    },
    {
      title: 'Character-Led',
      tag: 'REAL PRESENTERS',
      color: '#10B981',
      bg: '#FFFFFF',
      anim: 'scale',
      delay: 22,
      preview: 'SYNCD AVATAR / GESTURES',
    },
    {
      title: '3D UI Mockups',
      tag: 'SPRING PHYSICS',
      color: '#0EA5E9',
      bg: '#FFFFFF',
      anim: 'mask',
      delay: 34,
      preview: 'ISOMETRIC PERSPECTIVE',
    },
    {
      title: 'Educational Explainer',
      tag: 'DIAGRAMS & CHARTS',
      color: '#8B5CF6',
      bg: '#111418',
      anim: 'slide',
      delay: 46,
      preview: 'DATA-DRIVEN STORY',
    },
  ];

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
          marginBottom: 40,
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
          MORE VISUAL VARIETY
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
          Keep every second engaging
        </span>
      </div>

      {/* 4-Card Varied Entrance Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
          width: 860,
        }}
      >
        {cards.map((card, idx) => {
          const itemSpring = spring({
            frame: frame - card.delay,
            fps,
            config: { damping: 12, stiffness: 120, mass: 0.7 },
          });

          // Different entrance transforms based on card.anim
          let transformStyle = '';
          if (card.anim === 'slide') {
            transformStyle = `translateY(${(1 - itemSpring) * 60}px) scale(${0.9 + itemSpring * 0.1})`;
          } else if (card.anim === 'scale') {
            transformStyle = `scale(${itemSpring})`;
          } else {
            transformStyle = `translateX(${(1 - itemSpring) * 60}px) scale(${0.9 + itemSpring * 0.1})`;
          }

          return (
            <div
              key={idx}
              style={{
                backgroundColor: card.bg,
                borderRadius: 28,
                padding: '24px 28px',
                border: card.bg === '#FFFFFF' ? '2px solid #E5E1D8' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
                transform: transformStyle,
                opacity: itemSpring,
                height: 190,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: `${card.color}20`,
                    color: card.color,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 16,
                    letterSpacing: '0.04em',
                  }}
                >
                  {card.tag}
                </span>
                <span style={{ fontSize: 22 }}>⚡</span>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: card.bg === '#FFFFFF' ? '#0D0F12' : '#FFFFFF',
                    marginBottom: 6,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: 13,
                    color: card.bg === '#FFFFFF' ? '#6B7280' : '#9CA3AF',
                    fontWeight: 600,
                  }}
                >
                  {card.preview}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scene05Variety;
