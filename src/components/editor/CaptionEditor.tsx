'use client';

import { Clip } from '@/lib/types/timeline';
import { useTimelineStore } from '@/store/useTimelineStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CaptionEditorProps {
  clip: Clip;
  trackId: string;
}

const COLORS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Yellow', value: '#FDE047' },
  { label: 'Green', value: '#4ADE80' },
  { label: 'Cyan', value: '#22D3EE' },
  { label: 'Red', value: '#F87171' },
];

export default function CaptionEditor({ clip, trackId }: CaptionEditorProps) {
  const updateClip = useTimelineStore(s => s.updateClip);
  const timeline = useTimelineStore(s => s.timeline);

  const style = clip.style || {};
  const isBackgroundEnabled = style.backgroundColor && style.backgroundColor !== 'transparent';

  const handleUpdate = (updates: Partial<Clip>) => {
    updateClip(trackId, clip.id, updates);
  };

  const handleStyleUpdate = (styleUpdates: any) => {
    updateClip(trackId, clip.id, { style: { ...style, ...styleUpdates } });
  };

  const handleApplyToAll = () => {
    if (!timeline) return;
    const track = timeline.tracks.find(t => t.id === trackId);
    if (!track) return;

    // Use setState directly to update all clips in the track at once
    const newTimeline = {
      ...timeline,
      tracks: timeline.tracks.map(t => {
        if (t.id !== trackId) return t;
        return {
          ...t,
          clips: t.clips.map(c => ({
            ...c,
            style: { ...c.style, ...style } // Apply current clip's style to all
          }))
        };
      })
    };
    useTimelineStore.setState({ timeline: newTimeline, isDirty: true });
  };

  return (
    <div className="space-y-6">
      {/* Text Content */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Text Content</Label>
        <Input 
          value={clip.word || ''} 
          onChange={(e) => handleUpdate({ word: e.target.value })}
          className="bg-black border-border font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Font Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-gray-400">Font Size</Label>
            <span className="text-xs text-gray-500 font-mono">{style.fontSize || 48}px</span>
          </div>
          <Slider 
            value={[style.fontSize || 48]} 
            min={24} max={120} step={2}
            onValueChange={([v]) => handleStyleUpdate({ fontSize: v })}
            className="[&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
          />
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Text Color</Label>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => handleStyleUpdate({ color: c.value })}
                className={`w-6 h-6 rounded-full border-2 ${style.color === c.value ? 'border-white scale-110' : 'border-transparent hover:border-gray-500'} transition-all`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Animation */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Animation</Label>
          <Select 
            value={style.animation || 'none'} 
            onValueChange={(v) => handleStyleUpdate({ animation: v })}
          >
            <SelectTrigger className="h-8 bg-black border-border text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-border text-white">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="Fade In">Fade In</SelectItem>
              <SelectItem value="Bounce">Bounce</SelectItem>
              <SelectItem value="Pop">Pop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Position</Label>
          <Select 
            value={style.position || 'bottom'} 
            onValueChange={(v) => handleStyleUpdate({ position: v })}
          >
            <SelectTrigger className="h-8 bg-black border-border text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-border text-white">
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Background */}
        <div className="space-y-2 col-span-2 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-400">Background Block</Label>
            <Switch 
              checked={isBackgroundEnabled} 
              onCheckedChange={(checked) => handleStyleUpdate({ backgroundColor: checked ? 'rgba(0,0,0,0.6)' : 'transparent' })}
            />
          </div>
          {isBackgroundEnabled && (
            <div className="pt-2">
              <Label className="text-[10px] text-gray-500 mb-1 block">Background Color</Label>
              <div className="flex gap-2">
                <button onClick={() => handleStyleUpdate({ backgroundColor: 'rgba(0,0,0,0.6)' })} className={`w-5 h-5 rounded bg-black border border-gray-600 ${style.backgroundColor === 'rgba(0,0,0,0.6)' ? 'ring-1 ring-white' : ''}`} />
                <button onClick={() => handleStyleUpdate({ backgroundColor: 'rgba(124,58,237,0.8)' })} className={`w-5 h-5 rounded bg-violet-600 border border-gray-600 ${style.backgroundColor === 'rgba(124,58,237,0.8)' ? 'ring-1 ring-white' : ''}`} />
                <button onClick={() => handleStyleUpdate({ backgroundColor: 'rgba(239,68,68,0.8)' })} className={`w-5 h-5 rounded bg-red-500 border border-gray-600 ${style.backgroundColor === 'rgba(239,68,68,0.8)' ? 'ring-1 ring-white' : ''}`} />
                <button onClick={() => handleStyleUpdate({ backgroundColor: 'rgba(255,255,255,0.8)' })} className={`w-5 h-5 rounded bg-white border border-gray-600 ${style.backgroundColor === 'rgba(255,255,255,0.8)' ? 'ring-1 ring-white' : ''}`} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full text-xs border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
          onClick={handleApplyToAll}
        >
          Apply style to all captions
        </Button>
      </div>
    </div>
  );
}
