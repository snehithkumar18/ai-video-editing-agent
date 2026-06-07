'use client';

import { useTimelineStore } from '@/store/useTimelineStore';
import CaptionEditor from './CaptionEditor';
import VideoClipEditor from './VideoClipEditor';
import AudioClipEditor from './AudioClipEditor';

export default function InspectorPanel() {
  const selectedClip = useTimelineStore(s => s.getSelectedClip());
  const selectedTrackId = useTimelineStore(s => s.selectedTrackId);
  const timeline = useTimelineStore(s => s.timeline);

  if (!selectedClip || !selectedTrackId || !timeline) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500">
        Select a clip to edit its properties
      </div>
    );
  }

  const track = timeline.tracks.find(t => t.id === selectedTrackId);
  if (!track) return null;

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <h3 className="font-semibold text-white capitalize">{track.type} Inspector</h3>
        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-black rounded border border-border">
          {selectedClip.word || selectedClip.assetUrl?.split('/').pop() || 'Clip'}
        </span>
      </div>

      {track.type === 'captions' && <CaptionEditor clip={selectedClip} trackId={selectedTrackId} />}
      {track.type === 'video' && <VideoClipEditor clip={selectedClip} trackId={selectedTrackId} />}
      {track.type === 'audio' && <AudioClipEditor clip={selectedClip} trackId={selectedTrackId} />}
    </div>
  );
}
