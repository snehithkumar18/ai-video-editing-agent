'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, History, Check, X, Loader2 } from 'lucide-react';
import { useTimelineStore } from '@/store/useTimelineStore';
import { useAIEditStore } from '@/store/useAIEditStore';
import { TimelineOperation } from '@/lib/types/aiEdit';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface AIEditBarProps {
  projectId: string;
  onOpenHistory: () => void;
}

export default function AIEditBar({ projectId, onOpenHistory }: AIEditBarProps) {
  const [promptInput, setPromptInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getTimelineSummary = useTimelineStore((s) => s.getTimelineSummary);
  const applyOperations = useTimelineStore((s) => s.applyOperations);
  const timeline = useTimelineStore((s) => s.timeline);

  const {
    isProcessing,
    error,
    pendingOperations,
    pendingExplanation,
    pendingConfidence,
    showConfirmation,
    setIsProcessing,
    setError,
    setPendingOperations,
    clearPending,
    addToHistory,
  } = useAIEditStore();

  // Handle escape to cancel pending confirmation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirmation) {
        clearPending();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmation, clearPending]);

  // Click outside example prompts handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const summary = getTimelineSummary();
      const res = await fetch(`/api/project/${projectId}/ai-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput, timelineSummary: summary }),
      });

      const result = await res.json();

      if (result.success && result.data) {
        setPendingOperations(
          result.data.operations,
          result.data.explanation,
          result.data.confidence,
          result.data.humanReadableSummary
        );
      } else {
        setError(result.error || 'Failed to process prompt. Please try again.');
      }
    } catch (err) {
      console.error('Submit prompt error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyChanges = () => {
    if (!pendingOperations) return;

    try {
      applyOperations(pendingOperations);

      // Add to history
      addToHistory({
        id: uuidv4(),
        prompt: promptInput,
        explanation: pendingExplanation,
        operations: pendingOperations,
        appliedAt: new Date(),
        undone: false,
      });

      // Show specific feedback toast message
      triggerSuccessToast(pendingOperations);

      clearPending();
      setPromptInput('');
      setIsFocused(false);
    } catch (err) {
      console.error('Apply operations error:', err);
      toast.error('Failed to apply edits to the timeline.');
    }
  };

  const triggerSuccessToast = (ops: TimelineOperation[]) => {
    if (ops.length === 0) return;
    
    // Pick the most significant operation type to describe in toast
    const firstOp = ops[0];
    let message = 'Timeline changes applied';
    
    switch (firstOp.type) {
      case 'UPDATE_ALL_CAPTIONS_STYLE':
        message = 'All captions updated';
        break;
      case 'UPDATE_CAPTION_STYLE':
        message = 'Caption style updated';
        break;
      case 'UPDATE_CAPTION_TEXT':
        message = 'Caption text updated';
        break;
      case 'REPLACE_BROLL':
        message = 'B-roll clip replaced with new footage';
        break;
      case 'DELETE_CLIP':
        message = 'Clip removed';
        break;
      case 'MOVE_CLIP':
        message = 'Clip moved to new position';
        break;
      case 'UPDATE_AUDIO_VOLUME':
        message = 'Audio volume adjusted';
        break;
      case 'TRIM_TOTAL_DURATION':
        message = 'Video trimmed to new length';
        break;
    }
    
    toast.success(message, {
      description: 'Press Ctrl+Z to undo',
      duration: 4000,
    });
  };

  const getOpDescription = (op: TimelineOperation): string => {
    switch (op.type) {
      case 'UPDATE_CAPTION_STYLE': {
        const parts = [];
        if (op.changes.color) parts.push(`color: ${op.changes.color}`);
        if (op.changes.fontSize) parts.push(`size: ${op.changes.fontSize}px`);
        if (op.changes.animation) parts.push(`animation: ${op.changes.animation}`);
        if (op.changes.position) parts.push(`position: ${op.changes.position}`);
        const captionText = timeline?.tracks.find((t) => t.type === 'captions')?.clips.find((c) => c.id === op.clipId)?.word || op.clipId;
        return `Update style of caption "${captionText}": ${parts.join(', ')}`;
      }
      case 'UPDATE_ALL_CAPTIONS_STYLE': {
        const parts = [];
        if (op.changes.color) parts.push(`color: ${op.changes.color}`);
        if (op.changes.fontSize) parts.push(`size: ${op.changes.fontSize}px`);
        if (op.changes.animation) parts.push(`animation: ${op.changes.animation}`);
        if (op.changes.position) parts.push(`position: ${op.changes.position}`);
        const captionCount = timeline?.tracks.find((t) => t.type === 'captions')?.clips.length || 0;
        return `Update all ${captionCount} captions: ${parts.join(', ')}`;
      }
      case 'UPDATE_CAPTION_TEXT': {
        const oldText = timeline?.tracks.find((t) => t.type === 'captions')?.clips.find((c) => c.id === op.clipId)?.word || op.clipId;
        return `Update caption text from "${oldText}" to "${op.newText}"`;
      }
      case 'MOVE_CLIP': {
        return `Move clip "${op.clipId}" on track "${op.trackId}" to start at ${op.newStart.toFixed(1)}s`;
      }
      case 'TRIM_CLIP': {
        return `Trim clip "${op.clipId}" on track "${op.trackId}" (start: ${op.newStart.toFixed(1)}s, end: ${op.newEnd.toFixed(1)}s)`;
      }
      case 'DELETE_CLIP': {
        return `Delete clip "${op.clipId}" on track "${op.trackId}"`;
      }
      case 'REPLACE_BROLL': {
        return `Replace B-roll clip with Pexels footage for query "${op.searchQuery}"`;
      }
      case 'ADD_BROLL': {
        return `Add B-roll clip for query "${op.searchQuery}" at ${op.insertAtSecond.toFixed(1)}s (duration: ${op.durationSeconds}s)`;
      }
      case 'UPDATE_CLIP_OPACITY': {
        return `Set clip opacity to ${(op.opacity * 100).toFixed(0)}% for "${op.clipId}" on track "${op.trackId}"`;
      }
      case 'UPDATE_AUDIO_VOLUME': {
        return `Set audio volume to ${(op.volume * 100).toFixed(0)}% for "${op.clipId}" on track "${op.trackId}"`;
      }
      case 'UPDATE_ALL_AUDIO_VOLUME': {
        return `Adjust all audio clips on track "${op.trackId}" by multiplying volume by ${op.volumeMultiplier}`;
      }
      case 'TRIM_TOTAL_DURATION': {
        return `Trim total project duration to ${op.newDurationSeconds.toFixed(1)}s`;
      }
      default:
        return `${op.type} (${op.reasoning || 'No details provided'})`;
    }
  };

  const examplePrompts = [
    'Make all captions yellow and bold',
    'Remove the second B-roll clip',
    'Add B-roll about nature and calm at 20 seconds',
    'Make captions bounce instead of fade',
    'Lower the music volume by 50%',
    'Trim the video to end at 45 seconds',
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full border-t border-border bg-[#111111] px-4 py-3 flex-shrink-0 z-40"
      style={{ height: '56px' }}
    >
      {/* Example Prompts Panel (Collapsible floating panel when focused & empty input) */}
      {isFocused && !promptInput && !showConfirmation && !isProcessing && (
        <div className="absolute left-4 right-4 bottom-[64px] bg-[#161616] border border-border rounded-lg p-3 shadow-2xl z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 px-1">
            <Sparkles size={12} className="text-violet-400" /> Try these prompts:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {examplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptInput(p);
                }}
                className="text-left text-xs bg-[#202020] hover:bg-violet-600/25 border border-[#2d2d2d] hover:border-violet-500/50 rounded-md p-2 text-gray-300 hover:text-white transition duration-150 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation State UI */}
      {showConfirmation && pendingOperations ? (
        <div className="w-full flex items-center justify-between gap-4 h-full animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-400 font-medium truncate">
                AI Suggestion: {pendingExplanation}
              </span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                Ops to apply: {pendingOperations.length} |
                <span className="font-semibold text-gray-400 flex items-center gap-1">
                  Confidence:
                  {pendingConfidence && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        pendingConfidence === 'low'
                          ? 'bg-red-500/10 text-red-500'
                          : pendingConfidence === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}
                    >
                      {pendingConfidence.charAt(0).toUpperCase() + pendingConfidence.slice(1)}
                    </span>
                  )}
                </span>
              </span>
            </div>
          </div>

          {/* Quick list of operations (horizontal tags or popover description) */}
          <div className="hidden lg:flex items-center gap-2 max-w-[40%] overflow-x-auto no-scrollbar">
            {pendingOperations.slice(0, 2).map((op, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-[#222] border border-border text-gray-300 px-2 py-0.5 rounded truncate max-w-[180px]"
                title={getOpDescription(op)}
              >
                {getOpDescription(op)}
              </span>
            ))}
            {pendingOperations.length > 2 && (
              <span className="text-[9px] bg-violet-600/10 text-violet-400 px-1.5 py-0.5 rounded border border-violet-500/20 font-medium">
                +{pendingOperations.length - 2} more
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearPending}
              className="px-3 py-1 bg-[#222222] hover:bg-[#333333] text-gray-300 text-xs font-semibold rounded-md border border-border hover:text-white transition duration-150 flex items-center gap-1 cursor-pointer"
            >
              <X size={12} />
              Cancel
            </button>
            <button
              onClick={handleApplyChanges}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md transition duration-150 flex items-center gap-1 shadow-lg shadow-emerald-950/20 cursor-pointer"
            >
              <Check size={12} />
              Apply Changes
            </button>
          </div>
        </div>
      ) : (
        /* Normal State UI & Loading Shimmer */
        <form onSubmit={handleSubmit} className="w-full flex items-center justify-between gap-4 h-full">
          <div className="flex items-center gap-2 flex-1 min-w-0 relative">
            <div className="w-6 h-6 rounded-md bg-violet-600/10 text-violet-400 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className={isProcessing ? 'animate-spin' : ''} />
            </div>

            {isProcessing ? (
              <div className="flex-1 flex items-center h-8 bg-[#181818] rounded-md px-3 border border-[#2d2d2d] animate-pulse">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin text-violet-400" />
                  AI is reading your timeline...
                </span>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Tell me what to change... e.g. 'make all captions yellow and bigger'"
                value={promptInput}
                onChange={(e) => {
                  setPromptInput(e.target.value);
                  setError(null);
                }}
                onFocus={() => setIsFocused(true)}
                className="flex-1 h-8 bg-black border border-border rounded-md px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition duration-150"
              />
            )}

            {error && (
              <div className="absolute left-8 right-12 -top-[34px] bg-red-950 border border-red-800 text-red-300 text-[10px] px-2 py-1 rounded shadow-lg animate-in fade-in duration-200">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="submit"
              disabled={!promptInput.trim() || isProcessing}
              className="h-8 w-8 bg-violet-600 hover:bg-violet-700 disabled:bg-[#202020] disabled:text-gray-600 text-white rounded-md flex items-center justify-center transition duration-150 cursor-pointer"
            >
              <Send size={12} />
            </button>
            <div className="h-6 w-[1px] bg-border mx-1" />
            <button
              type="button"
              onClick={onOpenHistory}
              className="h-8 px-3 bg-[#161616] hover:bg-[#222222] border border-border rounded-md flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition duration-150 cursor-pointer"
            >
              <History size={12} />
              <span>History</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
