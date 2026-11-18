import React from 'react';
import { AbsoluteFill, Sequence, Video, Audio, Img, Loop } from 'remotion';
import { TimelineJSON } from '@/lib/types/timeline';
import CaptionRenderer from './CaptionRenderer';
import TalkingAvatar from './TalkingAvatar';
import { SplitScreenMasterComposition } from './templates/SplitScreenMasterComposition';

export const VideoComposition: React.FC<{ timeline: TimelineJSON }> = ({ timeline }) => {
  const fps = timeline.fps || 30;

  const brollTrack = timeline.tracks.find(t => t.id === 'broll-track');
  const avatarTrack = timeline.tracks.find(t => t.id === 'avatar-track');
  const audioTrack = timeline.tracks.find(t => t.id === 'audio-track');
  const captionTrack = timeline.tracks.find(t => t.id === 'caption-track');
  const musicTrack = timeline.tracks.find(t => t.id === 'music-track');

  const isVertical = (timeline.height || 1920) > (timeline.width || 1080);
  const isSplitScreen = isVertical && Boolean(avatarTrack?.clips?.length);

  if (isSplitScreen) {
    return <SplitScreenMasterComposition timeline={timeline} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#07090E', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ======================================================================= */}
      {/* 1. VISUAL LAYERS (SPLIT-SCREEN OR FULL-SCREEN)                          */}
      {/* ======================================================================= */}
      {isSplitScreen ? (
        <>
          {/* --- TOP 50%: B-Roll & Visuals Stage (0% - 50%) --- */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              overflow: 'hidden',
              backgroundColor: '#0D0E1A',
            }}
          >
            {/* Ambient background grid / subtle glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(circle at 50% 30%, rgba(124, 58, 237, 0.15) 0%, rgba(7, 9, 14, 0.95) 80%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 32px 32px, 32px 32px',
                zIndex: 1,
              }}
            />

            {/* B-Roll Footage clips */}
            {brollTrack?.visible && brollTrack.clips.map(clip => {
              if (!clip.assetUrl) return null;
              const from = Math.round(clip.start * fps);
              const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
              const isImage = clip.assetUrl.match(/\.(png|jpg|jpeg|webp)/i);

              return (
                <Sequence key={clip.id} from={from} durationInFrames={durationInFrames} style={{ zIndex: 2 }}>
                  {isImage ? (
                    <Img
                      src={clip.assetUrl}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        opacity: clip.opacity ?? 1,
                      }}
                    />
                  ) : (
                    <Video
                      src={clip.assetUrl}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        opacity: clip.opacity ?? 1,
                      }}
                      volume={0}
                    />
                  )}
                </Sequence>
              );
            })}

            {/* Top pill badge */}
            <div
              style={{
                position: 'absolute',
                top: 32,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                backgroundColor: 'rgba(15, 15, 26, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 9999,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#7C3AED' }} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                AI Video Automation
              </span>
            </div>
          </div>

          {/* --- CENTER SEAM DIVIDER --- */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.9) 50%, transparent 100%)',
              boxShadow: '0 0 12px rgba(124, 58, 237, 0.8)',
              zIndex: 15,
            }}
          />

          {/* --- BOTTOM 50%: Avatar Presenter (Spider-Man Full BG) --- */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '50%',
              overflow: 'hidden',
              backgroundColor: '#05060A',
            }}
          >
            {avatarTrack?.visible && avatarTrack.clips.map(clip => {
              if (!clip.assetUrl) return null;
              const from = Math.round(clip.start * fps);
              const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
              const isImage = clip.assetUrl.match(/\.(png|jpg|jpeg|webp)/i);

              return (
                <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
                  {isImage ? (
                    <TalkingAvatar
                      src={clip.assetUrl}
                      captions={captionTrack?.clips || []}
                      fps={fps}
                      mouthYPercent={clip.mouthYPercent ?? 46.2}
                      mouthXPercent={clip.mouthXPercent ?? 50.0}
                      motionIntensity={clip.motionIntensity ?? 1.0}
                      style={{ opacity: clip.opacity ?? 1 }}
                    />
                  ) : (
                    // Loop video seamlessly if voiceover duration exceeds video length
                    <Loop durationInFrames={240}>
                      <Video
                        src={clip.assetUrl}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          opacity: clip.opacity ?? 1,
                        }}
                        volume={0}
                      />
                    </Loop>
                  )}
                </Sequence>
              );
            })}
          </div>
        </>
      ) : (
        /* Standard Full-Screen Layout */
        <>
          {/* Avatar Base */}
          {avatarTrack?.visible && avatarTrack.clips.map(clip => {
            if (!clip.assetUrl) return null;
            const from = Math.round(clip.start * fps);
            const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
            return (
              <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
                <Video
                  src={clip.assetUrl}
                  style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: clip.opacity ?? 1 }}
                />
              </Sequence>
            );
          })}

          {/* B-Roll Overlay */}
          {brollTrack?.visible && brollTrack.clips.map(clip => {
            if (!clip.assetUrl) return null;
            const from = Math.round(clip.start * fps);
            const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
            return (
              <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
                <Video
                  src={clip.assetUrl}
                  style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: clip.opacity ?? 1 }}
                />
              </Sequence>
            );
          })}
        </>
      )}

      {/* ======================================================================= */}
      {/* 2. AUDIO TRACKS                                                         */}
      {/* ======================================================================= */}
      {/* Voiceover Speech Track */}
      {audioTrack?.visible && audioTrack.clips.map(clip => {
        if (!clip.assetUrl) return null;
        const from = Math.round(clip.start * fps);
        const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
        return (
          <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
            <Audio src={clip.assetUrl} volume={clip.volume ?? 1} />
          </Sequence>
        );
      })}

      {/* Background Music Track */}
      {musicTrack?.visible && musicTrack.clips.map(clip => {
        if (!clip.assetUrl) return null;
        const from = Math.round(clip.start * fps);
        const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
        return (
          <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
            <Audio src={clip.assetUrl} volume={clip.volume ?? 0.15} />
          </Sequence>
        );
      })}

      {/* ======================================================================= */}
      {/* 3. CAPTIONS OVERLAY (Positioned near center seam for high retention)   */}
      {/* ======================================================================= */}
      {captionTrack?.visible && captionTrack.clips.length > 0 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none' }}>
          <CaptionRenderer captions={captionTrack.clips} fps={fps} />
        </div>
      )}
    </AbsoluteFill>
  );
};
