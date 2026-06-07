'use client';

interface PlayheadLineProps {
  currentFrame: number;
  fps: number;
  zoom: number;
}

export default function PlayheadLine({ currentFrame, fps, zoom }: PlayheadLineProps) {
  const left = (currentFrame / fps) * zoom;

  return (
    <div 
      className="absolute top-0 bottom-0 w-px bg-red-500 z-40 pointer-events-none"
      style={{ transform: `translateX(${left}px)` }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rotate-45 -mt-1.5" />
    </div>
  );
}
