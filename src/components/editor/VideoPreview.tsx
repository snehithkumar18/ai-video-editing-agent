'use client';

import { useRef, useEffect, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { VideoComposition } from '@/remotion/VideoComposition';
import { useTimelineStore } from '@/store/useTimelineStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="w-full aspect-[9/16] bg-black rounded-lg overflow-hidden border border-border relative shadow-2xl">
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
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
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
          className="w-full cursor-pointer [&>span:first-child]:bg-white/10 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
        />

        <div className="flex items-center justify-center gap-2 mt-2">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white" onClick={() => setCurrentFrame(0)}>
            <SkipBack size={18} />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-1" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white" onClick={() => setCurrentFrame(durationInFrames - 1)}>
            <SkipForward size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
