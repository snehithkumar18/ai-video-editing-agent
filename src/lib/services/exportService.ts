/**
 * Social Media Video Export & Encoding Preset Service
 * Provides platform-specific encoding parameters, bitrates, audio loudness specs,
 * and container configurations for vertical, square, and horizontal short-form video.
 */

export interface ExportPreset {
  id: string;
  name: string;
  platform: 'instagram' | 'tiktok' | 'youtube_shorts' | 'twitter' | 'linkedin';
  aspectRatio: '9:16' | '1:1' | '16:9' | '4:5';
  width: number;
  height: number;
  fps: number;
  videoBitrateKbits: number;
  maxBitrateKbits: number;
  audioBitrateKbits: number;
  audioSampleRate: number;
  audioLoudnessTargetLUFS: number; // Target integrated loudness
  h264Profile: 'baseline' | 'main' | 'high';
  h264Level: string;
  pixelFormat: 'yuv420p';
  keyframeIntervalSeconds: number;
  recommendedMaxDurationSeconds: number;
  description: string;
}

export const EXPORT_PRESETS: Record<string, ExportPreset> = {
  instagram_reels_hq: {
    id: 'instagram_reels_hq',
    name: 'Instagram Reels (High Quality 1080p)',
    platform: 'instagram',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    videoBitrateKbits: 12000,
    maxBitrateKbits: 16000,
    audioBitrateKbits: 320,
    audioSampleRate: 48000,
    audioLoudnessTargetLUFS: -14.0,
    h264Profile: 'high',
    h264Level: '4.2',
    pixelFormat: 'yuv420p',
    keyframeIntervalSeconds: 1,
    recommendedMaxDurationSeconds: 90,
    description: 'Optimized for Instagram mobile feed compression with maximum color fidelity and clean edge contrast.',
  },
  instagram_reels_cinematic_24: {
    id: 'instagram_reels_cinematic_24',
    name: 'Instagram Reels (Cinematic 24 FPS)',
    platform: 'instagram',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 24,
    videoBitrateKbits: 14000,
    maxBitrateKbits: 20000,
    audioBitrateKbits: 320,
    audioSampleRate: 48000,
    audioLoudnessTargetLUFS: -14.0,
    h264Profile: 'high',
    h264Level: '4.2',
    pixelFormat: 'yuv420p',
    keyframeIntervalSeconds: 1,
    recommendedMaxDurationSeconds: 60,
    description: 'Filmic 24 FPS cadence with all-intra I-frame decoding for buttery transitions and luxury aesthetic reels.',
  },
  tiktok_vertical_fast: {
    id: 'tiktok_vertical_fast',
    name: 'TikTok Vertical (Fast Buffer Stream)',
    platform: 'tiktok',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    videoBitrateKbits: 9000,
    maxBitrateKbits: 12000,
    audioBitrateKbits: 256,
    audioSampleRate: 44100,
    audioLoudnessTargetLUFS: -16.0,
    h264Profile: 'high',
    h264Level: '4.1',
    pixelFormat: 'yuv420p',
    keyframeIntervalSeconds: 2,
    recommendedMaxDurationSeconds: 180,
    description: 'High-speed buffer rate optimized for TikTok FYP immediate instant-playback start without loading spinner.',
  },
  youtube_shorts_hdr_rec709: {
    id: 'youtube_shorts_hdr_rec709',
    name: 'YouTube Shorts (Rec.709 Master)',
    platform: 'youtube_shorts',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    videoBitrateKbits: 18000,
    maxBitrateKbits: 24000,
    audioBitrateKbits: 384,
    audioSampleRate: 48000,
    audioLoudnessTargetLUFS: -14.0,
    h264Profile: 'high',
    h264Level: '4.2',
    pixelFormat: 'yuv420p',
    keyframeIntervalSeconds: 1,
    recommendedMaxDurationSeconds: 60,
    description: 'Master bitrate profile allowing YouTube transcoding engine to produce highest VP9 and AV1 qualities.',
  },
  twitter_square_viral: {
    id: 'twitter_square_viral',
    name: 'X / Twitter (Square 1080x1080)',
    platform: 'twitter',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    fps: 30,
    videoBitrateKbits: 6000,
    maxBitrateKbits: 8000,
    audioBitrateKbits: 192,
    audioSampleRate: 44100,
    audioLoudnessTargetLUFS: -15.0,
    h264Profile: 'high',
    h264Level: '4.0',
    pixelFormat: 'yuv420p',
    keyframeIntervalSeconds: 2,
    recommendedMaxDurationSeconds: 140,
    description: 'Compact 1:1 feed ratio offering maximal vertical screen real-estate in desktop and mobile timelines.',
  },
  linkedin_portrait: {
    id: 'linkedin_portrait',
    name: 'LinkedIn Video (4:5 Portrait)',
    platform: 'linkedin',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    fps: 30,
    videoBitrateKbits: 7500,
    maxBitrateKbits: 10000,
    audioBitrateKbits: 256,
    audioSampleRate: 48000,
    audioLoudnessTargetLUFS: -14.0,
    h264Profile: 'high',
    h264Level: '4.1',
    pixelFormat: 'yuv420p',
    keyframeIntervalSeconds: 2,
    recommendedMaxDurationSeconds: 120,
    description: 'Professional 4:5 aspect ratio optimized for LinkedIn mobile feed retention without letterboxing.',
  },
};

