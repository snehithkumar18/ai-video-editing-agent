export const PLATFORMS = [
  'youtube_shorts',
  'instagram_reels',
  'tiktok',
  'youtube',
  'linkedin'
] as const;

export const STYLE_TEMPLATES = [
  'split_screen',
  'software_walkthrough',
  'creator_motion_graphics',
  'clean_tech',
  'warm_canvas',
  'chalk_talk',
  'data_story',
  'pop_info',
  'paper_doc',
  'zoom_circle',
  'solo_studio',
  'video_call',
  'podcast',
  'news_anchor',
  'reaction_cam'
] as const;

export const PLAN_LIMITS = {
  free: {
    render_credits: 5,
    max_voice_profiles: 1,
    max_avatar_profiles: 1
  },
  starter: {
    render_credits: 20,
    max_voice_profiles: 3,
    max_avatar_profiles: 2
  },
  pro: {
    render_credits: 100,
    max_voice_profiles: 10,
    max_avatar_profiles: 5
  },
  agency: {
    render_credits: 500,
    max_voice_profiles: 50,
    max_avatar_profiles: 20
  }
} as const;
