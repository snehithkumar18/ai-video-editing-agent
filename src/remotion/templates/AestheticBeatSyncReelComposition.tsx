import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  Img,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from 'remotion';

export interface ReelSlot {
  slotIndex: number;
  type?: 'photo' | 'video';
  src: string;
  startSec: number;
  endSec: number;
  durationSec: number;
}

export interface AestheticBeatSyncProps {
  slots?: ReelSlot[];
  audioSrc?: string;
  applyVintageGrade?: boolean;
}

// 30 exact timestamps extracted directly from the reference Instagram reel
export const DEFAULT_REEL_SLOTS: ReelSlot[] = [
  { slotIndex: 1,  type: 'photo', src: 'processed_reel_assets/photo_01.jpg', startSec: 0.00,  endSec: 0.21,  durationSec: 0.21 },
  { slotIndex: 2,  type: 'photo', src: 'processed_reel_assets/photo_02.jpg', startSec: 0.21,  endSec: 0.46,  durationSec: 0.25 },
  { slotIndex: 3,  type: 'photo', src: 'processed_reel_assets/photo_03.jpg', startSec: 0.46,  endSec: 0.67,  durationSec: 0.21 },
  { slotIndex: 4,  type: 'photo', src: 'processed_reel_assets/photo_04.jpg', startSec: 0.67,  endSec: 0.88,  durationSec: 0.21 },
  { slotIndex: 5,  type: 'photo', src: 'processed_reel_assets/photo_05.jpg', startSec: 0.88,  endSec: 1.08,  durationSec: 0.21 },
  { slotIndex: 6,  type: 'photo', src: 'processed_reel_assets/photo_06.jpg', startSec: 1.08,  endSec: 1.33,  durationSec: 0.25 },
  { slotIndex: 7,  type: 'photo', src: 'processed_reel_assets/photo_07.jpg', startSec: 1.33,  endSec: 1.50,  durationSec: 0.17 },
  { slotIndex: 8,  type: 'photo', src: 'processed_reel_assets/photo_08.jpg', startSec: 1.50,  endSec: 1.75,  durationSec: 0.25 },
  { slotIndex: 9,  type: 'photo', src: 'processed_reel_assets/photo_09.jpg', startSec: 1.75,  endSec: 2.00,  durationSec: 0.25 },
  { slotIndex: 10, type: 'photo', src: 'processed_reel_assets/photo_10.jpg', startSec: 2.00,  endSec: 2.21,  durationSec: 0.21 },
  { slotIndex: 11, type: 'photo', src: 'processed_reel_assets/photo_11.jpg', startSec: 2.21,  endSec: 2.46,  durationSec: 0.25 },
  { slotIndex: 12, type: 'photo', src: 'processed_reel_assets/photo_12.jpg', startSec: 2.46,  endSec: 2.71,  durationSec: 0.25 },
  { slotIndex: 13, type: 'photo', src: 'processed_reel_assets/photo_13.jpg', startSec: 2.71,  endSec: 2.92,  durationSec: 0.21 },
  { slotIndex: 14, type: 'photo', src: 'processed_reel_assets/photo_14.jpg', startSec: 2.92,  endSec: 3.12,  durationSec: 0.21 },
  { slotIndex: 15, type: 'photo', src: 'processed_reel_assets/photo_15.jpg', startSec: 3.12,  endSec: 3.46,  durationSec: 0.33 },
  { slotIndex: 16, type: 'video', src: 'processed_reel_assets/clip_slot_16.mp4', startSec: 3.46,  endSec: 4.54,  durationSec: 1.08 },
  { slotIndex: 17, type: 'photo', src: 'processed_reel_assets/photo_16.jpg', startSec: 4.54,  endSec: 4.71,  durationSec: 0.17 },
  { slotIndex: 18, type: 'video', src: 'processed_reel_assets/clip_slot_18.mp4', startSec: 4.71,  endSec: 5.88,  durationSec: 1.17 },
  { slotIndex: 19, type: 'video', src: 'processed_reel_assets/clip_slot_19.mp4', startSec: 5.88,  endSec: 6.58,  durationSec: 0.71 },
  { slotIndex: 20, type: 'video', src: 'processed_reel_assets/clip_slot_20.mp4', startSec: 6.58,  endSec: 7.67,  durationSec: 1.08 },
  { slotIndex: 21, type: 'video', src: 'processed_reel_assets/clip_slot_21.mp4', startSec: 7.67,  endSec: 8.21,  durationSec: 0.54 },
  { slotIndex: 22, type: 'video', src: 'processed_reel_assets/clip_slot_22.mp4', startSec: 8.21,  endSec: 8.75,  durationSec: 0.54 },
  { slotIndex: 23, type: 'video', src: 'processed_reel_assets/clip_slot_23.mp4', startSec: 8.75,  endSec: 9.42,  durationSec: 0.67 },
  { slotIndex: 24, type: 'video', src: 'processed_reel_assets/clip_slot_24.mp4', startSec: 9.42,  endSec: 10.50, durationSec: 1.08 },
  { slotIndex: 25, type: 'video', src: 'processed_reel_assets/clip_slot_25.mp4', startSec: 10.50, endSec: 11.33, durationSec: 0.83 },
  { slotIndex: 26, type: 'video', src: 'processed_reel_assets/clip_slot_26.mp4', startSec: 11.33, endSec: 11.88, durationSec: 0.54 },
  { slotIndex: 27, type: 'video', src: 'processed_reel_assets/clip_slot_27.mp4', startSec: 11.88, endSec: 12.46, durationSec: 0.58 },
  { slotIndex: 28, type: 'video', src: 'processed_reel_assets/clip_slot_28.mp4', startSec: 12.46, endSec: 14.25, durationSec: 1.79 },
  { slotIndex: 29, type: 'video', src: 'processed_reel_assets/clip_slot_29.mp4', startSec: 14.25, endSec: 14.88, durationSec: 0.62 },
  { slotIndex: 30, type: 'video', src: 'processed_reel_assets/clip_slot_30.mp4', startSec: 14.88, endSec: 16.38, durationSec: 1.50 },
];

