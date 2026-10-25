import React from 'react';
import { AbsoluteFill } from 'remotion';

export const BackgroundLayer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EA', overflow: 'hidden' }}>
      {/* 36px subtle dot grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(13, 15, 18, 0.05) 2px, transparent 2px)',
          backgroundSize: '36px 36px',
          opacity: 0.8,
        }}
      />
      {/* Warm soft radial vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 35%, transparent 55%, rgba(215, 208, 195, 0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default BackgroundLayer;
