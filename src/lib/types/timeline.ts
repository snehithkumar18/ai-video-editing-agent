export interface TimelineJSON {
  version: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  tracks: Track[];
}

export interface Track {
  id: string;
  type: 'video' | 'audio' | 'captions' | 'music' | 'sfx';
  label: string;
  clips: Clip[];
  visible: boolean;
  locked: boolean;
}

export interface Clip {
  id: string;
  assetUrl?: string;
  start: number;
  end: number;
  duration: number;
  word?: string;
  style?: CaptionStyle;
  opacity?: number;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  locked: boolean;
  mouthYPercent?: number;
  mouthXPercent?: number;
  motionIntensity?: number;
  metadata?: Record<string, unknown>;
}

export interface CaptionStyle {
  fontSize: number;
  fontWeight: string;
  color: string;
  backgroundColor?: string;
  borderRadius?: number;
  animation: 'none' | 'fadeIn' | 'bounce' | 'pop' | 'typewriter';
  position: 'top' | 'center' | 'bottom';
}
