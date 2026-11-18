import { describe, it, expect } from 'vitest';
import {
  TemplateRegistryService,
  REGISTERED_TEMPLATES,
  AestheticBeatSyncProps,
} from '../templateRegistryService';

describe('TemplateRegistryService', () => {
  it('should list all registered templates with essential metadata', () => {
    const templates = TemplateRegistryService.getAllTemplates();
    expect(templates.length).toBeGreaterThanOrEqual(4);

    const ids = templates.map((t) => t.id);
    expect(ids).toContain('AestheticBeatSyncReel');
    expect(ids).toContain('AestheticBeatSyncReelUltraRealistic');
    expect(ids).toContain('SplitScreenMaster');
    expect(ids).toContain('ClaudeSkillReel');
  });

  it('should filter templates by category and search tags', () => {
    const beatSyncTemplates = TemplateRegistryService.getTemplatesByCategory('beat_sync');
    expect(beatSyncTemplates.length).toBeGreaterThanOrEqual(2);
    beatSyncTemplates.forEach((t) => expect(t.category).toBe('beat_sync'));

    const searchResults = TemplateRegistryService.searchTemplates('ultra_realistic');
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].id).toBe('AestheticBeatSyncReelUltraRealistic');
  });

  it('should retrieve a specific template by ID', () => {
    const template = TemplateRegistryService.getTemplateById('ClaudeSkillReel');
    expect(template).toBeDefined();
    expect(template?.name).toContain('Developer Code & Terminal Walkthrough');
    expect(template?.aspectRatio).toBe('9:16');
  });

  it('should validate composition props against schema requirements', () => {
    const validProps: AestheticBeatSyncProps = {
      imagePaths: ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg'],
      videoClips: [
        {
          src: '/vid/1.mp4',
          durationInFrames: 60,
          label: 'Clip 1',
        },
      ],
      audioTrackUrl: '/audio/music.mp3',
      colorGradePreset: 'ultra_realistic',
    };

    const validation = TemplateRegistryService.validateProps('AestheticBeatSyncReel', validProps);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);

    const invalidProps: AestheticBeatSyncProps = {
      imagePaths: [],
      videoClips: [],
      audioTrackUrl: '',
    };

    const failedValidation = TemplateRegistryService.validateProps('AestheticBeatSyncReel', invalidProps);
    expect(failedValidation.isValid).toBe(false);
    expect(failedValidation.errors.length).toBeGreaterThan(0);
  });
});