// Ultra-Realistic Edition: 15 Fast Beat-Synced Photos + 6 Limited, Most Beautiful, 100% Gimbal-Steady Front Poses
export const ULTRA_REALISTIC_REEL_SLOTS: ReelSlot[] = [
  { slotIndex: 1,  type: 'photo', src: 'processed_reel_assets_realistic/photo_01.jpg', startSec: 0.00,  endSec: 0.21,  durationSec: 0.21 },
  { slotIndex: 2,  type: 'photo', src: 'processed_reel_assets_realistic/photo_02.jpg', startSec: 0.21,  endSec: 0.46,  durationSec: 0.25 },
  { slotIndex: 3,  type: 'photo', src: 'processed_reel_assets_realistic/photo_03.jpg', startSec: 0.46,  endSec: 0.67,  durationSec: 0.21 },
  { slotIndex: 4,  type: 'photo', src: 'processed_reel_assets_realistic/photo_04.jpg', startSec: 0.67,  endSec: 0.88,  durationSec: 0.21 },
  { slotIndex: 5,  type: 'photo', src: 'processed_reel_assets_realistic/photo_05.jpg', startSec: 0.88,  endSec: 1.08,  durationSec: 0.21 },
  { slotIndex: 6,  type: 'photo', src: 'processed_reel_assets_realistic/photo_06.jpg', startSec: 1.08,  endSec: 1.33,  durationSec: 0.25 },
  { slotIndex: 7,  type: 'photo', src: 'processed_reel_assets_realistic/photo_07.jpg', startSec: 1.33,  endSec: 1.50,  durationSec: 0.17 },
  { slotIndex: 8,  type: 'photo', src: 'processed_reel_assets_realistic/photo_08.jpg', startSec: 1.50,  endSec: 1.75,  durationSec: 0.25 },
  { slotIndex: 9,  type: 'photo', src: 'processed_reel_assets_realistic/photo_09.jpg', startSec: 1.75,  endSec: 2.00,  durationSec: 0.25 },
  { slotIndex: 10, type: 'photo', src: 'processed_reel_assets_realistic/photo_10.jpg', startSec: 2.00,  endSec: 2.21,  durationSec: 0.21 },
  { slotIndex: 11, type: 'photo', src: 'processed_reel_assets_realistic/photo_11.jpg', startSec: 2.21,  endSec: 2.46,  durationSec: 0.25 },
  { slotIndex: 12, type: 'photo', src: 'processed_reel_assets_realistic/photo_12.jpg', startSec: 2.46,  endSec: 2.71,  durationSec: 0.25 },
  { slotIndex: 13, type: 'photo', src: 'processed_reel_assets_realistic/photo_13.jpg', startSec: 2.71,  endSec: 2.92,  durationSec: 0.21 },
  { slotIndex: 14, type: 'photo', src: 'processed_reel_assets_realistic/photo_14.jpg', startSec: 2.92,  endSec: 3.12,  durationSec: 0.21 },
  { slotIndex: 15, type: 'photo', src: 'processed_reel_assets_realistic/photo_15.jpg', startSec: 3.12,  endSec: 3.46,  durationSec: 0.33 },
  // 6 Limited, Gorgeous, Ultra-Smooth Long Video Clips (Zero Shake, Zero Choppiness)
  { slotIndex: 16, type: 'video', src: 'processed_reel_assets_realistic/smooth_clip_01.mp4', startSec: 3.46,  endSec: 5.88,  durationSec: 2.42 },
  { slotIndex: 17, type: 'video', src: 'processed_reel_assets_realistic/smooth_clip_02.mp4', startSec: 5.88,  endSec: 8.21,  durationSec: 2.33 },
  { slotIndex: 18, type: 'video', src: 'processed_reel_assets_realistic/smooth_clip_03.mp4', startSec: 8.21,  endSec: 10.50, durationSec: 2.29 },
  { slotIndex: 19, type: 'video', src: 'processed_reel_assets_realistic/smooth_clip_04.mp4', startSec: 10.50, endSec: 12.46, durationSec: 1.96 },
  { slotIndex: 20, type: 'video', src: 'processed_reel_assets_realistic/smooth_clip_05.mp4', startSec: 12.46, endSec: 14.50, durationSec: 2.04 },
  { slotIndex: 21, type: 'video', src: 'processed_reel_assets_realistic/smooth_clip_06.mp4', startSec: 14.50, endSec: 16.38, durationSec: 1.88 },
];

