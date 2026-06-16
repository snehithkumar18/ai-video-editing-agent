'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Mic, UserSquare, MessageSquare, Film, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import logger from '@/lib/logger';

interface GenerationProgressProps {
  projectId: string;
  initialProgress: number;
}

export default function GenerationProgress({ projectId, initialProgress }: GenerationProgressProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [status, setStatus] = useState<'generating' | 'editing' | 'failed' | 'complete'>('generating');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/video/status/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setProgress(data.data.render_progress || 0);
            setStatus(data.data.status);
            
            if (data.data.status === 'failed') {
              setErrorMsg(data.data.error_message || 'An unknown error occurred during generation.');
              if (pollingRef.current) clearInterval(pollingRef.current);
            } else if (data.data.status === 'editing' || data.data.status === 'complete') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setTimeout(() => {
                router.refresh();
              }, 1500); // Small delay to let user see 100%
            }
          }
        }
      } catch (err) {
        logger.error('Failed to poll status', err);
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [projectId, router]);

  const steps = [
    { label: 'Generating your voice...', icon: Mic, threshold: 0, doneThreshold: 20 },
    { label: 'Animating your face...', icon: UserSquare, threshold: 20, doneThreshold: 55 },
    { label: 'Creating captions...', icon: MessageSquare, threshold: 55, doneThreshold: 70 },
    { label: 'Finding B-roll footage...', icon: Film, threshold: 70, doneThreshold: 85 },
    { label: 'Assembling your video...', icon: Video, threshold: 85, doneThreshold: 100 },
  ];

  if (status === 'failed') {
    return (
      <Card className="bg-red-50/50 border border-red-200 p-8 text-center max-w-2xl mx-auto rounded-3xl shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-red-600 mb-2">Generation Failed</h3>
        <p className="text-red-500 mb-8 text-sm font-medium">{errorMsg}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 hover:bg-red-50 text-red-600 rounded-xl">
          Try Again
        </Button>
      </Card>
    );
  }

  // Calculate estimated time (very rough, assumes full process takes ~3 mins)
  const remainingPercent = Math.max(0, 100 - progress);
  const estimatedMinutes = Math.ceil((remainingPercent / 100) * 3);

  return (
    <Card className="bg-white border-[#E5E3EB] p-8 max-w-2xl mx-auto rounded-3xl shadow-sm">
      <div className="mb-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-bold text-[#1E1B4B]">{progress}%</span>
          <span className="text-sm text-[#7C3AED] font-semibold">
            {progress < 100 ? `About ${estimatedMinutes} min remaining` : 'Finalizing...'}
          </span>
        </div>
        <div className="h-4 bg-[#F8F7FC] rounded-full overflow-hidden border border-[#E5E3EB] relative">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Animated shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isDone = progress >= step.doneThreshold;
          const isActive = progress >= step.threshold && progress < step.doneThreshold;
          const isPending = progress < step.threshold;
          const Icon = step.icon;

          return (
            <div 
              key={index} 
              className={cn(
                "flex items-center gap-4 transition-all duration-500",
                isActive ? "opacity-100 scale-100" : (isDone ? "opacity-70 scale-100" : "opacity-30 scale-95")
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500",
                isDone 
                  ? "bg-emerald-50 text-emerald-500 border-emerald-100" 
                  : (isActive 
                      ? "bg-[#EDE9FE] text-[#7C3AED] border-[#C4B5FD]/30 shadow-[0_0_15px_rgba(124,58,237,0.15)]" 
                      : "bg-[#F8F7FC] text-[#B8B6BC] border-[#E5E3EB]")
              )}>
                {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} className={isActive ? "animate-pulse" : ""} />}
              </div>
              <div className="flex-1">
                <h4 className={cn(
                  "font-semibold transition-colors duration-500 text-sm",
                  isActive ? "text-[#1E1B4B] text-base" : (isDone ? "text-[#78767B]" : "text-[#B8B6BC]")
                )}>
                  {step.label}
                </h4>
              </div>
              {isActive && (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
