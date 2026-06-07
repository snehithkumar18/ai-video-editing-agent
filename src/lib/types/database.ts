export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  render_credits: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface VoiceProfile {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  provider: 'kokoro' | 'openvoice' | 'fish_audio' | 'elevenlabs';
  provider_voice_id: string | null;
  sample_url: string;
  preview_url: string | null;
  is_default: boolean;
  created_at: string;
}

export interface AvatarProfile {
  id: string;
  user_id: string;
  name: string;
  file_type: 'image' | 'video' | null;
  original_asset_url: string;
  processed_asset_url: string | null;
  preview_image_url: string | null;
  status: 'processing' | 'ready' | 'failed';
  is_default: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  script_raw: string | null;
  script_optimized: string | null;
  hook_selected: string | null;
  platform: 'youtube_shorts' | 'instagram_reels' | 'tiktok' | 'youtube' | 'linkedin';
  style_template: 'split_screen' | 'video_call' | 'podcast' | 'news_anchor' | 'reaction_cam';
  voice_profile_id: string | null;
  avatar_profile_id: string | null;
  status: 'draft' | 'generating' | 'editing' | 'rendering' | 'complete' | 'failed';
  timeline_json: Record<string, unknown>;
  final_video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  render_progress: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  voice_profiles?: VoiceProfile;
  avatar_profiles?: AvatarProfile;
}

export interface ProjectAsset {
  id: string;
  project_id: string;
  type: 'voice_audio' | 'avatar_video' | 'broll_clip' | 'caption_json' | 'music' | 'sfx' | 'final_video' | 'thumbnail';
  url: string;
  filename: string | null;
  duration_seconds: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface RenderJob {
  id: string;
  project_id: string;
  user_id: string;
  job_type: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  bullmq_job_id: string | null;
  progress: number;
  result_url: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}
