import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PerfectTechGuyAvatarProps {
  scale?: number;
  isSpeaking?: boolean;
  bottomOffset?: number; // Positioned elevated "somewhat upside"
  xOffset?: number;
  pointingIntensity?: number;
}

export const PerfectTechGuyAvatar: React.FC<PerfectTechGuyAvatarProps> = ({
  scale = 0.96,
  isSpeaking = true,
  bottomOffset = 210,
  xOffset = 0,
  pointingIntensity = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Natural lifelike continuous breathing micro-motion
  const breathY = Math.sin((frame / fps) * 2.4) * 4.5;
  const breathScale = 1.0 + Math.sin((frame / fps) * 2.4) * 0.008;
  const bodySway = Math.sin((frame / fps) * 1.1) * 1.4;

  // 2. Conversational head nod & tilt on speech cadence
  const speechNod = isSpeaking ? Math.sin(frame * 0.44) * 2.4 : Math.sin(frame * 0.15) * 0.8;
  const speechTilt = isSpeaking ? Math.cos(frame * 0.28) * 1.4 : Math.cos(frame * 0.12) * 0.5;

  // 3. Speech-synced talking mouth visemes
  const mouthCadence = isSpeaking ? Math.abs(Math.sin(frame * 0.72)) : 0;
  const isVowelOpen = mouthCadence > 0.68;
  const isTalking = mouthCadence > 0.22;

  // 4. Clean eye blinking: every ~85 frames, lasts 4 frames
  const blinkCycle = frame % 85;
  const isBlinking = blinkCycle >= 79 && blinkCycle <= 83;

  // 5. Right Arm Pointing Motion (bounces and pulses on key emphasis beats)
  const pointBounce = isSpeaking
    ? Math.abs(Math.sin(frame * 0.36)) * 14 * pointingIntensity
    : Math.sin((frame / fps) * 1.5) * 3.5;
  const rightArmSpring = spring({
    frame: frame % 80,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // 6. Left Arm Presenting Motion (fluid conversational gesturing)
  const leftHandFloatY = Math.sin((frame / fps) * 1.8) * 7;
  const leftHandRot = Math.sin((frame / fps) * 1.2) * 2.8;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: `calc(50% + ${xOffset}px)`,
        transform: `translateX(-50%) translateY(${breathY}px) scale(${scale * breathScale}) rotate(${bodySway}deg)`,
        transformOrigin: 'bottom center',
        width: 860,
        height: 870,
        zIndex: 35,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      {/* Soft Contact Shadow Underneath Character */}
      <div
        style={{
          position: 'absolute',
          bottom: 15,
          width: 580,
          height: 38,
          borderRadius: '50%',
          backgroundColor: 'rgba(13, 15, 18, 0.18)',
          filter: 'blur(16px)',
        }}
      />

      {/* Main Container */}
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
        {/* Full Pristine 3D Character Base Layer */}
        <img
          src={staticFile('claude_skill_reel/tech_hoodie_guy.png')}
          alt="Tech Guy Presenter"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.18))',
            transform: `translateY(${speechNod}px) rotate(${speechTilt}deg)`,
            transformOrigin: '48% 60%',
          }}
        />

        {/* Dynamic Speech Mouth Overlay Layer */}
        {isTalking && (
          <div
            style={{
              position: 'absolute',
              top: '26.8%',
              left: '49.8%',
              width: 94,
              height: 52,
              transform: `translate(-50%, ${speechNod}px) rotate(${speechTilt}deg)`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          >
            <img
              src={
                isVowelOpen
                  ? staticFile('claude_skill_reel/mouth_open_layer.png')
                  : staticFile('claude_skill_reel/mouth_talk_layer.png')
              }
              alt="Talking Viseme"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'opacity 0.05s ease',
              }}
            />
          </div>
        )}

        {/* Clean Eyelid Blink Layers (Positioned inside glasses frame over eyes) */}
        {isBlinking && (
          <>
            {/* Left Eye Blink (Viewer's Left) */}
            <div
              style={{
                position: 'absolute',
                top: '21.6%',
                left: '42.8%',
                width: 48,
                height: 24,
                backgroundColor: '#eed0b7',
                borderRadius: '50%',
                transform: `rotate(${speechTilt - 3}deg)`,
                boxShadow: 'inset 0 3px 6px rgba(186, 124, 83, 0.6)',
                zIndex: 4,
              }}
            />
            {/* Right Eye Blink (Viewer's Right) */}
            <div
              style={{
                position: 'absolute',
                top: '23.8%',
                left: '54.6%',
                width: 48,
                height: 24,
                backgroundColor: '#eed0b7',
                borderRadius: '50%',
                transform: `rotate(${speechTilt - 1}deg)`,
                boxShadow: 'inset 0 3px 6px rgba(186, 124, 83, 0.6)',
                zIndex: 4,
              }}
            />
          </>
        )}

        {/* Dynamic Pointing Right Arm Bounce & Glow (Viewer's Left) */}
        <div
          style={{
            position: 'absolute',
            left: 55,
            top: 135,
            width: 230,
            height: 380,
            transformOrigin: 'bottom right',
            transform: `translateY(${-pointBounce}px) rotate(${rightArmSpring * 2.5}deg)`,
            pointerEvents: 'none',
          }}
        >
          {/* Pulsing Coral Energy Ring at Tip of Pointing Index Finger */}
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: 96,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: 'rgba(249, 87, 56, 0.9)',
              boxShadow: '0 0 20px #F95738, 0 0 38px #F95738',
              transform: `scale(${1.0 + Math.sin(frame * 0.3) * 0.3})`,
              opacity: 0.95,
            }}
          />
        </div>

        {/* Dynamic Presenting Left Arm Float & Sparkle (Viewer's Right) */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 200,
            width: 320,
            height: 260,
            transformOrigin: 'bottom left',
            transform: `translateY(${leftHandFloatY}px) rotate(${leftHandRot}deg)`,
            pointerEvents: 'none',
          }}
        >
          {/* Presentation Magic Sparkle */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 65,
              color: '#F95738',
              fontSize: 18,
              opacity: 0.7 + Math.sin(frame * 0.28) * 0.3,
              filter: 'drop-shadow(0 0 10px rgba(249, 87, 56, 0.8))',
            }}
          >
            ✦
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectTechGuyAvatar;
