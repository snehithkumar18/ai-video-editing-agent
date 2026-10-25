import React from 'react';
import { AbsoluteFill } from 'remotion';

export const BackgroundLayer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EA', overflow: 'hidden' }}>
      {/* Subtle fine paper grain / dot matrix texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(15, 17, 21, 0.065) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.75,
        }}
      />
      {/* Soft warm vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 30%, transparent 50%, rgba(220, 215, 204, 0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default BackgroundLayer;
