'use client';

import { useMemo } from 'react';

interface TimeRulerProps {
  duration: number;
  zoom: number;
  currentFrame: number;
  fps: number;
  onSeek: (frame: number) => void;
}

export default function TimeRuler({ duration, zoom, currentFrame, fps, onSeek }: TimeRulerProps) {
  const width = duration * zoom;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handleSeek(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      handleSeek(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, width));
    const timeSec = x / zoom;
    const frame = Math.round(timeSec * fps);
    onSeek(frame);
  };

  // Pre-calculate markers
  const markers = useMemo(() => {
    const arr = [];
    const step = zoom > 150 ? 0.5 : (zoom > 50 ? 1 : 5);
    for (let t = 0; t <= duration; t += step) {
      arr.push(t);
    }
    return arr;
  }, [duration, zoom]);

  return (
    <div className="h-8 bg-[#1A1A1A] border-b border-border sticky top-0 z-20 overflow-hidden flex">
      {/* Left spacer for track headers */}
      <div className="w-[160px] flex-shrink-0 bg-[#1A1A1A] border-r border-border z-30 flex items-center px-4">
        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Timeline</span>
      </div>

      {/* Ruler area */}
      <div 
        className="flex-1 relative cursor-text select-none overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div style={{ width, height: '100%', position: 'relative' }}>
          {markers.map((time) => {
            const isMajor = time % 1 === 0 || zoom > 200;
            return (
              <div 
                key={time} 
                className="absolute top-0 bottom-0 border-l border-white/10 flex flex-col justify-end pb-1"
                style={{ left: `${time * zoom}px` }}
              >
                {isMajor && (
                  <span className="text-[10px] text-white/40 ml-1 leading-none select-none">
                    00:{time.toString().padStart(2, '0')}
                  </span>
                )}
                <div className={`w-px bg-white/20 absolute bottom-0 ${isMajor ? 'h-3' : 'h-1.5'}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
