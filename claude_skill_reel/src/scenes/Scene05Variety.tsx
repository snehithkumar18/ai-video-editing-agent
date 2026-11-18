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

  const pondSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Parallax caustics movement
  const waterFlow = (frame * 1.8) % 100;
  const rippleScale1 = 1 + Math.sin(frame * 0.12) * 0.05;
  const rippleScale2 = 1 + Math.cos(frame * 0.15) * 0.05;

  // Koi 1: Orange/White Kohaku Swimming Diagonally Across
  const koi1X = interpolate(frame % 150, [0, 150], [-120, 850]);
  const koi1Y = 220 + Math.sin(frame * 0.1) * 35;
  const koi1Tail = Math.sin(frame * 0.45) * 16;

  // Koi 2: Coral Red Showa Swimming from Right to Left
  const koi2X = interpolate((frame + 75) % 150, [0, 150], [850, -120]);
  const koi2Y = 320 + Math.cos(frame * 0.12) * 25;
  const koi2Tail = Math.sin((frame + 10) * 0.4) * 14;

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
          marginBottom: 30,
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
          A KOI POND
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 66,
            fontWeight: 800,
            color: '#0284C7',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 6,
          }}
        >
          Where The Water Really Moves
        </span>
      </div>

      {/* Lush Illustrated Koi Pond Card */}
      <div
        style={{
          width: 880,
          height: 480,
          borderRadius: 36,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 50%, #075985 100%)',
          border: '4px solid #E0F2FE',
          boxShadow: '0 30px 80px rgba(2, 132, 199, 0.35)',
          transform: `scale(${pondSpring})`,
          opacity: pondSpring,
        }}
      >
        {/* Animated Water Caustics Overlay */}
        <svg
          width="880"
          height="480"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.25,
            transform: `translateY(${waterFlow * 0.5}px) scale(${rippleScale1})`,
          }}
        >
          <defs>
            <pattern id="caustics" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 10 20 Q 30 10 50 25 T 90 20"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M 0 50 Q 25 40 55 60 T 95 50"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="880" height="480" fill="url(#caustics)" />
        </svg>

        {/* Floating Lily Pads with Lotus Flower */}
        {/* Lily Pad 1 */}
        <div style={{ position: 'absolute', top: 40, left: 60, transform: `scale(${rippleScale1}) rotate(15deg)` }}>
          <svg width="120" height="120" viewBox="0 0 100 100">
            <path
              d="M 50 10 A 40 40 0 1 1 20 75 L 50 50 Z"
              fill="#15803D"
              stroke="#166534"
              strokeWidth="2"
            />
            {/* Lotus Blossom */}
            <circle cx="50" cy="50" r="14" fill="#F472B6" />
            <circle cx="50" cy="50" r="8" fill="#FDF2F8" />
            <circle cx="50" cy="50" r="4" fill="#F59E0B" />
          </svg>
        </div>

        {/* Lily Pad 2 */}
        <div style={{ position: 'absolute', bottom: 50, right: 80, transform: `scale(${rippleScale2}) rotate(-25deg)` }}>
          <svg width="140" height="140" viewBox="0 0 100 100">
            <path
              d="M 50 10 A 40 40 0 1 1 20 75 L 50 50 Z"
              fill="#16A34A"
              stroke="#15803D"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Japanese Koi 1 (Swimming Left to Right) */}
        <div
          style={{
            position: 'absolute',
            left: koi1X,
            top: koi1Y,
            transform: 'rotate(25deg)',
          }}
        >
          <svg width="180" height="90" viewBox="0 0 180 90">
            {/* Undulating Tail Fin */}
            <path
              d={`M 25 45 C 5 ${45 + koi1Tail} 0 ${45 + koi1Tail * 1.5} 8 30 C 15 40 25 45 25 45 Z`}
              fill="#F97316"
              stroke="#EA580C"
              strokeWidth="2"
            />
            {/* Main Fish Body (Kohaku Pattern) */}
            <path
              d="M 25 45 C 50 20 120 20 155 45 C 120 70 50 70 25 45 Z"
              fill="#FFFFFF"
              stroke="#EA580C"
              strokeWidth="2.5"
            />
            {/* Orange Red Blotches */}
            <path d="M 60 32 C 80 25 95 35 85 55 C 75 58 60 50 60 32 Z" fill="#EF4444" />
            <path d="M 115 36 C 130 30 145 38 135 52 C 125 55 115 48 115 36 Z" fill="#EF4444" />
            {/* Pectoral Fins */}
            <ellipse cx="120" cy="22" rx="18" ry="8" fill="rgba(255,255,255,0.8)" transform="rotate(-30 120 22)" />
            <ellipse cx="120" cy="68" rx="18" ry="8" fill="rgba(255,255,255,0.8)" transform="rotate(30 120 68)" />
            {/* Eyes */}
            <circle cx="145" cy="38" r="3" fill="#000000" />
            <circle cx="145" cy="52" r="3" fill="#000000" />
          </svg>
        </div>

        {/* Japanese Koi 2 (Swimming Right to Left) */}
        <div
          style={{
            position: 'absolute',
            left: koi2X,
            top: koi2Y,
            transform: 'scaleX(-1) rotate(-15deg)',
          }}
        >
          <svg width="170" height="85" viewBox="0 0 180 90">
            {/* Undulating Tail Fin */}
            <path
              d={`M 25 45 C 5 ${45 + koi2Tail} 0 ${45 + koi2Tail * 1.5} 8 30 C 15 40 25 45 25 45 Z`}
              fill="#F95738"
              stroke="#C2410C"
              strokeWidth="2"
            />
            {/* Main Fish Body (Deep Orange Showa) */}
            <path
              d="M 25 45 C 50 20 120 20 155 45 C 120 70 50 70 25 45 Z"
              fill="#F95738"
              stroke="#9A3412"
              strokeWidth="2.5"
            />
            {/* Black Ink Markings */}
            <path d="M 70 30 C 85 28 90 40 80 54 C 70 50 65 38 70 30 Z" fill="#0F172A" />
            {/* Pectoral Fins */}
            <ellipse cx="120" cy="22" rx="18" ry="8" fill="rgba(255,255,255,0.85)" transform="rotate(-30 120 22)" />
            <ellipse cx="120" cy="68" rx="18" ry="8" fill="rgba(255,255,255,0.85)" transform="rotate(30 120 68)" />
            {/* Eyes */}
            <circle cx="145" cy="38" r="3" fill="#FFFFFF" />
            <circle cx="145" cy="38" r="1.5" fill="#000000" />
          </svg>
        </div>

        {/* Live Water Physics Simulation Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 24,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            padding: '8px 18px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: '#E0F2FE', fontWeight: 600 }}>
            Real-time SVG Fluid Waves • 60 FPS
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scene05Variety;
