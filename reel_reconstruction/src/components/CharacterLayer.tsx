import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

export interface CharacterLayerProps {
  currentSceneId?: number;
  pose?:
    | 'pose_neutral_speak'
    | 'pose_point_up_right'
    | 'pose_both_hands_point'
    | 'pose_chin_think'
    | 'pose_shrug_palms'
    | 'pose_direct_point';
  scale?: number;
}

export const CharacterLayer: React.FC<CharacterLayerProps> = ({
  currentSceneId = 1,
  pose = 'pose_point_up_right',
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural organic breathing and micro-movement
  const breathY = Math.sin((frame / fps) * 2.5) * 3.5;
  const swayRot = Math.sin((frame / fps) * 1.2) * 0.75;
  const talkPulse = Math.sin(frame * 0.9) * 1.2;

  // Scene transition gesture entrance spring
  const gestureEntrance = spring({
    frame: frame % 120, // refreshes smoothly
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: `translateX(-50%) translateY(${breathY + talkPulse}px) rotate(${swayRot}deg) scale(${scale})`,
        transformOrigin: 'bottom center',
        width: 580,
        height: 520,
        zIndex: 40,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      {/* Dynamic Gesture Overlays based on pose */}
      {/* 1. Point Up-Right Gesture */}
      {pose === 'pose_point_up_right' && (
        <svg
          width="180"
          height="240"
          viewBox="0 0 180 240"
          style={{
            position: 'absolute',
            right: 40,
            bottom: 120,
            zIndex: 45,
            transform: `scale(${0.9 + gestureEntrance * 0.1}) rotate(${-12 + gestureEntrance * 8}deg)`,
            transformOrigin: 'bottom left',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
          }}
        >
          {/* Sleeve cuff (Navy check style) */}
          <path d="M 30 200 L 75 140 L 115 165 L 70 230 Z" fill="#1e293b" />
          <path d="M 35 205 L 75 145 L 85 152 L 45 212 Z" fill="#334155" />
          <rect x="75" y="140" width="42" height="10" rx="3" fill="#cbd5e1" transform="rotate(32 75 140)" />
          {/* Hand and pointing index finger */}
          <path
            d="M 85 145 C 95 130 110 110 120 70 C 124 55 125 35 125 25 C 125 18 115 18 112 25 C 108 35 102 65 96 85 C 92 80 85 85 82 92 C 78 88 72 92 70 100 C 65 100 62 108 65 118 C 68 128 78 140 85 145 Z"
            fill="#d4a373"
            stroke="#1f2937"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Nail accent */}
          <ellipse cx="120" cy="28" rx="3.5" ry="5" fill="#f8edeb" opacity="0.6" />
          {/* Sparkle energy at finger tip */}
          <circle cx="125" cy="18" r={interpolate(frame % 20, [0, 10, 20], [3, 6, 3])} fill="#E11D48" />
        </svg>
      )}

      {/* 2. Both Hands Point Up Gesture */}
      {pose === 'pose_both_hands_point' && (
        <>
          {/* Left Hand Pointing */}
          <svg
            width="150"
            height="210"
            viewBox="0 0 150 210"
            style={{
              position: 'absolute',
              left: 45,
              bottom: 110,
              zIndex: 45,
              transform: `scaleX(-1) scale(${0.9 + gestureEntrance * 0.1}) rotate(-10deg)`,
              transformOrigin: 'bottom left',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))',
            }}
          >
            <path d="M 25 180 L 65 125 L 100 150 L 60 205 Z" fill="#1e293b" />
            <path
              d="M 75 130 C 85 115 100 95 108 55 C 112 40 112 22 112 15 C 112 10 102 10 100 18 C 96 28 90 55 85 75 C 80 70 75 75 72 82 C 68 78 62 82 60 90 C 55 90 52 98 55 108 Z"
              fill="#d4a373"
              stroke="#1f2937"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
          {/* Right Hand Pointing */}
          <svg
            width="150"
            height="210"
            viewBox="0 0 150 210"
            style={{
              position: 'absolute',
              right: 45,
              bottom: 110,
              zIndex: 45,
              transform: `scale(${0.9 + gestureEntrance * 0.1}) rotate(-10deg)`,
              transformOrigin: 'bottom left',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))',
            }}
          >
            <path d="M 25 180 L 65 125 L 100 150 L 60 205 Z" fill="#1e293b" />
            <path
              d="M 75 130 C 85 115 100 95 108 55 C 112 40 112 22 112 15 C 112 10 102 10 100 18 C 96 28 90 55 85 75 C 80 70 75 75 72 82 C 68 78 62 82 60 90 C 55 90 52 98 55 108 Z"
              fill="#d4a373"
              stroke="#1f2937"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}

      {/* 3. Chin Think / Secrecy Gesture */}
      {pose === 'pose_chin_think' && (
        <svg
          width="160"
          height="220"
          viewBox="0 0 160 220"
          style={{
            position: 'absolute',
            left: 220,
            bottom: 160,
            zIndex: 45,
            transform: `scale(${0.92 + gestureEntrance * 0.08}) rotate(4deg)`,
            transformOrigin: 'bottom center',
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.25))',
          }}
        >
          <path d="M 40 200 L 70 140 L 105 155 L 75 215 Z" fill="#1e293b" />
          {/* Fist with index finger resting along jawline */}
          <path
            d="M 75 145 C 82 135 90 120 95 85 C 97 70 98 55 97 45 C 96 38 88 38 86 45 C 84 55 80 75 76 90 C 72 85 65 88 62 95 C 58 92 52 95 50 102 C 45 102 42 110 45 120 C 48 130 65 142 75 145 Z"
            fill="#d4a373"
            stroke="#1f2937"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* 4. Shrug / Open Palms Gesture */}
      {pose === 'pose_shrug_palms' && (
        <>
          <svg
            width="170"
            height="180"
            viewBox="0 0 170 180"
            style={{
              position: 'absolute',
              left: 20,
              bottom: 90,
              zIndex: 45,
              transform: `scaleX(-1) scale(${0.9 + gestureEntrance * 0.1}) rotate(-25deg)`,
              transformOrigin: 'bottom right',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))',
            }}
          >
            <path d="M 30 160 L 70 110 L 105 130 L 65 180 Z" fill="#1e293b" />
            <path
              d="M 80 115 C 92 105 110 90 125 75 C 132 68 135 60 130 55 C 122 50 115 60 105 72 C 105 60 100 55 92 58 C 88 60 85 70 82 80 C 78 70 70 70 65 78 C 60 85 62 98 70 108 Z"
              fill="#d4a373"
              stroke="#1f2937"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="170"
            height="180"
            viewBox="0 0 170 180"
            style={{
              position: 'absolute',
              right: 20,
              bottom: 90,
              zIndex: 45,
              transform: `scale(${0.9 + gestureEntrance * 0.1}) rotate(-25deg)`,
              transformOrigin: 'bottom left',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))',
            }}
          >
            <path d="M 30 160 L 70 110 L 105 130 L 65 180 Z" fill="#1e293b" />
            <path
              d="M 80 115 C 92 105 110 90 125 75 C 132 68 135 60 130 55 C 122 50 115 60 105 72 C 105 60 100 55 92 58 C 88 60 85 70 82 80 C 78 70 70 70 65 78 C 60 85 62 98 70 108 Z"
              fill="#d4a373"
              stroke="#1f2937"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}

      {/* 5. Direct Point at Camera CTA Gesture */}
      {pose === 'pose_direct_point' && (
        <svg
          width="180"
          height="190"
          viewBox="0 0 180 190"
          style={{
            position: 'absolute',
            left: 200,
            bottom: 120,
            zIndex: 46,
            transform: `scale(${0.95 + gestureEntrance * 0.15})`,
            transformOrigin: 'bottom center',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
          }}
        >
          <path d="M 50 180 L 70 130 L 110 135 L 90 185 Z" fill="#1e293b" />
          {/* Fist pointing forward into camera with perspective distortion */}
          <ellipse cx="90" cy="95" rx="34" ry="28" fill="#d4a373" stroke="#1f2937" strokeWidth="3.5" />
          <ellipse cx="92" cy="72" rx="14" ry="12" fill="#c68a52" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="92" cy="70" rx="9" ry="7" fill="#f8edeb" opacity="0.6" />
          <path d="M 70 95 C 72 110 108 110 110 95" stroke="#1f2937" strokeWidth="3" fill="none" />
        </svg>
      )}

      {/* High-Resolution User Character Cutout */}
      <img
        src={staticFile('reel_reconstruction/character_cutout.png')}
        alt="Presenter"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          filter:
            'drop-shadow(0 15px 30px rgba(15, 17, 21, 0.22)) drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
        }}
      />
    </div>
  );
};

export default CharacterLayer;
