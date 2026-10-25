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
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words,
  color = '#0D0F12',
  activeColor = '#F95738',
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
        top: 1140,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px 18px',
        padding: '0 60px',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {visibleWords.map((item, idx) => {
        const isCurrent = currentTime >= item.start && currentTime <= item.end;
        const isPast = currentTime > item.end;

        return (
          <span
            key={`${item.word}-${item.start}-${idx}`}
            style={{
              fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
              fontSize: isCurrent ? '56px' : '50px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: isCurrent ? activeColor : isPast ? '#6B7280' : color,
              transform: isCurrent ? 'scale(1.12)' : 'scale(1.0)',
              transition: 'transform 0.08s ease, color 0.08s ease',
              display: 'inline-block',
              textShadow:
                '0 3px 6px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(0, 0, 0, 0.08)',
              background: 'transparent', // Explicit zero background box requirement
            }}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
};

export default KineticCaptions;
