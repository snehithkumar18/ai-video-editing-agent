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
    <div className="h-12 bg-[#0A0A0A] border-b border-border flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white" asChild>
          <Link href={`/projects/${project.id}`}>
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{project.title}</span>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 bg-[#141414] rounded-md p-1 border border-border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white"
            onClick={() => undo()}
            disabled={pastStates.length === 0}
          >
            <Undo2 size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white"
            onClick={() => redo()}
            disabled={futureStates.length === 0}
          >
            <Redo2 size={14} />
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-[#141414] rounded-md p-1 border border-border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white"
            onClick={() => setZoom(zoom - 20)}
          >
            <ZoomOut size={14} />
          </Button>
          <span className="text-xs font-mono w-10 text-center text-gray-300">{zoom}%</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 text-gray-400 hover:text-white"
            onClick={() => setZoom(zoom + 20)}
          >
            <ZoomIn size={14} />
          </Button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          {isSaving ? (
            <span className="text-yellow-500 flex items-center gap-1"><CircleDashed size={14} className="animate-spin" /> Saving...</span>
          ) : isDirty ? (
            <span className="text-gray-400 flex items-center gap-1">Unsaved changes</span>
          ) : (
            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={14} /> Saved</span>
          )}
        </div>
        
        <Button onClick={onSave} variant="secondary" size="sm" disabled={!isDirty || isSaving}>
          Save
        </Button>
        
        <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2" size="sm">
          <Download size={14} /> Export
        </Button>
      </div>
    </div>
  );
}
