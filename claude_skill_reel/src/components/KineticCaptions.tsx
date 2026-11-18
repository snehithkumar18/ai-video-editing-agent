import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface WordItem {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  probability?: number;
}

export interface KineticCaptionsProps {
  words: WordItem[];
  color?: string;
  activeColor?: string;
  bottomOffset?: number;
  positionMode?: 'middle' | 'bottom';
  pillStyle?: boolean;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words,
  color = '#FFFFFF',
  activeColor = '#F95738',
  bottomOffset = 80,
  positionMode = 'middle',
  pillStyle = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find active word
  const activeIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  const targetIndex =
    activeIndex !== -1
      ? activeIndex
      : words.findIndex((w) => w.start > currentTime);

  if (targetIndex === -1 && words.length > 0 && currentTime > words[words.length - 1].end + 0.8) {
    return null;
  }

  const effectiveIndex = targetIndex !== -1 ? targetIndex : words.length - 1;
  const startIndex = Math.max(0, effectiveIndex - 1);
  const endIndex = Math.min(words.length, startIndex + 4);
  const visibleWords = words.slice(startIndex, endIndex);

  return (
    <div
      style={{
        position: 'absolute',
        ...(positionMode === 'middle'
          ? { top: '50%', transform: 'translateY(-50%)' }
          : { bottom: bottomOffset }),
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 40px',
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      <div
        style={
          pillStyle
            ? {
                backgroundColor: 'rgba(0, 0, 0, 0.88)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 16,
                padding: '10px 22px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px 14px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
              }
            : {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px 18px',
              }
        }
      >
        {visibleWords.map((item, idx) => {
          const isCurrent = currentTime >= item.start && currentTime <= item.end;
          const isPast = currentTime > item.end;

          return (
            <span
              key={`${item.word}-${item.start}-${idx}`}
              style={{
                fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
                fontSize: pillStyle ? (isCurrent ? '38px' : '34px') : (isCurrent ? '56px' : '50px'),
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: isCurrent ? activeColor : isPast ? '#94A3B8' : '#FFFFFF',
                transform: isCurrent ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'transform 0.08s ease, color 0.08s ease',
                display: 'inline-block',
                textShadow: isCurrent ? '0 0 20px rgba(249, 87, 56, 0.6)' : 'none',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default KineticCaptions;
