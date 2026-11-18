import { describe, it, expect } from 'vitest';
import { ExportPresetService, EXPORT_PRESETS } from '../exportService';

describe('ExportPresetService', () => {
  it('should have standard export presets for major social platforms', () => {
    const presets = ExportPresetService.getAllPresets();
    expect(presets.length).toBeGreaterThanOrEqual(5);

    const presetIds = presets.map((p) => p.id);
    expect(presetIds).toContain('instagram_reels_hq');
    expect(presetIds).toContain('tiktok_vertical_fast');
    expect(presetIds).toContain('youtube_shorts_hdr_rec709');
    expect(presetIds).toContain('twitter_square_viral');
    expect(presetIds).toContain('linkedin_portrait');
  });

  it('should retrieve presets by platform', () => {
    const igPresets = ExportPresetService.getPresetsByPlatform('instagram');
    expect(igPresets.length).toBeGreaterThan(0);
    igPresets.forEach((p) => expect(p.platform).toBe('instagram'));
  });

  it('should generate valid FFmpeg arguments for rendering', () => {
    const preset = EXPORT_PRESETS['instagram_reels_hq'];
    const args = ExportPresetService.generateFFmpegArgs(preset);

    expect(args).toContain('-c:v');
    expect(args).toContain('libx264');
    expect(args).toContain('-profile:v');
    expect(args).toContain(preset.h264Profile);
    expect(args).toContain('-b:v');
    expect(args).toContain(`${preset.videoBitrateKbits}k`);
    expect(args).toContain('-c:a');
    expect(args).toContain('aac');
    expect(args).toContain('-movflags');
    expect(args).toContain('+faststart');
  });

  it('should estimate file size accurately based on bitrates and duration', () => {
    const preset = EXPORT_PRESETS['instagram_reels_hq'];
    // 30 seconds at (12000 + 320) = 12320 kbps
    // bits = 12320 * 1000 * 30 = 369,600,000 bits
    // bytes = 46,200,000 bytes
    // MB = 46,200,000 / (1024 * 1024) ~ 44.06 MB
    const estimatedSizeMB = ExportPresetService.estimateFileSizeMB(preset, 30);
    expect(estimatedSizeMB).toBeGreaterThan(40);
    expect(estimatedSizeMB).toBeLessThan(50);
  });

  it('should warn when duration or fps violate preset constraints', () => {
    const preset = EXPORT_PRESETS['instagram_reels_hq']; // max 90s, 30 fps

    const complianceOk = ExportPresetService.validatePlatformCompliance(preset, 60, 30);
    expect(complianceOk.compliant).toBe(true);
    expect(complianceOk.warnings).toHaveLength(0);

    const complianceOvertime = ExportPresetService.validatePlatformCompliance(preset, 120, 30);
    expect(complianceOvertime.compliant).toBe(false);
    expect(complianceOvertime.warnings.some((w) => w.includes('exceeds recommended maximum'))).toBe(true);

    const complianceFpsMismatch = ExportPresetService.validatePlatformCompliance(preset, 30, 60);
    expect(complianceFpsMismatch.compliant).toBe(false);
    expect(complianceFpsMismatch.warnings.some((w) => w.includes('FPS'))).toBe(true);
  });
});