export class ExportPresetService {
  /**
   * Retrieves all available export presets
   */
  static getAllPresets(): ExportPreset[] {
    return Object.values(EXPORT_PRESETS);
  }

  /**
   * Retrieves a preset by unique ID
   */
  static getPreset(presetId: string): ExportPreset {
    const preset = EXPORT_PRESETS[presetId];
    if (!preset) {
      return EXPORT_PRESETS.instagram_reels_hq;
    }
    return preset;
  }

  /**
   * Retrieves all presets available for a target social platform
   */
  static getPresetsForPlatform(platform: ExportPreset['platform']): ExportPreset[] {
    return Object.values(EXPORT_PRESETS).filter((p) => p.platform === platform);
  }

  /**
   * Alias for getPresetsForPlatform
   */
  static getPresetsByPlatform(platform: ExportPreset['platform']): ExportPreset[] {
    return this.getPresetsForPlatform(platform);
  }

  /**
   * Computes FFmpeg command arguments for Remotion or CLI rendering
   */
  static generateFFmpegArgs(preset: ExportPreset): string[] {
    return [
      '-c:v', 'libx264',
      '-profile:v', preset.h264Profile,
      '-level:v', preset.h264Level,
      '-pix_fmt', preset.pixelFormat,
      '-b:v', `${preset.videoBitrateKbits}k`,
      '-maxrate', `${preset.maxBitrateKbits}k`,
      '-bufsize', `${preset.maxBitrateKbits * 2}k`,
      '-r', `${preset.fps}`,
      '-g', `${preset.fps * preset.keyframeIntervalSeconds}`,
      '-c:a', 'aac',
      '-b:a', `${preset.audioBitrateKbits}k`,
      '-ar', `${preset.audioSampleRate}`,
      '-af', `loudnorm=I=${preset.audioLoudnessTargetLUFS}:TP=-1.5:LRA=11`,
      '-movflags', '+faststart',
    ];
  }

  /**
   * Calculates estimated file size in Megabytes based on duration and bitrate
   */
  static estimateFileSizeMB(preset: ExportPreset, durationSeconds: number): number {
    const totalBitrateKbits = preset.videoBitrateKbits + preset.audioBitrateKbits;
    const totalBits = totalBitrateKbits * 1000 * durationSeconds;
    const totalBytes = totalBits / 8;
    return Number((totalBytes / (1024 * 1024)).toFixed(2));
  }

  /**
   * Validates if a custom composition matches the recommended platform constraints
   */
  static validatePlatformCompliance(
    preset: ExportPreset,
    actualDurationSec: number,
    actualFps: number
  ): { compliant: boolean; warnings: string[] } {
    const warnings: string[] = [];

    if (actualDurationSec > preset.recommendedMaxDurationSeconds) {
      warnings.push(
        `Duration (${actualDurationSec.toFixed(1)}s) exceeds recommended maximum of ${preset.recommendedMaxDurationSeconds}s for ${preset.name}.`
      );
    }

    if (Math.abs(actualFps - preset.fps) > 0.5) {
      warnings.push(
        `Composition FPS (${actualFps}) does not match target preset FPS (${preset.fps}). Frame drops or interpolation may occur.`
      );
    }

    return {
      compliant: warnings.length === 0,
      warnings,
    };
  }
}
