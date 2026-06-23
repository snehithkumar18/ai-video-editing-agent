import { describe, it, expect } from 'vitest';
import { generateKey } from '../storageService';

describe('generateKey', () => {
  it('should generate a key containing folder, userId, and filename', () => {
    const folder = 'avatars';
    const userId = 'user-123';
    const filename = 'profile.png';

    const key = generateKey(folder, userId, filename);

    expect(key).toContain(folder);
    expect(key).toContain(userId);
    expect(key).toContain('profile.png');
  });

  it('should sanitize filename special characters', () => {
    const folder = 'voices';
    const userId = 'user-456';
    const filename = 'my voice#1!@$.wav';

    const key = generateKey(folder, userId, filename);

    // Special characters should be replaced with underscores
    expect(key).toContain('my_voice_1___.wav');
    expect(key).not.toContain('#');
    expect(key).not.toContain('!');
    expect(key).not.toContain('@');
    expect(key).not.toContain('$');
  });

  it('should preserve dots and dashes in filename', () => {
    const folder = 'videos';
    const userId = 'user-789';
    const filename = 'final-render.v1.mp4';

    const key = generateKey(folder, userId, filename);

    expect(key).toContain('final-render.v1.mp4');
  });
});
