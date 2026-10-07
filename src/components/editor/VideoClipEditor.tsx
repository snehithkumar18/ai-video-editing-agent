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
          {(clip.assetUrl || '').split('/').pop()}
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

        {/* Avatar Anatomical & Motion Tuning (if Avatar clip) */}
        {(trackId === 'avatar-track' || clip.id?.includes('avatar') || clip.assetUrl?.match(/\.(png|jpg|jpeg|webp)/i)) && (
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-white">Avatar Calibration</Label>
              <span className="text-[10px] text-[#A78BFA] bg-[#7C3AED]/10 px-2 py-0.5 rounded border border-[#7C3AED]/20">
                Live Preview
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px] px-2 border-white/10 text-gray-300 hover:text-white"
                onClick={() => handleUpdate({ mouthYPercent: 46.2, mouthXPercent: 50.0 })}
              >
                Portrait (46%)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px] px-2 border-white/10 text-gray-300 hover:text-white"
                onClick={() => handleUpdate({ mouthYPercent: 27.5, mouthXPercent: 51.0 })}
              >
                Full Body (28%)
              </Button>
            </div>

            {/* Mouth Height Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Mouth Height Y</span>
                <span className="text-gray-400 font-mono">{(clip.mouthYPercent ?? 46.2).toFixed(1)}%</span>
              </div>
              <Slider
                value={[clip.mouthYPercent ?? 46.2]}
                min={20}
                max={65}
                step={0.5}
                onValueChange={([v]) => handleUpdate({ mouthYPercent: v })}
                className="[&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
              />
            </div>

            {/* Head Nod & Motion Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Motion & Nodding</span>
                <span className="text-gray-400 font-mono">{(clip.motionIntensity ?? 1.0).toFixed(1)}x</span>
              </div>
              <Slider
                value={[clip.motionIntensity ?? 1.0]}
                min={0}
                max={2.0}
                step={0.1}
                onValueChange={([v]) => handleUpdate({ motionIntensity: v })}
                className="[&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
