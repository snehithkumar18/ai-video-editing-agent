/**
 * Template Registry & Composition Dispatch Service
 * Handles discovery, metadata extraction, dynamic props mapping, and validation
 * for all short-form video templates registered across the SaaS platform.
 */

export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'beat_sync' | 'talking_head' | 'motion_graphics' | 'minimalist' | 'developer_skills';
  thumbnailUrl: string;
  recommendedDurationRange: [number, number]; // [minSec, maxSec]
  aspectRatio: '9:16' | '1:1' | '16:9';
  defaultFps: number;
  tags: string[];
  features: string[];
  requiredAssetTypes: ('image' | 'video' | 'audio' | 'voiceover' | 'code_snippet')[];
  description: string;
}

export interface AestheticBeatSyncProps {
  imagePaths: string[];
  videoClips: {
    src: string;
    durationInFrames: number;
    label?: string;
  }[];
  audioTrackUrl: string;
  colorGradePreset?: 'default' | 'ultra_realistic' | 'vibrant_warmth';
}

export const REGISTERED_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'AestheticBeatSyncReel',
    name: 'Aesthetic Beat-Sync Reel',
    category: 'beat_sync',
    thumbnailUrl: '/thumbnails/aesthetic_reel_thumbnail.jpg',
    recommendedDurationRange: [15, 30],
    aspectRatio: '9:16',
    defaultFps: 24,
    tags: ['luxury', 'lifestyle', 'mehendi', 'fashion', 'viral_sound', 'beat_drop'],
    features: [
      '15 rapid beat-synced intro cuts',
      '2-pass camera stabilization',
      'Facial blemish inpainting',
      'Selective LAB color science skin grading',
      'All-Intra 24 FPS fluid playback',
    ],
    requiredAssetTypes: ['image', 'video', 'audio'],
    description: 'High-energy, luxury aesthetic reel template with rapid-fire photo montage transitioning into butter-smooth stabilized video highlights synced to musical drops.',
  },
  {
    id: 'AestheticBeatSyncReelUltraRealistic',
    name: 'Aesthetic Beat-Sync Reel (Ultra-Realistic Edition)',
    category: 'beat_sync',
    thumbnailUrl: '/thumbnails/aesthetic_reel_thumbnail.jpg',
    recommendedDurationRange: [15, 30],
    aspectRatio: '9:16',
    defaultFps: 24,
    tags: ['ultra_realistic', 'calibrated_skin', 'gimbal_steady', 'luxury', 'mehendi'],
    features: [
      'Calibrated warm-golden melanin skin tones',
      'Soft-knee highlight compression without plastic sheen',
      '6 curated, gimbal-steady long video clips',
      'Optical motion frame interpolation (24 FPS)',
      'Rich jewel tone vibrancy on attire & jewelry',
    ],
    requiredAssetTypes: ['image', 'video', 'audio'],
    description: 'Master-grade calibrated edition featuring natural organic skin textures, zero camera wobble, and extended front-facing poses that allow every gesture to breathe.',
  },
  {
    id: 'SplitScreenMaster',
    name: 'Split-Screen Viral Explainer',
    category: 'talking_head',
    thumbnailUrl: '/thumbnails/split_screen_thumb.jpg',
    recommendedDurationRange: [30, 60],
    aspectRatio: '9:16',
    defaultFps: 30,
    tags: ['educational', 'ai_tools', 'business', 'talking_head', 'broll_split'],
    features: [
      'Top 65% dynamic B-roll and UI motion graphics',
      'Bottom 35% cutout speaking avatar with breathing idle motion',
      'Synced karaoke-style kinetic subtitles',
      'Audio auto-ducking between speech and background music',
    ],
    requiredAssetTypes: ['image', 'video', 'voiceover', 'audio'],
    description: 'The premier retention-maximizing layout used by top tech and business creators—pairing live B-roll demos with personal presenter cutouts.',
  },
  {
    id: 'ZoomReel',
    name: 'Zoom Meeting Style Reel',
    category: 'talking_head',
    thumbnailUrl: '/thumbnails/zoom_reel_thumb.jpg',
    recommendedDurationRange: [20, 60],
    aspectRatio: '9:16',
    defaultFps: 30,
    tags: ['podcast', 'interview', 'remote_work', 'meeting_clip', 'consultation'],
    features: [
      'Floating macOS window frame with realistic drop shadows',
      'Live avatar speaking window with participant metadata',
      'Interactive timeline progress bar and speaker indicator',
      'Dynamic caption popups with spring-damped bounce',
    ],
    requiredAssetTypes: ['image', 'voiceover'],
    description: 'Simulates an authentic remote video call conversation, making technical advice and podcast insights feel immediate, intimate, and credible.',
  },
  {
    id: 'WhiteMinimalReel',
    name: 'White Minimalist Thought Leadership',
    category: 'minimalist',
    thumbnailUrl: '/thumbnails/minimal_thumb.jpg',
    recommendedDurationRange: [15, 45],
    aspectRatio: '9:16',
    defaultFps: 30,
    tags: ['minimal', 'studio_white', 'quotes', 'founder', 'apple_aesthetic'],
    features: [
      'Pure studio-white background with subtle ambient floor gradient',
      'Isolated presenter framing with gentle drop shadow depth',
      'High-contrast bold kinetic typography',
      'Zero visual clutter for maximal message retention',
    ],
    requiredAssetTypes: ['image', 'voiceover'],
    description: 'Crisp Apple-inspired aesthetic designed for founders, authors, and executive coaches who want their words to take center stage.',
  },
  {
    id: 'ClaudeSkillReel',
    name: 'Developer Code & Terminal Walkthrough',
    category: 'developer_skills',
    thumbnailUrl: '/thumbnails/claude_skill_thumb.jpg',
    recommendedDurationRange: [30, 60],
    aspectRatio: '9:16',
    defaultFps: 30,
    tags: ['developer', 'terminal', 'coding', 'code_diff', 'saas_launch'],
    features: [
      'Syntax-highlighted terminal typing animations',
      'Dynamic file-tree browser with active selection states',
      'Coded cartoon presenter avatar with expressive mouth rigging',
      'Callout badges highlighting key command-line flags',
    ],
    requiredAssetTypes: ['code_snippet', 'voiceover'],
    description: 'Engineered specifically for developer marketing, package announcements, and command-line tool showcases with real animated syntax.',
  },
];

