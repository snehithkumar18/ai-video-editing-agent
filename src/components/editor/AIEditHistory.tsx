'use client';

import React from 'react';
import { X, History, RotateCcw } from 'lucide-react';
import { useAIEditStore } from '@/store/useAIEditStore';
import { useTimelineStore } from '@/store/useTimelineStore';
import { toast } from 'sonner';

interface AIEditHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIEditHistory({ isOpen, onClose }: AIEditHistoryProps) {
  const history = useAIEditStore((s) => s.history);
  const applyOperations = useTimelineStore((s) => s.applyOperations);

  const handleReapply = (ops: any[], promptText: string) => {
    try {
      applyOperations(ops);
      toast.success('Re-applied changes!', {
        description: `Re-run: "${promptText}"`,
      });
    } catch (err) {
      console.error('Failed to reapply operations:', err);
      toast.error('Failed to reapply operations to timeline.');
    }
  };

  const formatRelativeTime = (date: any): string => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-80 bg-[#0d0d0d] border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-2 text-white">
            <History size={16} className="text-violet-400" />
            <span className="text-sm font-semibold">AI Edit History</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#222] transition duration-150 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12 px-4">
              <History size={36} className="text-gray-700 mb-3" />
              <p className="text-xs font-medium">No AI edits yet.</p>
              <p className="text-[10px] text-gray-600 mt-1 max-w-[180px]">Try typing a command in the AI bar below to start editing.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-lg border bg-[#141414] transition duration-150 ${
                  item.undone 
                    ? 'border-[#2d2d2d] opacity-50' 
                    : 'border-border hover:border-violet-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-white break-words line-clamp-2">
                    &ldquo;{item.prompt}&rdquo;
                  </span>
                  {item.undone && (
                    <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-bold">
                      Undone
                    </span>
                  )}
                </div>
                
                <p className="text-[10px] text-gray-400 mt-1.5 break-words leading-relaxed">
                  {item.explanation}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500 border-t border-[#222] pt-2">
                  <div className="flex items-center gap-1.5">
                    <span>{formatRelativeTime(item.appliedAt)}</span>
                    <span>&bull;</span>
                    <span>{item.operations.length} {item.operations.length === 1 ? 'change' : 'changes'}</span>
                  </div>
                  
                  {!item.undone && (
                    <button
                      onClick={() => handleReapply(item.operations, item.prompt)}
                      className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      Re-apply
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
