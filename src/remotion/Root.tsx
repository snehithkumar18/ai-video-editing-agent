import React from 'react';
import { Composition, staticFile } from 'remotion';
import { ZoomReelComposition } from './templates/ZoomReelComposition';
import { SplitScreenReelComposition } from './templates/SplitScreenReelComposition';
import { WhiteMinimalReelComposition } from './templates/WhiteMinimalReelComposition';
import { ReelComposition } from '../../reel_reconstruction/src/ReelComposition';
import { ClaudeSkillReelComposition } from '../../claude_skill_reel/src/ClaudeSkillReelComposition';
import timestampsData from '../../public/timestamps_female.json';

export const RemotionRoot: React.FC = () => {
  // Voiceover audio duration is ~47.57s => 1428 frames at 30 fps
  const fps = 30;
  const durationInFrames = 1428;

  return (
    <>
      {/* 1. Zoom Meeting Style Reel (Character in Floating Video Call Window) */}
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

      {/* 2. Split-Screen Viral Reel (Top 65% Motion Graphics/UI + Bottom 35% Real Person Cutout) */}
      <Composition
        id="SplitScreenReel"
        component={SplitScreenReelComposition}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          presenterCutoutSrc: staticFile('uploaded_character_cutout.png'),
          audioSrc: staticFile('speech_female.wav'),
          timestamps: timestampsData,
          presenterName: 'AI Creator',
          topicTag: 'AI AUTOMATION MASTERCLASS',
          brollSrc: staticFile('broll/broll_2_ai.mp4'),
        }}
      />

      {/* 3. White Minimalist Viral Reel (Clean Studio White Background + Reserved Speaker Area) */}
      <Composition
        id="WhiteMinimalReel"
        component={WhiteMinimalReelComposition}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioSrc: staticFile('speech_female.wav'),
          timestamps: timestampsData,
          topicTag: 'AI VIRAL ENGINE 2026',
        }}
      />

      {/* 4. Complete Reconstruction of Reference Instagram Reel */}
      <Composition
        id="ReelReconstruction"
        component={ReelComposition}
        durationInFrames={1974}
        fps={30}
        width={720}
        height={1280}
      />

      {/* 5. 49.53-Second Motion Graphics Reel: One Claude Skill */}
      <Composition
        id="ClaudeSkillReel"
        component={ClaudeSkillReelComposition}
        durationInFrames={1486}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
