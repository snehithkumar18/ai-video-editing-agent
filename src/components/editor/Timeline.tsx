'use client';

import { useRef, useEffect } from 'react';
import { useTimelineStore } from '@/store/useTimelineStore';
import TimeRuler from './TimeRuler';
import TimelineTrack from './TimelineTrack';
import PlayheadLine from './PlayheadLine';

export default function Timeline() {
  const timeline = useTimelineStore(s => s.timeline);
  const zoom = useTimelineStore(s => s.zoom);
  const currentFrame = useTimelineStore(s => s.currentFrame);
  const setCurrentFrame = useTimelineStore(s => s.setCurrentFrame);
  const setIsPlaying = useTimelineStore(s => s.setIsPlaying);
  const selectClip = useTimelineStore(s => s.selectClip);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackAreaRef = useRef<HTMLDivElement>(null);

  // Deselect on click outside clips
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === trackAreaRef.current) {
      selectClip(null, null);
    }
  };

  if (!timeline) return null;

  const duration = timeline.duration || 60;
  const fps = timeline.fps || 30;

  return (
    <div className="flex flex-col h-full w-full bg-[#0E0E18] overflow-hidden select-none">
      <div 
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar"
      >
        <div style={{ minWidth: `${(duration * zoom) + 160}px` }}>
          {/* Top Ruler (Sticky) */}
          <TimeRuler 
            duration={duration} 
            zoom={zoom} 
            currentFrame={currentFrame} 
            fps={fps}
            onSeek={(frame) => {
              setIsPlaying(false);
              setCurrentFrame(frame);
            }} 
          />

          {/* Tracks Area */}
          <div 
            ref={trackAreaRef}
            className="relative flex flex-col pt-2 pb-10"
            onClick={handleBackgroundClick}
          >
            {timeline.tracks.map(track => (
              <TimelineTrack 
                key={track.id} 
                track={track} 
                zoom={zoom} 
                duration={duration} 
              />
            ))}

            {/* Global Playhead */}
            <div className="absolute top-0 bottom-0 pointer-events-none z-40" style={{ left: '160px' }}>
              <PlayheadLine 
                currentFrame={currentFrame} 
                fps={fps} 
                zoom={zoom} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
