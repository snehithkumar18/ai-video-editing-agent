import { AbsoluteFill, Sequence, Video, Audio, Img } from 'remotion';
import { TimelineJSON } from '@/lib/types/timeline';
import CaptionRenderer from './CaptionRenderer';
import TalkingAvatar from './TalkingAvatar';

export const VideoComposition: React.FC<{ timeline: TimelineJSON }> = ({ timeline }) => {
  const fps = timeline.fps || 30;

  const brollTrack = timeline.tracks.find(t => t.id === 'broll-track');
  const avatarTrack = timeline.tracks.find(t => t.id === 'avatar-track');
  const audioTrack = timeline.tracks.find(t => t.id === 'audio-track');
  const captionTrack = timeline.tracks.find(t => t.id === 'caption-track');
  const musicTrack = timeline.tracks.find(t => t.id === 'music-track');

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 1. B-Roll Track (Background) */}
      {brollTrack?.visible && brollTrack.clips.map(clip => {
        const from = Math.round(clip.start * fps);
        const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
        return (
          <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
            {clip.assetUrl?.match(/\.(png|jpg|jpeg|webp)/i) ? (
              <Img 
                src={clip.assetUrl} 
                style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: clip.opacity ?? 1 }} 
              />
            ) : (
              <Video 
                src={clip.assetUrl} 
                style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: clip.opacity ?? 1 }} 
              />
            )}
          </Sequence>
        );
      })}

      {/* 2. Avatar Track */}
      {avatarTrack?.visible && avatarTrack.clips.map(clip => {
        const from = Math.round(clip.start * fps);
        const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
        return (
          <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
            {clip.assetUrl?.match(/\.(png|jpg|jpeg|webp)/i) ? (
              <TalkingAvatar 
                src={clip.assetUrl}
                captions={captionTrack?.clips || []}
                fps={fps}
                style={{ opacity: clip.opacity ?? 1 }} 
              />
            ) : (
              <Video 
                src={clip.assetUrl} 
                style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: clip.opacity ?? 1 }} 
              />
            )}
          </Sequence>
        );
      })}

      {/* 3. Audio Track */}
      {audioTrack?.visible && audioTrack.clips.map(clip => {
        const from = Math.round(clip.start * fps);
        const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
        return (
          <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
            <Audio src={clip.assetUrl} volume={clip.volume ?? 1} />
          </Sequence>
        );
      })}

      {/* 4. Background Music Track */}
      {musicTrack?.visible && musicTrack.clips.map(clip => {
        if (!clip.assetUrl) return null;
        const from = Math.round(clip.start * fps);
        const durationInFrames = Math.max(1, Math.round(clip.duration * fps));
        return (
          <Sequence key={clip.id} from={from} durationInFrames={durationInFrames}>
            <Audio src={clip.assetUrl} volume={clip.volume ?? 0.2} />
          </Sequence>
        );
      })}

      {/* 5. Caption Track */}
      {captionTrack?.visible && captionTrack.clips.length > 0 && (
        <CaptionRenderer captions={captionTrack.clips} fps={fps} />
      )}
    </AbsoluteFill>
  );
};
