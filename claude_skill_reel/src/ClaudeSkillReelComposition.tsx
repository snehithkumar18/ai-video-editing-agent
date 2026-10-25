import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { BackgroundLayer } from './components/BackgroundLayer';
import { KineticCaptions, WordItem } from './components/KineticCaptions';
import { PresenterAvatar } from './components/PresenterAvatar';

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
  { id: 1, start: 0, duration: 120, Component: Scene01Hook, showPresenter: true },
  { id: 2, start: 120, duration: 120, Component: Scene02IntroduceSkill, showPresenter: false },
  { id: 3, start: 240, duration: 120, Component: Scene03Workflow, showPresenter: false },
  { id: 4, start: 360, duration: 120, Component: Scene04VisualPossibilities, showPresenter: false },
  { id: 5, start: 480, duration: 120, Component: Scene05Variety, showPresenter: false },
  { id: 6, start: 600, duration: 120, Component: Scene06StoryPurpose, showPresenter: false },
  { id: 7, start: 720, duration: 120, Component: Scene07EditingProcess, showPresenter: false },
  { id: 8, start: 840, duration: 120, Component: Scene08Automation, showPresenter: false },
  { id: 9, start: 960, duration: 120, Component: Scene09Results, showPresenter: false },
  { id: 10, start: 1080, duration: 120, Component: Scene10Applications, showPresenter: false },
  { id: 11, start: 1200, duration: 120, Component: Scene11Reusability, showPresenter: false }, // Handled internally
  { id: 12, start: 1320, duration: 166, Component: Scene12CallToAction, showPresenter: false }, // Handled internally
];

export const ClaudeSkillReelComposition: React.FC = () => {
  const frame = useCurrentFrame();

  const words = (timestampsData.words || []) as WordItem[];
  const activeScene = scenes.find((s) => frame >= s.start && frame < s.start + s.duration) || scenes[scenes.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EA', overflow: 'hidden' }}>
      {/* 1. Warm Cream Background & Dot Texture */}
      <BackgroundLayer />

      {/* 2. Top/Middle Motion Graphic Scenes */}
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

      {/* 3. Middle Kinetic Captions (Strictly Zero Background Box) */}
      <KineticCaptions words={words} activeColor="#F95738" />

      {/* 4. Presenter in Scene 1 */}
      {activeScene.id === 1 && (
        <PresenterAvatar pose="pose_point_up_right" scale={0.92} bottomOffset={0} />
      )}

      {/* 5. Master Voiceover Audio */}
      <Audio src={staticFile('claude_skill_reel/voiceover_49s.wav')} />
    </AbsoluteFill>
  );
};

export default ClaudeSkillReelComposition;
