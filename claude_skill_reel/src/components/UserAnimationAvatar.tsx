import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UserAnimationAvatarProps {
  totalFrames?: number;
  sourceFps?: number;
  scale?: number;
  bottomOffset?: number;
  loopMode?: 'forward' | 'pingpong';
}

export const UserAnimationAvatar: React.FC<UserAnimationAvatarProps> = ({
  totalFrames = 192,
  sourceFps = 24,
  scale = 1.0,
  bottomOffset = 0,
  loopMode = 'forward',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Convert composition frame to animation frame at source FPS (24 fps)
  const animTime = frame / fps;
  const rawIndex = Math.floor(animTime * sourceFps);

  let frameIndex = 0;
  if (loopMode === 'pingpong') {
    const cycle = (totalFrames - 1) * 2;
    const pos = rawIndex % cycle;
    frameIndex = pos < totalFrames ? pos : cycle - pos;
  } else {
    frameIndex = rawIndex % totalFrames;
  }

  const paddedIndex = frameIndex.toString().padStart(3, '0');
  const imageSrc = staticFile(`claude_skill_reel/user_avatar/frame_${paddedIndex}.png`);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: 'bottom center',
        zIndex: 40,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <Img
        src={imageSrc}
        style={{
          width: 1080,
          height: 'auto',
          display: 'block',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
        }}
      />
    </div>
  );
};

export default UserAnimationAvatar;
