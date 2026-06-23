'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils/formatters';

interface AudioPreviewPlayerProps {
  src: string | null | undefined;
  label?: string;
}

export default function AudioPreviewPlayer({ src, label }: AudioPreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!src || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, x / bounds.width));
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  if (!src) {
    return (
      <div className="flex items-center gap-3 opacity-50">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <Volume2 size={14} className="text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">No audio available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <audio ref={audioRef} src={src} className="hidden" preload="metadata" />
      
      <button 
        onClick={togglePlay}
        className="w-8 h-8 shrink-0 rounded-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center text-white transition-colors"
      >
        {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        {label && <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">{label}</div>}
        
        {/* Fake animated waveform */}
        <div className="flex items-end gap-[2px] h-4 mb-1.5 opacity-80" onClick={togglePlay} style={{ cursor: 'pointer' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1 bg-violet-400/50 rounded-t-sm transition-all duration-100",
                isPlaying ? "animate-pulse" : "h-1"
              )}
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : '20%',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Scrubber */}
        <div 
          className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-violet-500 relative group-hover:bg-violet-400 transition-colors"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground tabular-nums">{formatDuration(currentTime)}</span>
          <span className="text-[10px] text-muted-foreground tabular-nums">{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
}
