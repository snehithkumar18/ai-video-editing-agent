import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface WordItem {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  probability?: number;
}

export interface KineticSubtitlesProps {
  words: WordItem[];
  color?: string;
  activeColor?: string;
}

export const KineticSubtitles: React.FC<KineticSubtitlesProps> = ({
  words,
  color = '#0F1115',
  activeColor = '#E11D48',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find active word index
  const activeIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  // If no word is currently active, find closest upcoming or recent word
  const targetIndex =
    activeIndex !== -1
      ? activeIndex
      : words.findIndex((w) => w.start > currentTime);

  if (targetIndex === -1 && words.length > 0 && currentTime > words[words.length - 1].end + 1.0) {
    return null;
  }

  const effectiveIndex = targetIndex !== -1 ? targetIndex : words.length - 1;

  // Window of 3-4 words centered around active word for clean reading
  const startIndex = Math.max(0, effectiveIndex - 1);
  const endIndex = Math.min(words.length, startIndex + 4);
  const visibleWords = words.slice(startIndex, endIndex);

  return (
    <div
      style={{
        position: 'absolute',
        top: 740,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px 14px',
        padding: '0 40px',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {visibleWords.map((item, idx) => {
        const isCurrent =
          currentTime >= item.start && currentTime <= item.end;
        const isPast = currentTime > item.end;

        return (
          <span
            key={`${item.word}-${item.start}-${idx}`}
            style={{
              fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
              fontSize: isCurrent ? '40px' : '36px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: isCurrent ? activeColor : isPast ? '#4B5563' : color,
              transform: isCurrent ? 'scale(1.12)' : 'scale(1.0)',
              transition: 'transform 0.08s ease, color 0.08s ease',
              display: 'inline-block',
              textShadow:
                '0 2px 4px rgba(255, 255, 255, 0.9), 0 4px 12px rgba(0, 0, 0, 0.08)',
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

export default KineticSubtitles;
