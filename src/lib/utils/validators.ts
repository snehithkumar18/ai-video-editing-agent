import { z } from 'zod';
import { PLATFORMS, STYLE_TEMPLATES } from './constants';

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  script_raw: z.string().optional().nullable(),
  platform: z.enum(PLATFORMS),
  style_template: z.enum(STYLE_TEMPLATES),
  voice_profile_id: z.string().uuid().optional().nullable(),
  avatar_profile_id: z.string().uuid().optional().nullable(),
});

export const uploadVoiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  provider: z.enum(['kokoro', 'openvoice', 'fish_audio', 'elevenlabs']).default('kokoro'),
});

export const uploadAvatarSchema = z.object({
  name: z.string().min(1, "Name is required"),
  file_type: z.enum(['image', 'video']),
});
