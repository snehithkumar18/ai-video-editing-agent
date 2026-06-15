'use client';

import { useRef, useEffect, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { VideoComposition } from '@/remotion/VideoComposition';
import { useTimelineStore } from '@/store/useTimelineStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export default function VideoPreview() {
  const timeline = useTimelineStore(s => s.timeline);
  const currentFrame = useTimelineStore(s => s.currentFrame);
  const isPlaying = useTimelineStore(s => s.isPlaying);
  const setCurrentFrame = useTimelineStore(s => s.setCurrentFrame);
  const setIsPlaying = useTimelineStore(s => s.setIsPlaying);
  const playerRef = useRef<PlayerRef>(null);

  // Sync state to player
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) playerRef.current.play();
      else playerRef.current.pause();
    }
  }, [isPlaying]);

  // Sync frame from store to player (if user scrubbed timeline)
  useEffect(() => {
    if (playerRef.current && !isPlaying) {
      const playerFrame = playerRef.current.getCurrentFrame();
      if (Math.abs(playerFrame - currentFrame) > 1) {
        playerRef.current.seekTo(currentFrame);
      }
    }
  }, [currentFrame, isPlaying]);

  if (!timeline) return null;

  const fps = timeline.fps || 30;
  const durationInFrames = Math.max(1, Math.round((timeline.duration || 60) * fps));

  const formatTime = (frame: number) => {
    const totalSeconds = Math.floor(frame / fps);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor(((frame % fps) / fps) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-4">
      <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden border border-white/[0.08] relative shadow-2xl shadow-[#7C3AED]/10">
        <Player
          ref={playerRef}
          component={VideoComposition}
          inputProps={{ timeline }}
          durationInFrames={durationInFrames}
          compositionWidth={timeline.width || 1080}
          compositionHeight={timeline.height || 1920}
          fps={fps}
          style={{ width: '100%', height: '100%' }}
          controls={false}
          spaceKeyToPlayOrPause={false} // We handle it globally
          renderLoading={() => <div className="absolute inset-0 flex items-center justify-center text-white/50">Loading...</div>}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono text-gray-500 px-1">
          <span>{formatTime(currentFrame)}</span>
          <span>{formatTime(durationInFrames)}</span>
        </div>
        
        <Slider
          value={[currentFrame]}
          min={0}
          max={durationInFrames - 1}
          step={1}
          onValueChange={([val]) => {
            setIsPlaying(false);
            setCurrentFrame(val);
          }}
          className="w-full cursor-pointer [&>span:first-child]:bg-white/10 [&_[role=slider]]:bg-[#7C3AED] [&_[role=slider]]:border-[#7C3AED] [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
        />

        <div className="flex items-center justify-center gap-2 mt-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setCurrentFrame(0)}>
            <SkipBack size={18} />
          </button>
          <button 
            className="w-11 h-11 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors flex items-center justify-center shadow-lg shadow-[#7C3AED]/30"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setCurrentFrame(durationInFrames - 1)}>
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
