'use client';

import React, { useRef } from 'react';
import { Track, Clip } from '@/lib/types/timeline';
import { useTimelineStore } from '@/store/useTimelineStore';
import { cn } from '@/lib/utils';
import { MessageSquare, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface CaptionCue {
  id: string;
  firstClipId: string;
  start: number;
  end: number;
  duration: number;
  text: string;
  wordCount: number;
  clips: Clip[];
  trackId: string;
  locked?: boolean;
}

interface CaptionCueClipProps {
  cue: CaptionCue;
  track: Track;
  zoom: number;
}

export default function CaptionCueClip({ cue, track, zoom }: CaptionCueClipProps) {
  const selectedClipId = useTimelineStore(s => s.selectedClipId);
  const selectClip = useTimelineStore(s => s.selectClip);
  const deleteClip = useTimelineStore(s => s.deleteClip);
  const timeline = useTimelineStore(s => s.timeline);

  const isSelected = cue.clips.some(c => c.id === selectedClipId) || selectedClipId === cue.id;
  const clipRef = useRef<HTMLDivElement>(null);

  const left = cue.start * zoom;
  const width = Math.max(36, cue.duration * zoom);

  // Dragging entire phrase cue
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || cue.locked) return;
    e.stopPropagation();

    selectClip(track.id, cue.firstClipId);

    const startX = e.clientX;
    const initialStart = cue.start;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / zoom;
      let newStart = initialStart + deltaTime;
      if (newStart < 0) newStart = 0;
      const actualDelta = newStart - cue.start;

      if (!timeline) return;
      const newTimeline = {
        ...timeline,
        tracks: timeline.tracks.map(t => {
          if (t.id !== track.id) return t;
          const cueClipIds = new Set(cue.clips.map(c => c.id));
          return {
            ...t,
            clips: t.clips.map(c => {
              if (cueClipIds.has(c.id)) {
                const s = Math.max(0, c.start + actualDelta);
                return { ...c, start: s, end: s + c.duration };
              }
              return c;
            })
          };
        })
      };
      useTimelineStore.setState({ timeline: newTimeline, isDirty: true });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleDeleteCue = () => {
    if (!timeline) return;
    const cueClipIds = new Set(cue.clips.map(c => c.id));
    const newTimeline = {
      ...timeline,
      tracks: timeline.tracks.map(t => {
        if (t.id !== track.id) return t;
        return {
          ...t,
          clips: t.clips.filter(c => !cueClipIds.has(c.id))
        };
      })
    };
    useTimelineStore.setState({ timeline: newTimeline, isDirty: true, selectedClipId: null });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild nativeButton={false}>
        <div
          ref={clipRef}
          onPointerDown={handlePointerDown}
          className={cn(
            "absolute top-1 bottom-1 rounded-md border flex items-center px-2 cursor-grab active:cursor-grabbing select-none overflow-hidden transition-all group",
            "bg-gradient-to-r from-amber-950/70 via-amber-900/50 to-amber-950/70 border-amber-500/50 hover:border-amber-400 text-amber-200",
            isSelected ? "ring-2 ring-amber-300 border-amber-300 shadow-lg shadow-amber-500/25 z-20 brightness-110" : "z-10 hover:shadow-md",
            cue.locked ? "opacity-50 cursor-not-allowed" : ""
          )}
          style={{
            width: `${width}px`,
            transform: `translateX(${left}px)`,
          }}
          title={`"${cue.text}" (${cue.start.toFixed(2)}s - ${cue.end.toFixed(2)}s)`}
        >
          {/* Left accent indicator */}
          <div className="w-1 h-3 rounded-full bg-amber-400/80 mr-1.5 shrink-0" />

          {/* Cue Content */}
          <div className="flex items-center gap-1.5 min-w-0 pointer-events-none flex-1 overflow-hidden">
            <MessageSquare size={11} className="shrink-0 text-amber-400 opacity-90" />
            <span className="text-[11px] truncate font-medium tracking-tight text-amber-100">
              {cue.text || 'Caption'}
            </span>
          </div>

          {/* Duration tag */}
          <span className="text-[9px] font-mono text-amber-400/70 ml-1 shrink-0 px-1 py-0.5 rounded bg-black/40 border border-amber-500/20 group-hover:text-amber-300">
            {cue.duration.toFixed(1)}s
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1A1A1A] border-border text-white text-xs">
        <DropdownMenuItem
          className="text-red-400 focus:bg-red-500/20 focus:text-red-400"
          onClick={(e) => { e.stopPropagation(); handleDeleteCue(); }}
        >
          <Trash2 size={12} className="mr-2" />
          Delete Phrase ({cue.wordCount} words)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
