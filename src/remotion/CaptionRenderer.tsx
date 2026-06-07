import { useCurrentFrame, AbsoluteFill, spring, useVideoConfig } from 'remotion';
import { Clip } from '@/lib/types/timeline';

export default function CaptionRenderer({ captions, fps }: { captions: Clip[]; fps: number }) {
  const frame = useCurrentFrame();
  const { fps: videoFps } = useVideoConfig(); // use remotion config fps
  const currentTimeSec = frame / videoFps;

  const activeCaption = captions.find(c => currentTimeSec >= c.start && currentTimeSec <= c.end);

  if (!activeCaption) return null;

  const style = activeCaption.style || {};
  const isBackground = style.backgroundColor && style.backgroundColor !== 'transparent';
  
  // Basic animation parsing
  let transform = 'none';
  const animation = style.animation || 'none';
  
  if (animation === 'Bounce' || animation === 'Pop') {
    const startFrame = activeCaption.start * videoFps;
    const scale = spring({
      frame: frame - startFrame,
      fps: videoFps,
      config: { damping: 12, stiffness: 200 }
    });
    transform = `scale(${scale})`;
  } else if (animation === 'Fade In') {
    const startFrame = activeCaption.start * videoFps;
    const opacity = Math.min(1, (frame - startFrame) / 10); // 10 frame fade in
    return (
      <AbsoluteFill style={{ justifyContent: style.position === 'top' ? 'flex-start' : (style.position === 'center' ? 'center' : 'flex-end'), padding: '10%' }}>
        <div style={{ textAlign: 'center', opacity }}>
          <span style={{
            fontSize: style.fontSize || 48,
            fontWeight: style.fontWeight || 'bold',
            color: style.color || 'white',
            backgroundColor: isBackground ? style.backgroundColor : 'transparent',
            padding: isBackground ? '10px 20px' : '0',
            borderRadius: style.borderRadius || 8,
            display: 'inline-block',
            lineHeight: 1.2
          }}>
            {activeCaption.word}
          </span>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ 
      justifyContent: style.position === 'top' ? 'flex-start' : (style.position === 'center' ? 'center' : 'flex-end'), 
      padding: '10%' 
    }}>
      <div style={{ textAlign: 'center', transform }}>
        <span style={{
          fontSize: style.fontSize || 48,
          fontWeight: style.fontWeight || 'bold',
          color: style.color || 'white',
          backgroundColor: isBackground ? style.backgroundColor : 'transparent',
          padding: isBackground ? '10px 20px' : '0',
          borderRadius: style.borderRadius || 8,
          display: 'inline-block',
          lineHeight: 1.2
        }}>
          {activeCaption.word}
        </span>
      </div>
    </AbsoluteFill>
  );
}
