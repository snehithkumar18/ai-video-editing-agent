'use client';

import { useTimelineStore, useTimelineHistory } from '@/store/useTimelineStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Undo2, Redo2, ZoomIn, ZoomOut, Download, CheckCircle2, CircleDashed } from 'lucide-react';
import Link from 'next/link';

interface EditorTopBarProps {
  project: any;
  onSave: () => void;
}

export default function EditorTopBar({ project, onSave }: EditorTopBarProps) {
  const { undo, redo, pastStates, futureStates } = useTimelineHistory();
  const zoom = useTimelineStore(s => s.zoom);
  const setZoom = useTimelineStore(s => s.setZoom);
  const isDirty = useTimelineStore(s => s.isDirty);
  const isSaving = useTimelineStore(s => s.isSaving);

  return (
    <div className="h-12 bg-[#0A0A12] border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link 
          href={`/projects/${project.id}`}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <span className="text-sm font-semibold text-white truncate max-w-[150px]">{project.title}</span>
      </div>

      {/* Center */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1 border border-white/[0.06]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => undo()}
            disabled={pastStates.length === 0}
          >
            <Undo2 size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => redo()}
            disabled={futureStates.length === 0}
          >
            <Redo2 size={14} />
          </Button>
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg p-1 border border-white/[0.06]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => setZoom(zoom - 20)}
          >
            <ZoomOut size={14} />
          </Button>
          <span className="text-xs font-mono w-10 text-center text-gray-300">{zoom}%</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => setZoom(zoom + 20)}
          >
            <ZoomIn size={14} />
          </Button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          {isSaving ? (
            <span className="text-amber-400 flex items-center gap-1"><CircleDashed size={14} className="animate-spin" /> Saving...</span>
          ) : isDirty ? (
            <span className="text-gray-500 flex items-center gap-1">Unsaved</span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14} /> Saved</span>
          )}
        </div>
        
        <button 
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="h-8 px-3 rounded-lg text-xs font-medium bg-white/[0.06] text-gray-300 hover:bg-white/10 border border-white/[0.06] disabled:opacity-40 transition-colors"
        >
          Save
        </button>
        
        <button className="h-8 px-4 rounded-lg text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors flex items-center gap-1.5">
          <Download size={13} />
          Export
        </button>
      </div>
    </div>
  );
}