export const AestheticBeatSyncReelComposition: React.FC<AestheticBeatSyncProps> = ({
  slots = DEFAULT_REEL_SLOTS,
  audioSrc = 'audio/aesthetic_beat_audio.wav',
  applyVintageGrade = true,
}) => {
  const { fps } = useVideoConfig();

  const resolveAsset = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
    const clean = src.startsWith('/') ? src.slice(1) : src;
    try {
      return staticFile(clean);
    } catch {
      return src;
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        overflow: 'hidden',
        filter: applyVintageGrade
          ? 'brightness(1.04) contrast(1.03) saturate(1.10)'
          : undefined,
      }}
    >
      {/* Background Audio Beat Track */}
      {audioSrc && (
        <Audio src={resolveAsset(audioSrc)} volume={1.0} />
      )}

      {/* Render all 30 synchronized beat slots */}
      {slots.map((slot, index) => {
        const fromFrame = Math.round(slot.startSec * fps);
        const durationFrames = Math.max(1, Math.round(slot.durationSec * fps));
        const resolvedSrc = resolveAsset(slot.src);
        const isVideo = (slot.type === 'video' || slot.src.endsWith('.mp4') || slot.src.endsWith('.webm') || slot.src.endsWith('.mov')) &&
          !slot.src.match(/\.(jpg|jpeg|png|webp)$/i);

        return (
          <Sequence
            key={`slot_${slot.slotIndex || index}_${fromFrame}`}
            from={fromFrame}
            durationInFrames={durationFrames}
          >
            <SlotMediaItem
              src={resolvedSrc}
              isVideo={isVideo}
              durationFrames={durationFrames}
            />
          </Sequence>
        );
      })}

      {/* Subtle Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.15)',
          zIndex: 50,
        }}
      />
    </AbsoluteFill>
  );
};

const SlotMediaItem: React.FC<{
  src: string;
  isVideo: boolean;
  durationFrames: number;
}> = ({ src, isVideo, durationFrames }) => {
  const frame = useCurrentFrame();

  // Gentle Ken Burns zoom ONLY on static photos (never on videos) to prevent shaking/pumping
  const scale = (!isVideo && durationFrames > 12)
    ? interpolate(frame, [0, durationFrames], [1.0, 1.03], {
        extrapolateRight: 'clamp',
      })
    : 1.0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: scale !== 1.0 ? `scale(${scale})` : undefined,
        transformOrigin: 'center center',
      }}
    >
      {isVideo ? (
        <Video
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
};
