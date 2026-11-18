'use client';

import React from 'react';
import { Player } from '@remotion/player';
import { VideoComposition } from '@/remotion/VideoComposition';
import { SplitScreenMasterComposition } from '@/remotion/templates/SplitScreenMasterComposition';
import { Card } from '@/components/ui/card';
import { TimelineJSON } from '@/lib/types/timeline';

interface ProjectVideoPlayerProps {
  timeline: TimelineJSON;
  fallbackVideoUrl?: string | null;
  thumbnailUrl?: string | null;
  template?: string;
  title?: string;
}

export default function ProjectVideoPlayer({
  timeline,
  fallbackVideoUrl,
  thumbnailUrl,
  template = 'split_screen',
  title = 'AI Video',
}: ProjectVideoPlayerProps) {
  if (timeline && timeline.tracks && timeline.tracks.length > 0) {
    const fps = timeline.fps || 30;
    const durationInFrames = Math.max(1, Math.round((timeline.duration || 30) * fps));

    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border-[#E5E3EB] rounded-3xl overflow-hidden shadow-sm flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#F8F7FC] to-white">
        <div className="w-full max-w-[380px] aspect-[9/16] bg-[#07090E] rounded-2xl overflow-hidden shadow-2xl relative border border-[#E5E3EB]">
          <Player
            acknowledgeRemotionLicense
            component={SplitScreenMasterComposition}
            inputProps={{
              timeline,
              topicTitle: title,
            }}
            durationInFrames={durationInFrames}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={fps}
            controls
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </Card>
    );
  }

  // Fallback if timeline is not ready
  if (fallbackVideoUrl) {
    return (
      <Card className="bg-white border-[#E5E3EB] rounded-3xl overflow-hidden shadow-sm">
        <div className="aspect-video bg-black relative flex items-center justify-center">
          <video
            src={fallbackVideoUrl}
            controls
            className="w-full h-full max-h-[60vh] object-contain"
            poster={thumbnailUrl || undefined}
          />
        </div>
      </Card>
    );
  }

  return null;
}
