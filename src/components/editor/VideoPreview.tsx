'use client';

import { useRef, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { SplitScreenMasterComposition } from '@/remotion/templates/SplitScreenMasterComposition';
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

  // Sync play/pause to player
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) playerRef.current.play();
      else playerRef.current.pause();
    }
  }, [isPlaying]);

  // Sync current frame from store to player (scrubbing)
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
    <div className="h-full w-full flex flex-col items-center justify-between p-3 overflow-hidden min-h-0 select-none">
      {/* 9:16 Video Player Container - Strictly Constrained to Parent Height */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1">
        <div className="h-full aspect-[9/16] max-w-full max-h-full bg-black rounded-xl overflow-hidden border border-white/[0.08] relative shadow-2xl shadow-[#7C3AED]/15 flex items-center justify-center">
          <Player
            acknowledgeRemotionLicense
            ref={playerRef}
            component={SplitScreenMasterComposition}
            inputProps={{ timeline }}
            durationInFrames={durationInFrames}
            compositionWidth={timeline.width || 1080}
            compositionHeight={timeline.height || 1920}
            fps={fps}
            style={{ width: '100%', height: '100%' }}
            controls={false}
            spaceKeyToPlayOrPause={false}
            renderLoading={() => (
              <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs">
                Loading Player...
              </div>
            )}
          />
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="w-full max-w-[380px] flex flex-col gap-1 px-2 pt-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
          <span className="text-[#A78BFA] font-medium">{formatTime(currentFrame)}</span>
          <span className="text-gray-500">{formatTime(durationInFrames)}</span>
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

        <div className="flex items-center justify-center gap-3 mt-0.5">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setCurrentFrame(0)}
            title="Beginning (0:00)"
          >
            <SkipBack size={15} />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all flex items-center justify-center shadow-lg shadow-[#7C3AED]/30 hover:scale-105 active:scale-95"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause size={15} className="fill-current" /> : <Play size={15} className="fill-current ml-0.5" />}
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setCurrentFrame(durationInFrames - 1)}
            title="End"
          >
            <SkipForward size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
