import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene02IntroduceSkill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

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
          marginBottom: 45,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 62,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'block',
          }}
        >
          ONE REUSABLE SKILL
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
            marginTop: 8,
          }}
        >
          Less Repetitive Work
        </span>
      </div>

      {/* Floating Skill Document & Dark Coding Interface Mockup */}
      <div
        style={{
          width: 860,
          backgroundColor: '#0F1115',
          borderRadius: 32,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          transform: `translateY(${(1 - cardSpring) * 80}px) scale(${0.9 + cardSpring * 0.1})`,
          opacity: cardSpring,
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            backgroundColor: '#181B20',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 16,
              color: '#94A3B8',
              fontWeight: 600,
            }}
          >
            skills/reel-automator/SKILL.md
          </div>
          <div
            style={{
              backgroundColor: '#F95738',
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 16,
            }}
          >
            ACTIVE SKILL
          </div>
        </div>

        {/* Clean Config Inspection Display */}
        <div style={{ padding: '32px 36px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <span style={{ color: '#F95738', fontFamily: "'Fira Code', monospace", fontWeight: 700 }}>
              ---
            </span>
          </div>
          <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 18, lineHeight: 1.8 }}>
            <div>
              <span style={{ color: '#60A5FA' }}>name:</span>{' '}
              <span style={{ color: '#FCD34D' }}>"animated-reel-automator"</span>
            </div>
            <div>
              <span style={{ color: '#60A5FA' }}>version:</span>{' '}
              <span style={{ color: '#34D399' }}>"2.5.0"</span>
            </div>
            <div>
              <span style={{ color: '#60A5FA' }}>capabilities:</span>
            </div>
            <div style={{ paddingLeft: 24, color: '#E2E8F0' }}>
              • <span style={{ color: '#F95738' }}>Script generation</span> & retention hook formulas
            </div>
            <div style={{ paddingLeft: 24, color: '#E2E8F0' }}>
              • <span style={{ color: '#F95738' }}>Storyboard breakdown</span> with timed visual cues
            </div>
            <div style={{ paddingLeft: 24, color: '#E2E8F0' }}>
              • <span style={{ color: '#F95738' }}>Remotion code engine</span> & 60fps spring physics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene02IntroduceSkill;
