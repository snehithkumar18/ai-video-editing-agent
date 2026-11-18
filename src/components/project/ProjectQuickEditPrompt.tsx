'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Send, Mic, MicOff, Loader2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProjectQuickEditPromptProps {
  projectId: string;
}

const QUICK_SUGGESTIONS = [
  'Change captions to bright yellow',
  'Make captions bigger and bold',
  'Trim opening pause',
  'Add modern tech B-roll'
];

export default function ProjectQuickEditPrompt({ projectId }: ProjectQuickEditPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening... speak your edit instructions');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setPrompt(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error(`Microphone error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      toast.error('Could not access microphone');
    }
  };

  const handleApplyPrompt = async (promptText: string) => {
    const textToSubmit = promptText || prompt;
    if (!textToSubmit.trim() || loading) return;

    setLoading(true);
    setLastFeedback(null);

    try {
      const res = await fetch(`/api/project/${projectId}/ai-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSubmit,
          timelineSummary: 'Quick edit request from project overview dashboard',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setLastFeedback(data.data.explanation || data.data.humanReadableSummary || 'Edit processed successfully!');
        toast.success('AI edit generated! Open the timeline editor to review all fine-grain frames.');
        setPrompt('');
      } else {
        toast.error(data.error || 'Failed to process prompt. Please try again.');
      }
    } catch (err: any) {
      toast.error('Network error while processing prompt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#FAF9FD] border-[#E5E3EB] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1E1B4B]">AI Director Prompt Box</h4>
            <p className="text-xs text-[#78767B]">Talk or type instructions to refine captions, b-roll, or visuals</p>
          </div>
        </div>

        <Link
          href={`/projects/${projectId}/edit`}
          className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
        >
          Open Pro Editor <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex gap-2 relative">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyPrompt(prompt);
              }
            }}
            placeholder="Talk or type: e.g., 'Make captions yellow and add tech b-roll'..."
            disabled={loading}
            className="w-full h-11 bg-white border border-[#E5E3EB] rounded-xl pl-4 pr-11 text-xs text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          />
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Talk (voice input)"}
            className={cn(
              "absolute right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer",
              isListening
                ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30"
                : "text-gray-400 hover:text-[#7C3AED] hover:bg-[#EDE9FE]/50"
            )}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
        </div>

        <Button
          onClick={() => handleApplyPrompt(prompt)}
          disabled={!prompt.trim() || loading}
          className="h-11 px-5 rounded-xl btn-gradient text-white text-xs font-semibold gap-1.5 cursor-pointer"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <Send size={14} /> Send
            </>
          )}
        </Button>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] text-[#78767B] font-medium">Suggestions:</span>
        {QUICK_SUGGESTIONS.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPrompt(sug);
              handleApplyPrompt(sug);
            }}
            className="text-[11px] bg-white border border-[#E5E3EB] hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#4B5563] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {lastFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2">
          <Check size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
          <span>{lastFeedback}</span>
        </div>
      )}
    </Card>
  );
}
