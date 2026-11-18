'use client';

import { useEffect, useRef, useState } from 'react';
import { useTimelineStore, useTimelineHistory } from '@/store/useTimelineStore';
import { useAIEditStore } from '@/store/useAIEditStore';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import logger from '@/lib/logger';
import Link from 'next/link';
import { Film, Layers, Video, SlidersHorizontal, Settings } from 'lucide-react';
import EditorTopBar from './EditorTopBar';

const VideoPreview = dynamic(() => import('./VideoPreview'), { ssr: false });
const InspectorPanel = dynamic(() => import('./InspectorPanel'), { ssr: false });
const AssetLibrary = dynamic(() => import('./AssetLibrary'), { ssr: false });
const Timeline = dynamic(() => import('./Timeline'), { ssr: false });
const AIEditBar = dynamic(() => import('./AIEditBar'), { ssr: false });
const AIEditHistory = dynamic(() => import('./AIEditHistory'), { ssr: false });

const editorTabs = [
  { id: 'projects', label: 'Projects', icon: Film, href: '/projects' },
  { id: 'assets', label: 'Assets', icon: Layers },
  { id: 'editor', label: 'Editor', icon: Video },
  { id: 'inspector', label: 'Inspector', icon: SlidersHorizontal },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export default function EditorLayout({ project }: { project: any }) {
  const loadTimeline = useTimelineStore(s => s.loadTimeline);
  const setIsPlaying = useTimelineStore(s => s.setIsPlaying);
  const isPlaying = useTimelineStore(s => s.isPlaying);
  const currentFrame = useTimelineStore(s => s.currentFrame);
  const setCurrentFrame = useTimelineStore(s => s.setCurrentFrame);
  const selectClip = useTimelineStore(s => s.selectClip);
  const selectedClipId = useTimelineStore(s => s.selectedClipId);
  const selectedTrackId = useTimelineStore(s => s.selectedTrackId);
  const isDirty = useTimelineStore(s => s.isDirty);
  const setIsDirty = useTimelineStore(s => s.setIsDirty);
  const setIsSaving = useTimelineStore(s => s.setIsSaving);
  const timeline = useTimelineStore(s => s.timeline);

  const { undo, redo } = useTimelineHistory();
  const autosaveTimerRef = useRef<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'assets' | 'inspector'>('assets');

  useEffect(() => {
    if (project.timeline_json) {
      loadTimeline(project.timeline_json);
    }
  }, [project.timeline_json, loadTimeline]);

  // When a clip is selected, auto-focus the inspector tab
  useEffect(() => {
    if (selectedClipId) {
      setSidebarTab('inspector');
    }
  }, [selectedClipId]);

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

  if (!timeline) return (
    <div className="flex-1 flex items-center justify-center bg-[#0A0A12] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#1E1B4B] border-t-[#7C3AED] rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading Editor...</span>
      </div>
    </div>
  );

  return (
    <div className="editor-dark flex flex-col h-screen w-screen overflow-hidden bg-[#0A0A12]">
      {/* Top Bar */}
      <EditorTopBar project={project} onSave={saveTimeline} />

      {/* Main Content Area (Preview Stage + Sidebar) */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Center Stage: Video Preview */}
        <div className="flex-1 flex flex-col bg-[#07070D] min-w-0 min-h-0 relative overflow-hidden">
          <VideoPreview />
        </div>

        {/* Right Sidebar: Tabbed Media Assets & Clip Inspector */}
        <div className="w-[360px] bg-[#0F0F18] border-l border-white/[0.08] flex-shrink-0 flex flex-col overflow-hidden">
          {/* Sidebar Tab Header */}
          <div className="flex items-center border-b border-white/[0.08] bg-[#12121C] px-2 pt-1 shrink-0">
            <button
              onClick={() => setSidebarTab('assets')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                sidebarTab === 'assets'
                  ? 'border-[#7C3AED] text-white bg-[#7C3AED]/10 rounded-t-lg'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers size={13} className={sidebarTab === 'assets' ? 'text-[#A78BFA]' : ''} />
              <span>Media Assets</span>
            </button>
            <button
              onClick={() => setSidebarTab('inspector')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all relative ${
                sidebarTab === 'inspector'
                  ? 'border-[#7C3AED] text-white bg-[#7C3AED]/10 rounded-t-lg'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <SlidersHorizontal size={13} className={sidebarTab === 'inspector' ? 'text-[#A78BFA]' : ''} />
              <span>Clip Inspector</span>
              {selectedClipId && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
              )}
            </button>
          </div>

          {/* Sidebar Tab Body */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {sidebarTab === 'assets' ? <AssetLibrary /> : <InspectorPanel />}
          </div>
        </div>
      </div>

      {/* AI Edit Bar */}
      <AIEditBar projectId={project.id} onOpenHistory={() => setIsHistoryOpen(false)} />

      {/* Timeline Area */}
      <div className="h-[210px] bg-[#0B0B14] border-t border-white/[0.08] flex-shrink-0">
        <Timeline />
      </div>

      {/* Editor Bottom Tab Bar */}
      <div className="h-12 bg-[#080810] border-t border-white/[0.06] flex items-center justify-around px-2 shrink-0">
        {editorTabs.map((tab) => {
          const isActive = (tab.id === 'inspector' && sidebarTab === 'inspector') ||
                           (tab.id === 'assets' && sidebarTab === 'assets') ||
                           (tab.id === 'editor' && !selectedClipId);

          const handleClick = () => {
            if (tab.id === 'assets') setSidebarTab('assets');
            if (tab.id === 'inspector') setSidebarTab('inspector');
          };

          const content = (
            <div
              key={tab.id}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#A78BFA] bg-[#7C3AED]/15' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={!tab.href ? handleClick : undefined}
            >
              <tab.icon size={16} strokeWidth={isActive ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </div>
          );

          if (tab.href) {
            return <Link key={tab.id} href={tab.href}>{content}</Link>;
          }
          return content;
        })}
      </div>

      {/* AI Edit History Drawer */}
      <AIEditHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
}
