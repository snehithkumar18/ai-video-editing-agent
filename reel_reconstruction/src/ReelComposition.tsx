import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { BackgroundLayer } from './components/BackgroundLayer';
import { CharacterLayer } from './components/CharacterLayer';
import { KineticSubtitles, WordItem } from './components/KineticSubtitles';

// Import All 19 Scenes
import { Scene01AccountGrowth } from './scenes/Scene01AccountGrowth';
import { Scene02TheSystem } from './scenes/Scene02TheSystem';
import { Scene03EarlyTikTok } from './scenes/Scene03EarlyTikTok';
import { Scene04RealMotion } from './scenes/Scene04RealMotion';
import { Scene05CrowdAudience } from './scenes/Scene05CrowdAudience';
import { Scene06MarketSaturation } from './scenes/Scene06MarketSaturation';
import { Scene07DotTransition } from './scenes/Scene07DotTransition';
import { Scene08AISlopGrid } from './scenes/Scene08AISlopGrid';
import { Scene09System221Files } from './scenes/Scene09System221Files';
import { Scene10HookPatterns } from './scenes/Scene10HookPatterns';
import { Scene11MotionPhysics } from './scenes/Scene11MotionPhysics';
import { Scene12CaptionTimeline } from './scenes/Scene12CaptionTimeline';
import { Scene13AudioProcessing } from './scenes/Scene13AudioProcessing';
import { Scene14ReviewRelease } from './scenes/Scene14ReviewRelease';
import { Scene15SingleLineInput } from './scenes/Scene15SingleLineInput';
import { Scene16WorkflowChecklist } from './scenes/Scene16WorkflowChecklist';
import { Scene17GrowthAnalytics } from './scenes/Scene17GrowthAnalytics';
import { Scene18BrandDeals } from './scenes/Scene18BrandDeals';
import { Scene19CallToAction } from './scenes/Scene19CallToAction';

import audioEventsData from '../analysis/audio_events.json';

const sceneSchedule = [
  { id: 1, start: 0, duration: 144, Component: Scene01AccountGrowth, pose: 'pose_point_up_right' as const },
  { id: 2, start: 144, duration: 108, Component: Scene02TheSystem, pose: 'pose_both_hands_point' as const },
  { id: 3, start: 252, duration: 102, Component: Scene03EarlyTikTok, pose: 'pose_point_up_right' as const },
  { id: 4, start: 354, duration: 81, Component: Scene04RealMotion, pose: 'pose_point_up_right' as const },
  { id: 5, start: 435, duration: 84, Component: Scene05CrowdAudience, pose: 'pose_chin_think' as const },
  { id: 6, start: 519, duration: 150, Component: Scene06MarketSaturation, pose: 'pose_shrug_palms' as const },
  { id: 7, start: 669, duration: 51, Component: Scene07DotTransition, pose: 'pose_both_hands_point' as const },
  { id: 8, start: 720, duration: 72, Component: Scene08AISlopGrid, pose: 'pose_shrug_palms' as const },
  { id: 9, start: 792, duration: 162, Component: Scene09System221Files, pose: 'pose_point_up_right' as const },
  { id: 10, start: 954, duration: 99, Component: Scene10HookPatterns, pose: 'pose_point_up_right' as const },
  { id: 11, start: 1053, duration: 123, Component: Scene11MotionPhysics, pose: 'pose_point_up_right' as const },
  { id: 12, start: 1176, duration: 111, Component: Scene12CaptionTimeline, pose: 'pose_both_hands_point' as const },
  { id: 13, start: 1287, duration: 117, Component: Scene13AudioProcessing, pose: 'pose_point_up_right' as const },
  { id: 14, start: 1404, duration: 126, Component: Scene14ReviewRelease, pose: 'pose_chin_think' as const },
  { id: 15, start: 1530, duration: 105, Component: Scene15SingleLineInput, pose: 'pose_point_up_right' as const },
  { id: 16, start: 1635, duration: 81, Component: Scene16WorkflowChecklist, pose: 'pose_both_hands_point' as const },
  { id: 17, start: 1716, duration: 129, Component: Scene17GrowthAnalytics, pose: 'pose_point_up_right' as const },
  { id: 18, start: 1845, duration: 30, Component: Scene18BrandDeals, pose: 'pose_both_hands_point' as const },
  { id: 19, start: 1875, duration: 99, Component: Scene19CallToAction, pose: 'pose_direct_point' as const },
];

export const ReelComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Find active scene and pose
  const activeScene =
    sceneSchedule.find(
      (s) => frame >= s.start && frame < s.start + s.duration
    ) || sceneSchedule[sceneSchedule.length - 1];

  const words = (audioEventsData.words || []) as WordItem[];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EA', overflow: 'hidden' }}>
      {/* 1. Warm Paper Texture & Dot Matrix Background */}
      <BackgroundLayer />

      {/* 2. Top 65% Motion Graphics Scenes */}
      {sceneSchedule.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.start}
          durationInFrames={scene.duration}
          name={`Scene_${scene.id}`}
        >
          <scene.Component />
        </Sequence>
      ))}

      {/* 3. Middle Kinetic Subtitles (Strictly Zero Background Boxes) */}
      <KineticSubtitles words={words} />

      {/* 4. Bottom 35% Replacement Presenter with User's Photo Identity & Gestures */}
      <CharacterLayer
        currentSceneId={activeScene.id}
        pose={activeScene.pose}
        scale={1.0}
      />

      {/* 5. Master Mastered Audio */}
      <Audio src={staticFile('reel_reconstruction/reference_audio.wav')} />
    </AbsoluteFill>
  );
};

export default ReelComposition;
