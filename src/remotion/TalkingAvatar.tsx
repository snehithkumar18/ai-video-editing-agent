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
  mouthYPercent?: number; // e.g. 46 for natural lips
  mouthXPercent?: number;
  motionIntensity?: number;
  style?: React.CSSProperties;
}

export const TalkingAvatar: React.FC<TalkingAvatarProps> = ({
  src,
  captions = [],
  fps = 30,
  mouthYPercent = 46.2,
  mouthXPercent = 50.0,
  motionIntensity = 1.0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  // 1. Check if speaker is currently voicing a word
  const activeCaption = captions.find(
    (c) => currentTime >= c.start - 0.04 && currentTime <= c.end + 0.06
  );
  const isSpeaking = !!activeCaption;
  const timeInWord = isSpeaking ? currentTime - activeCaption.start : 0;

  // 2. Conversational head gestures, dynamic nodding on speech cadence & sway
  const speechNod = isSpeaking ? Math.sin(timeInWord * Math.PI * 5) * 5.5 * motionIntensity : 0;
  const speechTilt = isSpeaking ? Math.sin(timeInWord * Math.PI * 2.5) * 1.8 * motionIntensity : 0;
  const breathY = (Math.sin(currentTime * 1.8) * 4.5 + speechNod) * motionIntensity;
  const swayX = (Math.cos(currentTime * 1.1) * 7.5) * motionIntensity;
  const breathScale = 1.008 + (Math.sin(currentTime * 1.2) * 0.012);
  const headTilt = (Math.sin(currentTime * 1.4) * 1.8 + speechTilt) * motionIntensity; // degrees

  // 3. Dynamic Mouth & Jaw Articulation when speaking
  let mouthOpenY = 0;
  let mouthOpenX = 0;
  if (isSpeaking) {
    const cycle = Math.sin(timeInWord * Math.PI * 9.5);
    const openness = Math.max(0, cycle);
    mouthOpenY = openness * 16 * motionIntensity;
    mouthOpenX = openness * 7 * motionIntensity;
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

        {/* Dynamic Mouth & Jaw Articulation Overlay */}
        {isSpeaking && mouthOpenY > 1.2 && (
          <div
            style={{
              position: 'absolute',
              top: `${mouthYPercent}%`,
              left: `${mouthXPercent}%`,
              transform: `translate(-50%, -50%) translateY(${mouthOpenY * 0.25}px)`,
              width: `${34 + mouthOpenX}px`,
              height: `${6 + mouthOpenY}px`,
              background: 'radial-gradient(ellipse at center, rgba(18, 8, 12, 0.96) 0%, rgba(40, 16, 22, 0.88) 60%, transparent 100%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              boxShadow: `0 0 ${4 + mouthOpenY * 0.3}px rgba(25, 10, 15, 0.7)`,
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
