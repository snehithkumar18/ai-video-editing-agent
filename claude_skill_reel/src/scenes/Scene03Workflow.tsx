import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene03Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const promptSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.8 },
  });

  const step1Spring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.6 },
  });

  const step2Spring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.6 },
  });

  const step3Spring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.6 },
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
          maxWidth: 950,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 54,
            fontWeight: 900,
            color: '#0D0F12',
            letterSpacing: '-0.04em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <span>IDEA</span>
          <span style={{ color: '#F95738', fontSize: 44 }}>→</span>
          <span>SCENES</span>
          <span style={{ color: '#F95738', fontSize: 44 }}>→</span>
          <span style={{ color: '#F95738' }}>ANIMATION</span>
        </div>
      </div>

      {/* Input Prompt Box */}
      <div
        style={{
          width: 860,
          backgroundColor: '#111418',
          borderRadius: 24,
          padding: '18px 28px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          transform: `translateY(${(1 - promptSpring) * 40}px)`,
          opacity: promptSpring,
          marginBottom: 40,
        }}
      >
        <span style={{ color: '#F95738', fontFamily: "'Fira Code', monospace", fontSize: 24, fontWeight: 800 }}>
          ❯
        </span>
        <span style={{ color: '#F8FAFC', fontFamily: "'Fira Code', monospace", fontSize: 20, fontWeight: 600 }}>
          claude "create a 50s explainer about my AI app"
        </span>
      </div>

      {/* 3 Structured Workflow Cards with Orange Connectors */}
      <div style={{ position: 'relative', width: 860, display: 'flex', justifyContent: 'space-between' }}>
        {/* Connector Line Behind */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 100,
            right: 100,
            height: 4,
            backgroundColor: '#E5E1D8',
            zIndex: 5,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${interpolate(frame, [25, 80], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
              backgroundColor: '#F95738',
              boxShadow: '0 0 12px #F95738',
            }}
          />
        </div>

        {/* Stage 1: Idea Card */}
        <div
          style={{
            width: 260,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: '24px 20px',
            border: '2px solid #E5E1D8',
            boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
            zIndex: 10,
            transform: `scale(${step1Spring})`,
            opacity: step1Spring,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>💡</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: '#0D0F12' }}>
            01. Prompt Idea
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            Topic & target audience
          </div>
        </div>

        {/* Stage 2: Storyboard Card */}
        <div
          style={{
            width: 260,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: '24px 20px',
            border: '2px solid #E5E1D8',
            boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
            zIndex: 10,
            transform: `scale(${step2Spring})`,
            opacity: step2Spring,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: '#0D0F12' }}>
            02. Scene Storyboard
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            Exact timing & cues
          </div>
        </div>

        {/* Stage 3: Animation Card */}
        <div
          style={{
            width: 260,
            backgroundColor: '#F95738',
            borderRadius: 24,
            padding: '24px 20px',
            boxShadow: '0 20px 45px rgba(249, 87, 56, 0.35)',
            zIndex: 10,
            transform: `scale(${step3Spring})`,
            opacity: step3Spring,
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20 }}>
            03. Motion Engine
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, opacity: 0.9, marginTop: 4 }}>
            Spring curves & render
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene03Workflow;
