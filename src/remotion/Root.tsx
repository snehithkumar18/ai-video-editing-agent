import React from 'react';
import { Composition, staticFile } from 'remotion';
import { ZoomReelComposition } from './templates/ZoomReelComposition';
import timestampsData from '../../public/timestamps_female.json';

export const RemotionRoot: React.FC = () => {
  // Voiceover audio duration is ~47.57s => 1428 frames at 30 fps
  const fps = 30;
  const durationInFrames = 1428;

  return (
    <>
      <Composition
        id="ZoomReel"
        component={ZoomReelComposition}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          presenterSrc: staticFile('presenter.jpg'),
          audioSrc: staticFile('speech_female.wav'),
          timestamps: timestampsData,
          presenterName: 'Sarah K. (Host)',
        }}
      />
    </>
  );
};
