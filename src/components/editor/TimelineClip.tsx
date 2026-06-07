'use client';

import { useRef, useEffect } from 'react';
import { Clip, Track } from '@/lib/types/timeline';
import { useTimelineStore } from '@/store/useTimelineStore';
import { cn } from '@/lib/utils';
import { FileText, Film, Mic, Video } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TimelineClipProps {
  clip: Clip;
  track: Track;
  zoom: number;
}

export default function TimelineClip({ clip, track, zoom }: TimelineClipProps) {
  const isSelected = useTimelineStore(s => s.selectedClipId === clip.id);
  const selectClip = useTimelineStore(s => s.selectClip);
  const moveClip = useTimelineStore(s => s.moveClip);
  const trimClip = useTimelineStore(s => s.trimClip);
  const deleteClip = useTimelineStore(s => s.deleteClip);
  
  const clipRef = useRef<HTMLDivElement>(null);

  const left = clip.start * zoom;
  const width = clip.duration * zoom;

  // Handle Dragging (Moving)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || clip.locked) return; // Only left click, ignore if locked
    e.stopPropagation();
    
    // Select the clip when starting to drag
    selectClip(track.id, clip.id);

    const startX = e.clientX;
    const initialStart = clip.start;
    
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / zoom;
      let newStart = initialStart + deltaTime;
      
      // Snap to 0 or 0.5s intervals (rough simple snapping)
      if (newStart < 0) newStart = 0;
      
      moveClip(track.id, clip.id, newStart);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Handle Trimming (Resizing right edge)
  const handleResizeRight = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || clip.locked) return;
    e.stopPropagation();
    selectClip(track.id, clip.id);

    const startX = e.clientX;
    const initialEnd = clip.end;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / zoom;
      let newEnd = initialEnd + deltaTime;
      
      if (newEnd <= clip.start + 0.1) newEnd = clip.start + 0.1; // min duration 0.1s
      
      trimClip(track.id, clip.id, clip.start, newEnd);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const getClipColor = () => {
    switch (track.type) {
      case 'video': return isSelected ? 'bg-indigo-500 border-indigo-400' : 'bg-indigo-600/80 border-indigo-500';
      case 'audio': return isSelected ? 'bg-emerald-500 border-emerald-400' : 'bg-emerald-600/80 border-emerald-500';
      case 'captions': return isSelected ? 'bg-amber-500 border-amber-400 text-black' : 'bg-amber-600/80 border-amber-500';
      default: return 'bg-gray-600 border-gray-500';
    }
  };

  const getIcon = () => {
    switch (track.type) {
      case 'video': return <Film size={12} className="shrink-0 opacity-70" />;
      case 'audio': return <Mic size={12} className="shrink-0 opacity-70" />;
      case 'captions': return <FileText size={12} className="shrink-0 opacity-70" />;
      default: return <Video size={12} className="shrink-0 opacity-70" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          ref={clipRef}
          onPointerDown={handlePointerDown}
          className={cn(
            "absolute top-1 bottom-1 rounded-md border flex items-center px-2 cursor-grab active:cursor-grabbing select-none overflow-hidden group shadow-sm transition-shadow",
            getClipColor(),
            isSelected ? "ring-2 ring-white ring-offset-1 ring-offset-[#141414] shadow-md z-10" : "z-0",
            clip.locked ? "opacity-50 cursor-not-allowed" : ""
          )}
          style={{ 
            width: `${width}px`, 
            transform: `translateX(${left}px)`,
          }}
        >
          {/* Clip Content */}
          <div className="flex items-center gap-1.5 min-w-0 pointer-events-none">
            {getIcon()}
            <span className={cn(
              "text-xs truncate font-medium",
              track.type === 'captions' ? (isSelected ? 'text-black' : 'text-white') : 'text-white'
            )}>
              {clip.word || clip.assetUrl?.split('/').pop() || clip.id}
            </span>
          </div>

          {/* Right Resize Handle */}
          {!clip.locked && (
            <div 
              className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/30 active:bg-white/50"
              onPointerDown={handleResizeRight}
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1A1A1A] border-border text-white text-xs">
        <DropdownMenuItem 
          className="text-red-400 focus:bg-red-500/20 focus:text-red-400"
          onClick={(e) => { e.stopPropagation(); deleteClip(track.id, clip.id); }}
        >
          Delete Clip
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
