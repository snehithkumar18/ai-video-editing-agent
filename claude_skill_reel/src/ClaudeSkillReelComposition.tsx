import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, Video } from 'remotion';
import { BackgroundLayer } from './components/BackgroundLayer';
import { KineticCaptions, WordItem } from './components/KineticCaptions';
import { UserAnimationAvatar } from './components/UserAnimationAvatar';

// 12 Scene Components
import { Scene01Hook } from './scenes/Scene01Hook';
import { Scene02IntroduceSkill } from './scenes/Scene02IntroduceSkill';
import { Scene03Workflow } from './scenes/Scene03Workflow';
import { Scene04VisualPossibilities } from './scenes/Scene04VisualPossibilities';
import { Scene05Variety } from './scenes/Scene05Variety';
import { Scene06StoryPurpose } from './scenes/Scene06StoryPurpose';
import { Scene07EditingProcess } from './scenes/Scene07EditingProcess';
import { Scene08Automation } from './scenes/Scene08Automation';
import { Scene09Results } from './scenes/Scene09Results';
import { Scene10Applications } from './scenes/Scene10Applications';
import { Scene11Reusability } from './scenes/Scene11Reusability';
import { Scene12CallToAction } from './scenes/Scene12CallToAction';

import timestampsData from '../assets/audio/voiceover_timestamps.json';

const scenes = [
  { id: 1, start: 0, duration: 125, Component: Scene01Hook },
  { id: 2, start: 125, duration: 175, Component: Scene02IntroduceSkill },
  { id: 3, start: 300, duration: 145, Component: Scene03Workflow },
  { id: 4, start: 445, duration: 135, Component: Scene04VisualPossibilities },
  { id: 5, start: 580, duration: 90, Component: Scene05Variety },
  { id: 6, start: 670, duration: 140, Component: Scene06StoryPurpose },
  { id: 7, start: 810, duration: 90, Component: Scene07EditingProcess },
  { id: 8, start: 900, duration: 110, Component: Scene08Automation },
  { id: 9, start: 1010, duration: 80, Component: Scene09Results },
  { id: 10, start: 1090, duration: 115, Component: Scene10Applications },
  { id: 11, start: 1205, duration: 70, Component: Scene11Reusability },
  { id: 12, start: 1275, duration: 211, Component: Scene12CallToAction },
];

export interface CreatorKitProps {
  primaryColor?: string;
  secondaryColor?: string;
  captionHighlightColor?: string;
  musicGenre?: string;
  enableSFX?: boolean;
}

export interface ClaudeSkillReelProps {
  presenterVideoUrl?: string;
  voiceoverAudioUrl?: string;
  customCaptions?: WordItem[];
  creatorKit?: CreatorKitProps;
}

export const ClaudeSkillReelComposition: React.FC<ClaudeSkillReelProps> = ({
  presenterVideoUrl,
  voiceoverAudioUrl,
  customCaptions,
  creatorKit = {},
}) => {
  const frame = useCurrentFrame();

  const words = (customCaptions || timestampsData.words || []) as WordItem[];
  const audioSrc = voiceoverAudioUrl || staticFile('claude_skill_reel/voiceover_49s.wav');
  const primaryColor = creatorKit.primaryColor || '#F95738';
  const captionColor = creatorKit.captionHighlightColor || '#F95738';
  const enableSFX = creatorKit.enableSFX ?? true;

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EA', overflow: 'hidden' }}>
      {/* 1. Warm Cream Background & Dot Texture */}
      <BackgroundLayer />

      {/* 2. Top/Middle Motion Graphic Scenes (Z-Index: 10-30) */}
      {scenes.map((sc) => (
        <Sequence
          key={sc.id}
          from={sc.start}
          durationInFrames={sc.duration}
          name={`Scene_${sc.id}`}
        >
          <sc.Component />
        </Sequence>
      ))}

      {/* 3. Transition Sound Effects (Whoosh on scene changes) */}
      {enableSFX && scenes.slice(1).map((sc) => (
        <Sequence key={`sfx_${sc.id}`} from={Math.max(0, sc.start - 4)} durationInFrames={18}>
          <Audio src={staticFile('audio/sfx/whoosh.wav')} volume={0.18} />
        </Sequence>
      ))}

      {/* 4. Middle Kinetic Captions: Centered vertically in the middle of the frame */}
      <KineticCaptions words={words} activeColor={captionColor} positionMode="middle" />

      {/* 5. Presenter Character: Anchored at bottom, safely beneath kinetic captions */}
      {presenterVideoUrl ? (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center',
            zIndex: 40,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            width: 1080,
            height: 650,
            overflow: 'hidden',
          }}
        >
          <Video
            src={presenterVideoUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center bottom',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
            }}
          />
        </div>
      ) : (
        <UserAnimationAvatar
          totalFrames={192}
          sourceFps={24}
          scale={0.96}
          bottomOffset={0}
          loopMode="forward"
        />
      )}

      {/* 6. Background Viral Lo-Fi Music (Normalized at -22dB with gentle bed) */}
      <Audio src={staticFile('audio/music/chill_lofi.wav')} volume={0.12} loop />

      {/* 7. Master Voiceover Audio */}
      <Audio src={audioSrc} volume={1.0} />
    </AbsoluteFill>
  );
};

export default ClaudeSkillReelComposition;
