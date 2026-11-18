'use client';

import { useTimelineStore } from '@/store/useTimelineStore';
import CaptionEditor from './CaptionEditor';
import VideoClipEditor from './VideoClipEditor';
import AudioClipEditor from './AudioClipEditor';
import { SlidersHorizontal, Film, MessageSquare, Mic, Music, Info } from 'lucide-react';

function getClipDisplayTitle(clip: any, track: any) {
  if (track.type === 'captions' || track.id === 'caption-track') {
    return clip.word || 'Caption Phrase';
  }
  if (track.id === 'avatar-track' || clip.assetUrl?.includes('spiderman')) {
    return 'Spider-Man Presenter';
  }
  if (track.id === 'broll-track' || track.type === 'video') {
    if (clip.keyword) {
      const first = clip.keyword.split(',')[0].trim();
      return `B-Roll: ${first.charAt(0).toUpperCase() + first.slice(1)}`;
    }
    return clip.assetUrl?.split('/').pop() || 'Video Clip';
  }
  if (track.id === 'audio-track' || track.type === 'audio') {
    return 'AI Voiceover (Male - Adam Kokoro)';
  }
  if (track.id === 'music-track' || track.type === 'music') {
    return 'Background Music (Chill Lo-Fi)';
  }
  return clip.assetUrl?.split('/').pop() || 'Selected Clip';
}

function getTrackIcon(track: any) {
  if (track.type === 'captions') return <MessageSquare size={14} className="text-amber-400" />;
  if (track.id === 'avatar-track') return <span className="text-sm">🕷️</span>;
  if (track.id === 'broll-track') return <Film size={14} className="text-indigo-400" />;
  if (track.type === 'audio') return <Mic size={14} className="text-emerald-400" />;
  if (track.type === 'music') return <Music size={14} className="text-fuchsia-400" />;
  return <SlidersHorizontal size={14} className="text-gray-400" />;
}

export default function InspectorPanel() {
  const selectedClip = useTimelineStore(s => s.getSelectedClip());
  const selectedTrackId = useTimelineStore(s => s.selectedTrackId);
  const timeline = useTimelineStore(s => s.timeline);

  if (!selectedClip || !selectedTrackId || !timeline) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
          <SlidersHorizontal size={20} className="text-gray-400 opacity-60" />
        </div>
        <h4 className="text-xs font-semibold text-gray-300 mb-1">No Clip Selected</h4>
        <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
          Click any clip or caption phrase on the timeline below to customize its properties.
        </p>
      </div>
    );
  }

  const track = timeline.tracks.find(t => t.id === selectedTrackId);
  if (!track) return null;

  const displayTitle = getClipDisplayTitle(selectedClip, track);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 custom-scrollbar select-none">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            {getTrackIcon(track)}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-white capitalize leading-none mb-1">
              {track.label || track.type} Properties
            </h3>
            <p className="text-[10px] text-gray-400 font-mono truncate max-w-[220px]" title={displayTitle}>
              {displayTitle}
            </p>
          </div>
        </div>

        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/30 shrink-0">
          {selectedClip.duration.toFixed(2)}s
        </span>
      </div>

      {/* Editor Content */}
      <div className="flex-1">
        {track.type === 'captions' && <CaptionEditor clip={selectedClip} trackId={selectedTrackId} />}
        {track.type === 'video' && <VideoClipEditor clip={selectedClip} trackId={selectedTrackId} />}
        {track.type === 'audio' && <AudioClipEditor clip={selectedClip} trackId={selectedTrackId} />}
        {track.type === 'music' && <AudioClipEditor clip={selectedClip} trackId={selectedTrackId} />}
      </div>
    </div>
  );
}