export class TemplateRegistryService {
  /**
   * Retrieves all registered video templates
   */
  static getAllTemplates(): TemplateDefinition[] {
    return REGISTERED_TEMPLATES;
  }

  /**
   * Retrieves a template by its unique ID
   */
  static getTemplateById(templateId: string): TemplateDefinition | undefined {
    return REGISTERED_TEMPLATES.find((t) => t.id === templateId || (templateId === 'ClaudeSkillReelComposition' && t.id === 'ClaudeSkillReel'));
  }

  /**
   * Retrieves templates filtered by category
   */
  static getTemplatesByCategory(category: TemplateDefinition['category']): TemplateDefinition[] {
    return REGISTERED_TEMPLATES.filter((t) => t.category === category);
  }

  /**
   * Searches templates by matching title, description, or tags
   */
  static searchTemplates(query: string): TemplateDefinition[] {
    const q = query.toLowerCase().trim();
    if (!q) return REGISTERED_TEMPLATES;

    return REGISTERED_TEMPLATES.filter((t) => {
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchName || matchDesc || matchTags;
    });
  }

  /**
   * Validates composition props against template schema
   */
  static validateProps(templateId: string, props: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!props) return { isValid: false, errors: ['Props object is required'] };

    if (templateId.startsWith('AestheticBeatSyncReel')) {
      if (!props.imagePaths || props.imagePaths.length === 0) {
        errors.push('At least one image path is required for beat-sync montage');
      }
      if (!props.videoClips || props.videoClips.length === 0) {
        errors.push('At least one video clip is required for highlights section');
      }
      if (!props.audioTrackUrl) {
        errors.push('Audio track URL is required');
      }
    }
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates whether an array of uploaded assets satisfies the requirements for a given template
   */
  static validateAssetRequirements(
    templateId: string,
    uploadedTypes: ('image' | 'video' | 'audio' | 'voiceover' | 'code_snippet')[]
  ): { valid: boolean; missingTypes: string[] } {
    const template = this.getTemplateById(templateId);
    if (!template) {
      return { valid: false, missingTypes: ['Template not found'] };
    }

    const missing = template.requiredAssetTypes.filter((req) => !uploadedTypes.includes(req));
    return {
      valid: missing.length === 0,
      missingTypes: missing,
    };
  }
}
