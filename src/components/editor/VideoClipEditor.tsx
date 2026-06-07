'use client';

import { Clip } from '@/lib/types/timeline';
import { useTimelineStore } from '@/store/useTimelineStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Replace } from 'lucide-react';

interface VideoClipEditorProps {
  clip: Clip;
  trackId: string;
}

export default function VideoClipEditor({ clip, trackId }: VideoClipEditorProps) {
  const updateClip = useTimelineStore(s => s.updateClip);

  const handleUpdate = (updates: Partial<Clip>) => {
    updateClip(trackId, clip.id, updates);
  };

  return (
    <div className="space-y-6">
      {/* File Info */}
      <div className="p-3 bg-black rounded-md border border-border">
        <Label className="text-xs text-gray-500 mb-1 block">Source File</Label>
        <div className="text-xs text-white truncate" title={clip.assetUrl}>
          {clip.assetUrl.split('/').pop()}
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-3 h-7 text-xs border-white/10 hover:bg-white/5">
          <Replace size={12} className="mr-2" /> Replace Asset
        </Button>
      </div>

      {/* Timing */}
      <div className="grid grid-cols-2 gap-4 border-b border-border pb-6">
        <div>
          <Label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Start</Label>
          <div className="font-mono text-sm text-gray-300">{clip.start.toFixed(2)}s</div>
        </div>
        <div>
          <Label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Duration</Label>
          <div className="font-mono text-sm text-gray-300">{clip.duration.toFixed(2)}s</div>
        </div>
      </div>

      {/* Visual Properties */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-gray-400">Opacity</Label>
            <span className="text-xs text-gray-500 font-mono">{Math.round((clip.opacity ?? 1) * 100)}%</span>
          </div>
          <Slider 
            value={[clip.opacity ?? 1]} 
            min={0} max={1} step={0.05}
            onValueChange={([v]) => handleUpdate({ opacity: v })}
            className="[&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
          />
        </div>
      </div>
    </div>
  );
}
