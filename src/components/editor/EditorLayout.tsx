'use client';

import { useEffect, useRef, useState } from 'react';
import { useTimelineStore, useTimelineHistory } from '@/store/useTimelineStore';
import { useAIEditStore } from '@/store/useAIEditStore';
import { toast } from 'sonner';
import EditorTopBar from './EditorTopBar';
import VideoPreview from './VideoPreview';
import InspectorPanel from './InspectorPanel';
import AssetLibrary from './AssetLibrary';
import Timeline from './Timeline';
import AIEditBar from './AIEditBar';
import AIEditHistory from './AIEditHistory';
import logger from '@/lib/logger';

export default function EditorLayout({ project }: { project: any }) {
  const loadTimeline = useTimelineStore(s => s.loadTimeline);
  const setIsPlaying = useTimelineStore(s => s.setIsPlaying);
  const isPlaying = useTimelineStore(s => s.isPlaying);
  const currentFrame = useTimelineStore(s => s.currentFrame);
  const setCurrentFrame = useTimelineStore(s => s.setCurrentFrame);
  const selectClip = useTimelineStore(s => s.selectClip);
  const isDirty = useTimelineStore(s => s.isDirty);
  const setIsDirty = useTimelineStore(s => s.setIsDirty);
  const setIsSaving = useTimelineStore(s => s.setIsSaving);
  const timeline = useTimelineStore(s => s.timeline);

  const { undo, redo } = useTimelineHistory();
  const autosaveTimerRef = useRef<NodeJS.Timeout>();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (project.timeline_json) {
      loadTimeline(project.timeline_json);
    }
  }, [project.timeline_json, loadTimeline]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(!useTimelineStore.getState().isPlaying);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentFrame(useTimelineStore.getState().currentFrame - 1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentFrame(useTimelineStore.getState().currentFrame + 1);
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
          // Find the last non-undone AI Edit History item and mark it undone
          const history = useAIEditStore.getState().history;
          const lastApplied = history.find(h => !h.undone);
          if (lastApplied) {
            useAIEditStore.getState().markUndone(lastApplied.id);
            toast.info('AI edit undone');
          }
        }
      } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveTimeline();
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        const { selectedTrackId, selectedClipId, deleteClip } = useTimelineStore.getState();
        if (selectedTrackId && selectedClipId) {
          e.preventDefault();
          deleteClip(selectedTrackId, selectedClipId);
        }
      } else if (e.code === 'Escape') {
        selectClip(null, null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setCurrentFrame, setIsPlaying, selectClip]);

  const saveTimeline = async () => {
    const currentTimeline = useTimelineStore.getState().timeline;
    if (!currentTimeline) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/project/${project.id}/timeline`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: currentTimeline }),
      });
      if (res.ok) {
        setIsDirty(false);
      }
    } catch (e) {
      logger.error('Save failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isDirty) {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        saveTimeline();
      }, 30000); // Autosave after 30 seconds of inactivity
    }
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [isDirty]);

  if (!timeline) return <div className="flex-1 flex items-center justify-center bg-[#0A0A0A] text-white">Loading Editor...</div>;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0A0A0A] text-foreground overflow-hidden">
      {/* Top Bar - 48px */}
      <EditorTopBar project={project} onSave={saveTimeline} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Col: Preview + Inspector */}
        <div className="flex-1 flex flex-col border-r border-border min-w-0">
          <div className="flex-1 bg-black flex items-center justify-center p-4 relative min-h-0">
            <VideoPreview />
          </div>
          <div className="h-64 border-t border-border bg-[#0D0D0D] overflow-y-auto">
            <InspectorPanel />
          </div>
        </div>

        {/* Right Col: Asset Library */}
        <div className="w-[320px] bg-[#0D0D0D] flex-shrink-0 flex flex-col">
          <AssetLibrary />
        </div>
      </div>

      {/* AI Edit Bar - 56px */}
      <AIEditBar projectId={project.id} onOpenHistory={() => setIsHistoryOpen(true)} />

      {/* Timeline Area - 220px height */}
      <div className="h-[220px] bg-[#141414] border-t border-border flex-shrink-0">
        <Timeline />
      </div>

      {/* AI Edit History Drawer */}
      <AIEditHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
}
