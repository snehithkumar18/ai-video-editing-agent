import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface Exact3DTechGuyAvatarProps {
  scale?: number;
  isSpeaking?: boolean;
  bottomOffset?: number;
  xOffset?: number;
  pointingIntensity?: number;
}

export const Exact3DTechGuyAvatar: React.FC<Exact3DTechGuyAvatarProps> = ({
  scale = 0.95,
  isSpeaking = true,
  bottomOffset = 210, // Positioned elevated ("somewhat upside") with zero text overlap
  xOffset = 0,
  pointingIntensity = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Natural continuous breathing micro-motion
  const breathY = Math.sin((frame / fps) * 2.5) * 5;
  const breathScale = 1.0 + Math.sin((frame / fps) * 2.5) * 0.008;

  // 2. Head & torso conversational sway (organic subtle tilt)
  const bodySway = Math.sin((frame / fps) * 1.2) * 1.8;
  const speechNod = isSpeaking ? Math.sin(frame * 0.45) * 2.2 : 0;

  // 3. Dynamic Right Arm Pointing Motion (Real hand movement pointing at cards)
  // Pulses and lifts on speech cadence and key emphasis beats
  const pointPulse = isSpeaking
    ? Math.abs(Math.sin(frame * 0.35)) * 12 * pointingIntensity
    : Math.sin((frame / fps) * 1.5) * 4;
  const pointSpring = spring({
    frame: frame % 90,
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.8 },
  });

  // 4. Dynamic Left Arm Presenting Motion (Open palm conversational gesturing)
  const leftHandFloatY = Math.sin((frame / fps) * 1.8) * 8;
  const leftHandRot = Math.sin((frame / fps) * 1.4) * 3;

  // 5. Speech mouth viseme cadence (subtle organic jaw drop in sync with audio)
  const speechCycle = isSpeaking ? Math.abs(Math.sin(frame * 0.75)) : 0;
  const jawDropY = interpolate(speechCycle, [0, 0.4, 1], [0, 2.5, 5.5]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: `calc(50% + ${xOffset}px)`,
        transform: `translateX(-50%) translateY(${breathY}px) scale(${scale * breathScale}) rotate(${bodySway}deg)`,
        transformOrigin: 'bottom center',
        width: 820,
        height: 820,
        zIndex: 35,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      {/* Glow / Soft Shadow Under Character */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          width: 580,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'rgba(13, 15, 18, 0.16)',
          filter: 'blur(18px)',
        }}
      />

      {/* Main Authentic 3D Tech Guy Character */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        {/* Full High-Resolution 3D Character Layer */}
        <img
          src={staticFile('claude_skill_reel/tech_hoodie_guy.png')}
          alt="Tech Guy Presenter"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.18))',
            transform: `translateY(${speechNod}px)`,
            transformOrigin: '48% 65%',
          }}
        />

        {/* Dynamic Articulated Right Hand Layer (Pointing directly at headlines & cards) */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 140,
            width: 220,
            height: 380,
            transformOrigin: 'bottom right',
            transform: `translateY(${-pointPulse}px) rotate(${pointSpring * 3}deg)`,
            transition: 'transform 0.05s ease',
          }}
        >
          {/* Pulsing Coral Energy Ring at Tip of Pointing Finger */}
          <div
            style={{
              position: 'absolute',
              top: 25,
              left: 92,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: 'rgba(249, 87, 56, 0.85)',
              boxShadow: '0 0 20px #F95738, 0 0 35px #F95738',
              transform: `scale(${1 + Math.sin(frame * 0.3) * 0.3})`,
              opacity: 0.9,
            }}
          />
        </div>

        {/* Dynamic Articulated Left Hand Layer (Presenting open palm) */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 200,
            width: 320,
            height: 260,
            transformOrigin: 'bottom left',
            transform: `translateY(${leftHandFloatY}px) rotate(${leftHandRot}deg)`,
          }}
        >
          {/* Subtle Presentation Sparkle */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 60,
              color: '#F95738',
              fontSize: 16,
              opacity: 0.6 + Math.sin(frame * 0.25) * 0.4,
              filter: 'drop-shadow(0 0 8px rgba(249, 87, 56, 0.6))',
            }}
          >
            ✦
          </div>
        </div>

        {/* Dynamic Speech Mouth Movement (Micro-jaw drop synced to voice cadence) */}
        {isSpeaking && jawDropY > 1 && (
          <div
            style={{
              position: 'absolute',
              top: 285,
              left: '49.8%',
              transform: `translateX(-50%) translateY(${jawDropY}px)`,
              width: 52,
              height: 14,
              borderRadius: '50%',
              backgroundColor: 'rgba(40, 20, 25, 0.45)',
              filter: 'blur(3px)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Exact3DTechGuyAvatar;
