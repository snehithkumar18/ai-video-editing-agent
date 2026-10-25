import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

export interface PresenterAvatarProps {
  pose?: 'pose_point_up_right' | 'pose_both_hands_point' | 'pose_direct_point' | 'pose_shrug_palms';
  scale?: number;
  bottomOffset?: number;
}

export const PresenterAvatar: React.FC<PresenterAvatarProps> = ({
  pose = 'pose_point_up_right',
  scale = 1.0,
  bottomOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural breathing & subtle movement
  const breathY = Math.sin((frame / fps) * 2.5) * 4.5;
  const swayRot = Math.sin((frame / fps) * 1.2) * 0.9;
  const talkPulse = Math.sin(frame * 0.9) * 1.5;

  const entrance = spring({
    frame: frame % 120,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: '50%',
        transform: `translateX(-50%) translateY(${breathY + talkPulse}px) rotate(${swayRot}deg) scale(${scale})`,
        transformOrigin: 'bottom center',
        width: 820,
        height: 740,
        zIndex: 40,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      {/* 1. Point Up-Right Gesture Overlay */}
      {pose === 'pose_point_up_right' && (
        <svg
          width="240"
          height="320"
          viewBox="0 0 180 240"
          style={{
            position: 'absolute',
            right: 80,
            bottom: 180,
            zIndex: 45,
            transform: `scale(${0.9 + entrance * 0.1}) rotate(${-10 + entrance * 6}deg)`,
            transformOrigin: 'bottom left',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.22))',
          }}
        >
          <path d="M 30 200 L 75 140 L 115 165 L 70 230 Z" fill="#1e293b" />
          <path d="M 35 205 L 75 145 L 85 152 L 45 212 Z" fill="#334155" />
          <path
            d="M 85 145 C 95 130 110 110 120 70 C 124 55 125 35 125 25 C 125 18 115 18 112 25 C 108 35 102 65 96 85 C 92 80 85 85 82 92 C 78 88 72 92 70 100 C 65 100 62 108 65 118 C 68 128 78 140 85 145 Z"
            fill="#d4a373"
            stroke="#1f2937"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="125" cy="18" r={interpolate(frame % 20, [0, 10, 20], [4, 8, 4])} fill="#F95738" />
        </svg>
      )}

      {/* 2. Direct Point CTA Gesture */}
      {pose === 'pose_direct_point' && (
        <svg
          width="250"
          height="270"
          viewBox="0 0 180 190"
          style={{
            position: 'absolute',
            left: 285,
            bottom: 170,
            zIndex: 46,
            transform: `scale(${0.95 + entrance * 0.15})`,
            transformOrigin: 'bottom center',
            filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.3))',
          }}
        >
          <path d="M 50 180 L 70 130 L 110 135 L 90 185 Z" fill="#1e293b" />
          <ellipse cx="90" cy="95" rx="34" ry="28" fill="#d4a373" stroke="#1f2937" strokeWidth="3.5" />
          <ellipse cx="92" cy="72" rx="14" ry="12" fill="#c68a52" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="92" cy="70" rx="9" ry="7" fill="#f8edeb" opacity="0.6" />
        </svg>
      )}

      {/* High-Resolution User Character Cutout */}
      <img
        src={staticFile('claude_skill_reel/character_cutout.png')}
        alt="Presenter"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          filter:
            'drop-shadow(0 20px 40px rgba(15, 17, 21, 0.22)) drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
        }}
      />
    </div>
  );
};

export default PresenterAvatar;
