import { create } from 'zustand';
import { temporal } from 'zundo';
import type { TimelineJSON, Track, Clip } from '@/lib/types/timeline';
import type { TimelineOperation } from '@/lib/types/aiEdit';

interface TimelineState {
  timeline: TimelineJSON | null;
  selectedClipId: string | null;
  selectedTrackId: string | null;
  currentFrame: number;
  isPlaying: boolean;
  zoom: number;
  isDirty: boolean;
  isSaving: boolean;
  
  loadTimeline: (timeline: TimelineJSON) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<Clip>) => void;
  moveClip: (trackId: string, clipId: string, newStart: number) => void;
  trimClip: (trackId: string, clipId: string, newStart: number, newEnd: number) => void;
  deleteClip: (trackId: string, clipId: string) => void;
  addClip: (trackId: string, clip: Clip) => void;
  replaceClipAsset: (trackId: string, clipId: string, newAssetUrl: string) => void;
  selectClip: (trackId: string | null, clipId: string | null) => void;
  setCurrentFrame: (frame: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
  setIsDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  getSelectedClip: () => Clip | null;
  getTimelineSummary: () => string;
  applyOperations: (operations: TimelineOperation[]) => void;
}

export const useTimelineStore = create<TimelineState>()(
  temporal(
    (set, get) => ({
      timeline: null,
      selectedClipId: null,
      selectedTrackId: null,
      currentFrame: 0,
      isPlaying: false,
      zoom: 80,
      isDirty: false,
      isSaving: false,

      loadTimeline: (timeline) => set({ timeline, isDirty: false }),

      updateClip: (trackId, clipId, updates) => set((state) => {
        if (!state.timeline) return state;
        const newTimeline = {
          ...state.timeline,
          tracks: state.timeline.tracks.map((track) => {
            if (track.id !== trackId) return track;
            return {
              ...track,
              clips: track.clips.map((clip) => {
                if (clip.id !== clipId) return clip;
                return { ...clip, ...updates };
              })
            };
          })
        };
        return { timeline: newTimeline, isDirty: true };
      }),

      moveClip: (trackId, clipId, newStart) => set((state) => {
        if (!state.timeline) return state;
        const newTimeline = {
          ...state.timeline,
          tracks: state.timeline.tracks.map((track) => {
            if (track.id !== trackId) return track;
            return {
              ...track,
              clips: track.clips.map((clip) => {
                if (clip.id !== clipId) return clip;
                return { ...clip, start: newStart, end: newStart + clip.duration };
              })
            };
          })
        };
        return { timeline: newTimeline, isDirty: true };
      }),

      trimClip: (trackId, clipId, newStart, newEnd) => set((state) => {
        if (!state.timeline) return state;
        const newTimeline = {
          ...state.timeline,
          tracks: state.timeline.tracks.map((track) => {
            if (track.id !== trackId) return track;
            return {
              ...track,
              clips: track.clips.map((clip) => {
                if (clip.id !== clipId) return clip;
                return { ...clip, start: newStart, end: newEnd, duration: newEnd - newStart };
              })
            };
          })
        };
        return { timeline: newTimeline, isDirty: true };
      }),

      deleteClip: (trackId, clipId) => set((state) => {
        if (!state.timeline) return state;
        const newTimeline = {
          ...state.timeline,
          tracks: state.timeline.tracks.map((track) => {
            if (track.id !== trackId) return track;
            return {
              ...track,
              clips: track.clips.filter((clip) => clip.id !== clipId)
            };
          })
        };
        return { 
          timeline: newTimeline, 
          isDirty: true,
          selectedClipId: state.selectedClipId === clipId ? null : state.selectedClipId,
          selectedTrackId: state.selectedClipId === clipId ? null : state.selectedTrackId,
        };
      }),

      addClip: (trackId, clip) => set((state) => {
        if (!state.timeline) return state;
        const newTimeline = {
          ...state.timeline,
          tracks: state.timeline.tracks.map((track) => {
            if (track.id !== trackId) return track;
            return {
              ...track,
              clips: [...track.clips, clip]
            };
          })
        };
        return { timeline: newTimeline, isDirty: true };
      }),

      replaceClipAsset: (trackId, clipId, newAssetUrl) => set((state) => {
        if (!state.timeline) return state;
        const newTimeline = {
          ...state.timeline,
          tracks: state.timeline.tracks.map((track) => {
            if (track.id !== trackId) return track;
            return {
              ...track,
              clips: track.clips.map((clip) => {
                if (clip.id !== clipId) return clip;
                return { ...clip, assetUrl: newAssetUrl };
              })
            };
          })
        };
        return { timeline: newTimeline, isDirty: true };
      }),

      selectClip: (trackId, clipId) => set({ selectedTrackId: trackId, selectedClipId: clipId }),
      
      setCurrentFrame: (frame) => set({ currentFrame: Math.max(0, frame) }),
      
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(300, zoom)) }),
      
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      
      setIsSaving: (saving) => set({ isSaving: saving }),

      getSelectedClip: () => {
        const { timeline, selectedTrackId, selectedClipId } = get();
        if (!timeline || !selectedTrackId || !selectedClipId) return null;
        
        const track = timeline.tracks.find(t => t.id === selectedTrackId);
        if (!track) return null;
        
        return track.clips.find(c => c.id === selectedClipId) || null;
      },

      getTimelineSummary: () => {
        const { timeline } = get()
        if (!timeline) return 'No timeline loaded'
        
        const lines: string[] = []
        lines.push(`Total duration: ${timeline.duration.toFixed(1)} seconds`)
        lines.push(`Resolution: ${timeline.width}x${timeline.height} at ${timeline.fps}fps`)
        
        for (const track of timeline.tracks) {
          if (track.clips.length === 0) continue
          
          if (track.type === 'captions') {
            const sampleCaptions = track.clips.slice(0, 3).map(c => `"${c.word}"`)
            const style = track.clips[0]?.style
            lines.push(`CAPTIONS TRACK: ${track.clips.length} caption words. Sample: ${sampleCaptions.join(', ')}... Style: ${style?.fontSize || 48}px, color ${style?.color || '#FFFFFF'}, position ${style?.position || 'bottom'}, animation ${style?.animation || 'none'}`)
            lines.push(`Caption IDs for reference: ${track.clips.slice(0, 10).map(c => `${c.id}="${c.word}"@${c.start.toFixed(1)}s`).join(', ')}`)
          }
          
          if (track.id === 'avatar-track') {
            const clip = track.clips[0]
            lines.push(`AVATAR TRACK: 1 clip from ${clip?.start.toFixed(1)}s to ${clip?.end.toFixed(1)}s`)
          }
          
          if (track.id === 'broll-track') {
            const clipSummary = track.clips.map((c, i) => 
              `clip${i+1}(id:${c.id}, ${c.start.toFixed(1)}s-${c.end.toFixed(1)}s)`
            ).join(', ')
            lines.push(`BROLL TRACK: ${track.clips.length} clips: ${clipSummary}`)
          }
          
          if (track.type === 'audio') {
            const clip = track.clips[0]
            lines.push(`AUDIO TRACK(${track.label}): volume ${clip?.volume || 1.0}, from ${clip?.start.toFixed(1)}s to ${clip?.end.toFixed(1)}s, id:${clip?.id}`)
          }
        }
        
        return lines.join('\n')
      },

      applyOperations: (operations: TimelineOperation[]) => {
        // Execute each operation in order using existing store actions
        for (const op of operations) {
          switch (op.type) {
            case 'UPDATE_CAPTION_STYLE': {
              const captionTrack = get().timeline?.tracks.find(t => t.type === 'captions');
              if (captionTrack) {
                const clip = captionTrack.clips.find(c => c.id === op.clipId);
                if (clip) {
                  get().updateClip(captionTrack.id, op.clipId, { style: { ...clip.style, ...op.changes } as any });
                }
              }
              break;
            }
            case 'UPDATE_ALL_CAPTIONS_STYLE': {
              const captionTrack = get().timeline?.tracks.find(t => t.type === 'captions')
              if (captionTrack) {
                captionTrack.clips.forEach(clip => {
                  get().updateClip(captionTrack.id, clip.id, { style: { ...clip.style, ...op.changes } as any })
                })
              }
              break
            }
            case 'UPDATE_CAPTION_TEXT': {
              const captionTrack = get().timeline?.tracks.find(t => t.type === 'captions')
              if (captionTrack) {
                get().updateClip(captionTrack.id, op.clipId, { word: op.newText })
              }
              break
            }
            case 'MOVE_CLIP': {
              get().moveClip(op.trackId, op.clipId, op.newStart)
              break
            }
            case 'TRIM_CLIP': {
              get().trimClip(op.trackId, op.clipId, op.newStart, op.newEnd)
              break
            }
            case 'DELETE_CLIP': {
              get().deleteClip(op.trackId, op.clipId)
              break
            }
            case 'UPDATE_CLIP_OPACITY': {
              get().updateClip(op.trackId, op.clipId, { opacity: op.opacity })
              break
            }
            case 'UPDATE_AUDIO_VOLUME': {
              get().updateClip(op.trackId, op.clipId, { volume: op.volume })
              break
            }
            case 'UPDATE_ALL_AUDIO_VOLUME': {
              const audioTrack = get().timeline?.tracks.find(t => t.id === op.trackId)
              if (audioTrack) {
                audioTrack.clips.forEach(clip => {
                  get().updateClip(op.trackId, clip.id, { volume: Math.min(1, (clip.volume || 1) * op.volumeMultiplier) })
                })
              }
              break
            }
            case 'REPLACE_BROLL': {
              if (op.newAssetUrl) {
                const brollTrack = get().timeline?.tracks.find(t => t.id === 'broll-track' || t.label === 'B-Roll');
                if (brollTrack) {
                  get().updateClip(brollTrack.id, op.clipId, { assetUrl: op.newAssetUrl })
                }
              }
              break
            }
            case 'ADD_BROLL': {
              if (op.newAssetUrl) {
                const brollTrack = get().timeline?.tracks.find(t => t.id === 'broll-track' || t.label === 'B-Roll');
                if (brollTrack) {
                  const newClip: Clip = {
                    id: `broll-${Date.now()}`,
                    assetUrl: op.newAssetUrl,
                    start: op.insertAtSecond,
                    end: op.insertAtSecond + op.durationSeconds,
                    duration: op.durationSeconds,
                    opacity: 1,
                    locked: false
                  }
                  get().addClip(brollTrack.id, newClip)
                }
              }
              break
            }
            case 'TRIM_TOTAL_DURATION': {
              // Trim all clips that extend beyond new duration
              const tl = get().timeline
              if (!tl) break
              tl.tracks.forEach(track => {
                track.clips.forEach(clip => {
                  if (clip.start >= op.newDurationSeconds) {
                    get().deleteClip(track.id, clip.id)
                  } else if (clip.end > op.newDurationSeconds) {
                    get().trimClip(track.id, clip.id, clip.start, op.newDurationSeconds)
                  }
                })
              })
              set(state => ({
                timeline: state.timeline ? { ...state.timeline, duration: op.newDurationSeconds } : null,
                isDirty: true
              }))
              break
            }
          }
        }
      }
    }),
    {
      partialize: (state) => ({ timeline: state.timeline }), // Only record timeline changes in history
    }
  )
);

export const useTimelineHistory = () => useTimelineStore.temporal.getState();
