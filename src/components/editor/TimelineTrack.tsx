'use client';

import { Track } from '@/lib/types/timeline';
import TimelineClip from './TimelineClip';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useTimelineStore } from '@/store/useTimelineStore';

interface TimelineTrackProps {
  track: Track;
  zoom: number;
  duration: number;
}

export default function TimelineTrack({ track, zoom, duration }: TimelineTrackProps) {
  const updateTrack = (updates: Partial<Track>) => {
    const state = useTimelineStore.getState();
    if (!state.timeline) return;
    
    // Quick hack for updating track props, ideally add updateTrack to store
    const newTimeline = {
      ...state.timeline,
      tracks: state.timeline.tracks.map(t => t.id === track.id ? { ...t, ...updates } : t)
    };
    useTimelineStore.setState({ timeline: newTimeline, isDirty: true });
  };

  const isSelectedTrack = useTimelineStore(s => s.selectedTrackId === track.id);

  return (
    <div className={`flex border-b border-border h-[42px] group ${isSelectedTrack ? 'bg-white/[0.02]' : ''}`}>
      {/* Track Header */}
      <div className="w-[160px] flex-shrink-0 bg-[#1A1A1A] border-r border-border flex items-center justify-between px-3 z-30 sticky left-0 group-hover:bg-[#222]">
        <span className="text-xs font-medium text-gray-300 truncate w-24" title={track.label}>
          {track.label}
        </span>
        <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => updateTrack({ visible: !track.visible })}
            className="text-gray-400 hover:text-white"
          >
            {track.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button 
            onClick={() => updateTrack({ locked: !track.locked })}
            className="text-gray-400 hover:text-white"
          >
            {track.locked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
        </div>
      </div>

      {/* Track Content */}
      <div 
        className={`flex-1 relative ${!track.visible ? 'opacity-30' : ''}`}
        style={{ width: duration * zoom }}
      >
        {/* Track background grid lines (optional, can just rely on ruler) */}
        
        {track.clips.map(clip => (
          <TimelineClip 
            key={clip.id} 
            clip={clip} 
            track={track} 
            zoom={zoom} 
          />
        ))}
      </div>
    </div>
  );
}
