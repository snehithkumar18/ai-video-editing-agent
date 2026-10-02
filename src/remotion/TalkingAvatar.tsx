'use client';

import React from 'react';
import { Img, useCurrentFrame } from 'remotion';

interface CaptionClip {
  start: number;
  end: number;
  word?: string;
}

interface TalkingAvatarProps {
  src: string;
  captions?: CaptionClip[];
  fps: number;
  style?: React.CSSProperties;
}

export const TalkingAvatar: React.FC<TalkingAvatarProps> = ({
  src,
  captions = [],
  fps = 30,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  // 1. Check if speaker is currently voicing a word
  const activeCaption = captions.find(
    (c) => currentTime >= c.start - 0.04 && currentTime <= c.end + 0.06
  );
  const isSpeaking = !!activeCaption;

  // 2. Natural breathing & gentle posture sway
  const breathY = Math.sin(currentTime * 2.2) * 3.5;
  const swayX = Math.cos(currentTime * 1.3) * 2;
  const breathScale = 1 + Math.sin(currentTime * 1.5) * 0.006;
  const headTilt = Math.sin(currentTime * 1.8) * 0.4; // degrees

  // 3. Mouth articulation when speaking
  let mouthOpenY = 0;
  let mouthOpenX = 0;
  if (isSpeaking) {
    const timeInWord = currentTime - (activeCaption?.start || 0);
    const cycle = Math.sin(timeInWord * Math.PI * 9);
    const openness = Math.max(0, cycle);
    mouthOpenY = openness * 14;
    mouthOpenX = openness * 6;
  }

  // 4. Natural Eye Blink every 3.5s
  const blinkCycle = currentTime % 3.5;
  const isBlinking = blinkCycle > 3.36;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#0a0a0c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Animated Character Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translate(${swayX}px, ${breathY}px) scale(${breathScale}) rotate(${headTilt}deg)`,
          transformOrigin: 'center bottom',
          transition: 'transform 0.05s ease-out',
        }}
      >
        <Img
          src={src}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />

        {/* Dynamic Mouth Overlay */}
        {isSpeaking && mouthOpenY > 1.5 && (
          <div
            style={{
              position: 'absolute',
              top: '50.5%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${36 + mouthOpenX}px`,
              height: `${8 + mouthOpenY}px`,
              background: 'radial-gradient(ellipse at center, rgba(25, 12, 16, 0.95) 0%, rgba(45, 20, 26, 0.88) 65%, transparent 100%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          >
            {/* Subtle Teeth visibility on wider vowels */}
            {mouthOpenY > 4 && (
              <div
                style={{
                  position: 'absolute',
                  top: '1px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '55%',
                  height: '2.5px',
                  backgroundColor: 'rgba(235, 235, 240, 0.75)',
                  borderRadius: '2px',
                }}
              />
            )}
          </div>
        )}

        {/* Natural Blink Overlay */}
        {isBlinking && (
          <>
            {/* Left Eye */}
            <div
              style={{
                position: 'absolute',
                top: '34.2%',
                left: '42.2%',
                transform: 'translateX(-50%)',
                width: '26px',
                height: '2px',
                backgroundColor: 'rgba(65, 45, 38, 0.65)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
            {/* Right Eye */}
            <div
              style={{
                position: 'absolute',
                top: '34.2%',
                left: '57.8%',
                transform: 'translateX(-50%)',
                width: '26px',
                height: '2px',
                backgroundColor: 'rgba(65, 45, 38, 0.65)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TalkingAvatar;
