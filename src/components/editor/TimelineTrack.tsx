'use client';

import React, { useMemo } from 'react';
import { Track, Clip } from '@/lib/types/timeline';
import TimelineClip from './TimelineClip';
import CaptionCueClip, { CaptionCue } from './CaptionCueClip';
import { Eye, EyeOff, Lock, Unlock, Film, Video, Mic, Music, MessageSquare } from 'lucide-react';
import { useTimelineStore } from '@/store/useTimelineStore';

interface TimelineTrackProps {
  track: Track;
  zoom: number;
  duration: number;
}

function getTrackMeta(track: Track) {
  if (track.id === 'avatar-track' || track.label?.toLowerCase().includes('avatar')) {
    return {
      icon: <span className="text-xs">🕷️</span>,
      colorDot: 'bg-purple-500',
      label: 'Avatar / Host',
    };
  }
  if (track.id === 'broll-track' || track.label?.toLowerCase().includes('b-roll')) {
    return {
      icon: <Film size={12} className="text-indigo-400" />,
      colorDot: 'bg-indigo-500',
      label: 'B-Roll / Visuals',
    };
  }
  if (track.type === 'captions' || track.id === 'caption-track') {
    return {
      icon: <MessageSquare size={12} className="text-amber-400" />,
      colorDot: 'bg-amber-500',
      label: 'Captions',
    };
  }
  if (track.id === 'audio-track' || track.type === 'audio') {
    return {
      icon: <Mic size={12} className="text-emerald-400" />,
      colorDot: 'bg-emerald-500',
      label: 'Voiceover',
    };
  }
  if (track.id === 'music-track' || track.type === 'music') {
    return {
      icon: <Music size={12} className="text-fuchsia-400" />,
      colorDot: 'bg-fuchsia-500',
      label: 'Music',
    };
  }
  return {
    icon: <Video size={12} className="text-gray-400" />,
    colorDot: 'bg-gray-500',
    label: track.label || 'Track',
  };
}

export function groupWordsIntoCues(clips: Clip[], trackId: string): CaptionCue[] {
  if (!clips || clips.length === 0) return [];
  const cues: CaptionCue[] = [];
  let currentGroup: Clip[] = [];

  clips.forEach((clip, idx) => {
    currentGroup.push(clip);
    const wordText = clip.word || '';
    const hasPunctuation = /[.!?:]$/.test(wordText.trim());
    const nextClip = clips[idx + 1];
    const hasPause = nextClip ? (nextClip.start - clip.end > 0.35) : true;
    const isLongEnough = currentGroup.length >= 6;

    if (hasPunctuation || hasPause || isLongEnough || idx === clips.length - 1) {
      const first = currentGroup[0];
      const last = currentGroup[currentGroup.length - 1];
      cues.push({
        id: `cue-${first.id}`,
        firstClipId: first.id,
        start: first.start,
        end: last.end,
        duration: Math.max(0.2, last.end - first.start),
        text: currentGroup.map(c => c.word || '').filter(Boolean).join(' ').trim(),
        wordCount: currentGroup.length,
        clips: [...currentGroup],
        trackId,
        locked: first.locked,
      });
      currentGroup = [];
    }
  });

  return cues;
}

function TimelineTrack({ track, zoom, duration }: TimelineTrackProps) {
  const updateTrack = (updates: Partial<Track>) => {
    const state = useTimelineStore.getState();
    if (!state.timeline) return;

    const newTimeline = {
      ...state.timeline,
      tracks: state.timeline.tracks.map(t => t.id === track.id ? { ...t, ...updates } : t)
    };
    useTimelineStore.setState({ timeline: newTimeline, isDirty: true });
  };

  const isSelectedTrack = useTimelineStore(s => s.selectedTrackId === track.id);
  const trackMeta = getTrackMeta(track);

  // If captions track, group words into sentence cues
  const captionCues = useMemo(() => {
    if (track.type === 'captions' || track.id === 'caption-track') {
      return groupWordsIntoCues(track.clips, track.id);
    }
    return [];
  }, [track.clips, track.type, track.id]);

  return (
    <div className={`flex border-b border-white/[0.04] h-[46px] group transition-colors ${isSelectedTrack ? 'bg-[#7C3AED]/[0.05]' : 'hover:bg-white/[0.01]'}`}>
      {/* Track Header */}
      <div className="w-[180px] flex-shrink-0 bg-[#12121C] border-r border-white/[0.08] flex items-center justify-between px-3 z-30 sticky left-0 group-hover:bg-[#181826] select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-1.5 h-1.5 rounded-full ${trackMeta.colorDot} shrink-0`} />
          <div className="shrink-0">{trackMeta.icon}</div>
          <span className="text-xs font-semibold text-gray-200 truncate" title={trackMeta.label}>
            {trackMeta.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => updateTrack({ visible: !track.visible })}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={track.visible ? 'Hide track' : 'Show track'}
          >
            {track.visible ? <Eye size={12} /> : <EyeOff size={12} className="text-gray-500" />}
          </button>
          <button
            onClick={() => updateTrack({ locked: !track.locked })}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={track.locked ? 'Unlock track' : 'Lock track'}
          >
            {track.locked ? <Lock size={12} className="text-amber-400" /> : <Unlock size={12} />}
          </button>
        </div>
      </div>

      {/* Track Content */}
      <div
        className={`flex-1 relative ${!track.visible ? 'opacity-25 pointer-events-none' : ''}`}
        style={{ width: duration * zoom }}
      >
        {track.type === 'captions' ? (
          captionCues.map(cue => (
            <CaptionCueClip
              key={cue.id}
              cue={cue}
              track={track}
              zoom={zoom}
            />
          ))
        ) : (
          track.clips.map((clip, index) => (
            <TimelineClip
              key={clip.id}
              clip={clip}
              track={track}
              zoom={zoom}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default React.memo(TimelineTrack);
