import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene06MarketSaturation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  // Stamp slam at frame 50
  const stampSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 9, stiffness: 180, mass: 0.5 },
  });

  // Number of seats filled
  const totalSeats = 28;
  const filledSeats = Math.min(
    totalSeats,
    Math.floor(interpolate(frame, [15, 65], [3, totalSeats], { extrapolateLeft: 'clamp' }))
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 120,
        pointerEvents: 'none',
      }}
    >
      {/* Headline */}
      <div
        style={{
          transform: `translateY(${(1 - headlineSpring) * -40}px) scale(${0.9 + headlineSpring * 0.1})`,
          opacity: headlineSpring,
          textAlign: 'center',
          maxWidth: 620,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 40,
            fontWeight: 800,
            color: '#0F1115',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          This market fills up fast,
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 46,
            fontWeight: 700,
            color: '#E11D48',
            letterSpacing: '-0.02em',
            display: 'block',
            marginTop: 4,
          }}
        >
          first movers win the audience
        </span>
      </div>

      {/* Theater Seating Card */}
      <div
        style={{
          position: 'relative',
          width: 540,
          height: 380,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 28px',
          border: '1px solid #E2E0D8',
          boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
          transform: `translateY(${(1 - cardSpring) * 60}px)`,
          opacity: cardSpring,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: '#0F1115',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Niche Capacity Analysis
          </span>
          <span
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 15,
              fontWeight: 700,
              color: filledSeats === totalSeats ? '#E11D48' : '#10B981',
            }}
          >
            {Math.floor((filledSeats / totalSeats) * 100)}% OCCUPIED
          </span>
        </div>

        {/* Theater Curved Screen Arc */}
        <div
          style={{
            width: 320,
            height: 12,
            borderRadius: '50% 50% 0 0',
            borderTop: '3px solid #94A3B8',
            marginBottom: 24,
            opacity: 0.6,
          }}
        />

        {/* 4 Rows of Seats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          {[5, 7, 8, 8].map((rowSeats, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: 16 }}>
              {Array.from({ length: rowSeats }).map((_, seatIdx) => {
                const globalIndex = [0, 5, 12, 20][rowIdx] + seatIdx;
                const isTaken = globalIndex < filledSeats;

                return (
                  <div
                    key={seatIdx}
                    style={{
                      width: 26,
                      height: 24,
                      borderRadius: '6px 6px 4px 4px',
                      backgroundColor: isTaken ? '#0F1115' : '#E2E8F0',
                      border: isTaken ? '1.5px solid #E11D48' : '1px solid #CBD5E1',
                      transition: 'background-color 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isTaken && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#E11D48',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Big Red FULL Badge Slam */}
        {frame >= 50 && (
          <div
            style={{
              position: 'absolute',
              top: 140,
              transform: `rotate(-12deg) scale(${1.6 - stampSpring * 0.6})`,
              opacity: stampSpring,
              border: '6px solid #E11D48',
              borderRadius: 16,
              padding: '10px 32px',
              color: '#E11D48',
              fontFamily: "'Inter', sans-serif",
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(254, 242, 242, 0.95)',
              boxShadow: '0 15px 35px rgba(225, 29, 72, 0.35)',
            }}
          >
            SOLD OUT
          </div>
        )}
      </div>
    </div>
  );
};

export default Scene06MarketSaturation;
