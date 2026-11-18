'use client';

import React, { useRef } from 'react';
import { Clip, Track } from '@/lib/types/timeline';
import { useTimelineStore } from '@/store/useTimelineStore';
import { cn } from '@/lib/utils';
import { Film, Mic, Video, Music, MessageSquare, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TimelineClipProps {
  clip: Clip;
  track: Track;
  zoom: number;
  index?: number;
}

function getClipMeta(clip: Clip, track: Track, index: number = 0) {
  if (track.type === 'captions' || track.id === 'caption-track') {
    return {
      title: clip.word || 'Caption',
      icon: <MessageSquare size={11} className="shrink-0 text-amber-400" />,
      colorClass: 'bg-gradient-to-r from-amber-950/70 to-amber-900/60 border-amber-500/50 text-amber-100',
      activeRing: 'ring-amber-400 border-amber-300 shadow-amber-500/20',
      tag: 'CC',
    };
  }

  if (track.id === 'avatar-track' || clip.assetUrl?.toLowerCase().includes('spiderman')) {
    return {
      title: 'Spider-Man Presenter',
      subtitle: 'Original • Full BG',
      icon: <span className="text-xs">🕷️</span>,
      colorClass: 'bg-gradient-to-r from-purple-950/80 via-purple-900/70 to-indigo-950/80 border-purple-500/60 text-purple-100',
      activeRing: 'ring-purple-400 border-purple-300 shadow-purple-500/30',
      tag: 'Avatar',
    };
  }

  if (track.id === 'broll-track' || track.type === 'video') {
    let title = `B-Roll #${index + 1}`;
    if (clip.keyword) {
      const firstPhrase = clip.keyword.split(',')[0].trim();
      title = `B-Roll: ${firstPhrase.charAt(0).toUpperCase() + firstPhrase.slice(1)}`;
    } else if (clip.prompt) {
      title = `B-Roll: ${clip.prompt.slice(0, 20)}...`;
    }
    return {
      title,
      icon: <Film size={11} className="shrink-0 text-indigo-400" />,
      colorClass: 'bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-blue-900/80 border-blue-500/50 text-blue-100',
      activeRing: 'ring-indigo-400 border-indigo-300 shadow-indigo-500/30',
      tag: 'B-Roll',
    };
  }

  if (track.id === 'audio-track' || track.type === 'audio') {
    const isMale = clip.assetUrl?.includes('voice_audio') || clip.assetUrl?.includes('adam');
    return {
      title: isMale ? 'Voiceover (Male - Adam Kokoro)' : 'AI Voiceover (Studio)',
      icon: <Mic size={11} className="shrink-0 text-emerald-400" />,
      colorClass: 'bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-emerald-900/80 border-emerald-500/50 text-emerald-100',
      activeRing: 'ring-emerald-400 border-emerald-300 shadow-emerald-500/30',
      tag: 'Voice',
    };
  }

  if (track.id === 'music-track' || track.type === 'music') {
    return {
      title: 'Background Music (Chill Lo-Fi)',
      icon: <Music size={11} className="shrink-0 text-fuchsia-400" />,
      colorClass: 'bg-gradient-to-r from-fuchsia-950/80 via-purple-950/70 to-fuchsia-900/80 border-fuchsia-500/50 text-fuchsia-100',
      activeRing: 'ring-fuchsia-400 border-fuchsia-300 shadow-fuchsia-500/30',
      tag: 'Music',
    };
  }

  return {
    title: clip.assetUrl?.split('/').pop()?.replace(/\.\w+$/, '') || clip.id,
    icon: <Video size={11} className="shrink-0 text-gray-400" />,
    colorClass: 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-600/50 text-gray-200',
    activeRing: 'ring-white border-white shadow-white/20',
    tag: 'Clip',
  };
}

function TimelineClip({ clip, track, zoom, index = 0 }: TimelineClipProps) {
  const isSelected = useTimelineStore(s => s.selectedClipId === clip.id);
  const selectClip = useTimelineStore(s => s.selectClip);
  const moveClip = useTimelineStore(s => s.moveClip);
  const trimClip = useTimelineStore(s => s.trimClip);
  const deleteClip = useTimelineStore(s => s.deleteClip);

  const clipRef = useRef<HTMLDivElement>(null);
  const meta = getClipMeta(clip, track, index);

  const left = clip.start * zoom;
  const width = Math.max(30, clip.duration * zoom);

  // Handle Dragging (Moving)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || clip.locked) return;
    e.stopPropagation();

    selectClip(track.id, clip.id);

    const startX = e.clientX;
    const initialStart = clip.start;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / zoom;
      let newStart = initialStart + deltaTime;
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
      if (newEnd <= clip.start + 0.1) newEnd = clip.start + 0.1;
      trimClip(track.id, clip.id, clip.start, newEnd);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild nativeButton={false}>
        <div
          ref={clipRef}
          onPointerDown={handlePointerDown}
          className={cn(
            "absolute top-1 bottom-1 rounded-md border flex items-center px-2 cursor-grab active:cursor-grabbing select-none overflow-hidden transition-all group shadow-sm",
            meta.colorClass,
            isSelected ? `ring-2 ${meta.activeRing} shadow-lg z-20 brightness-110` : "z-10 hover:brightness-105",
            clip.locked ? "opacity-60 cursor-not-allowed" : ""
          )}
          style={{
            width: `${width}px`,
            transform: `translateX(${left}px)`,
          }}
          title={`${meta.title} (${clip.start.toFixed(2)}s - ${clip.end.toFixed(2)}s)`}
        >
          {/* Clip Content */}
          <div className="flex items-center gap-1.5 min-w-0 pointer-events-none flex-1 overflow-hidden">
            {meta.icon}
            <span className="text-xs truncate font-medium tracking-tight">
              {meta.title}
            </span>
          </div>

          {/* Duration Badge */}
          <span className="text-[9px] font-mono opacity-70 ml-1 shrink-0 px-1 py-0.5 rounded bg-black/40 border border-white/10 group-hover:opacity-100">
            {clip.duration.toFixed(1)}s
          </span>

          {/* Right Resize Handle */}
          {!clip.locked && (
            <div
              className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-white/30 active:bg-white/50 transition-colors"
              onPointerDown={handleResizeRight}
              title="Drag to trim duration"
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1A1A1A] border-border text-white text-xs">
        <DropdownMenuItem
          className="text-red-400 focus:bg-red-500/20 focus:text-red-400"
          onClick={(e) => { e.stopPropagation(); deleteClip(track.id, clip.id); }}
        >
          <Trash2 size={12} className="mr-2" />
          Delete Clip
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default React.memo(TimelineClip);
