import { describe, it, expect } from 'vitest';
import { createProjectSchema, uploadVoiceSchema, uploadAvatarSchema } from '../validators';

describe('Project Validators', () => {
  it('validates a valid project creation payload', () => {
    const validData = {
      title: 'AI Video Masterclass',
      script_raw: 'Welcome to this short video!',
      platform: 'tiktok',
      style_template: 'split_screen',
    };
    const result = createProjectSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const invalidData = {
      title: '',
      platform: 'reels',
      style_template: 'minimal',
    };
    const result = createProjectSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid platform', () => {
    const invalidData = {
      title: 'Valid Title',
      platform: 'invalid_platform',
      style_template: 'minimal',
    };
    const result = createProjectSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates voice upload schema defaults', () => {
    const voiceData = { name: 'Morgan Freeman Clone' };
    const result = uploadVoiceSchema.safeParse(voiceData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.provider).toBe('kokoro');
    }
  });

  it('validates avatar upload schema', () => {
    const avatarData = { name: 'Presenter Cutout', file_type: 'image' };
    const result = uploadAvatarSchema.safeParse(avatarData);
    expect(result.success).toBe(true);
  });
});
