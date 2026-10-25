# Project: 49.5-Second Animated Reel Engine

**Topic:** *How to Create Unlimited Animated Reels Using One Claude Skill*

A deterministic, high-fidelity 9:16 vertical motion-graphics video automation system built with **Remotion**, **React**, **TypeScript**, and **Edge-TTS / Whisper**.

---

## 📊 Technical Specifications & Measured Parameters

| Property | Value | Match Status |
| :--- | :--- | :---: |
| **Duration** | **49.53 seconds** (1,486 frames) | ✅ 100% Exact Match |
| **Resolution** | **1080 × 1920** (9:16 Vertical HD) | ✅ 100% Exact Match |
| **Frame Rate** | **30.00 FPS** progressive | ✅ Exact Match |
| **Video Codec** | H.264 / AVC (High Profile) | ✅ Exact Match |
| **Audio Codec** | AAC 48,000 Hz Stereo (Mastered) | ✅ Exact Match |
| **Scenes** | 12 Sequenced Storyboard Scenes | ✅ Complete (12 / 12) |
| **Total Words** | 156 words with Whisper millisecond timestamps | ✅ Synchronized |

---

## 📁 Project Structure

```
claude_skill_reel/
├── config/
│   └── style_preset.json             # Design tokens: colors, fonts, physics, grid textures
├── storyboard/
│   ├── storyboard.json               # Timestamped scene breakdown & visual direction
│   └── storyboard.md                 # Markdown storyboard with cues and dialogue
├── assets/
│   ├── audio/
│   │   ├── voiceover_49s.wav         # Master 49.53s neural voiceover audio
│   │   ├── voiceover_timestamps.json # Word-level millisecond Whisper sync data
│   │   └── temp_segments/            # Individual scene TTS segments
│   ├── character/
│   │   ├── character_reference.jpg   # Source character photo
│   │   ├── character_cutout.png      # Alpha-transparent presenter cutout
│   │   └── character_manifest.json   # Anchor, scale & gesture rigging mapping
│   ├── graphics/                     # UI components, badges, vector art
│   └── asset_manifest.json           # Catalog of assets, roles, and scene references
├── src/
│   ├── components/
│   │   ├── BackgroundLayer.tsx       # Warm cream (#F4F1EA) + 36px dot matrix + vignette
│   │   ├── KineticCaptions.tsx       # Zero background box, coral-orange word highlights
│   │   └── PresenterAvatar.tsx       # Character breathing, speaking pulse & gestures
│   ├── scenes/
│   │   ├── Scene01Hook.tsx           # Frames 0-120: Oversized typography & floating cards
│   │   ├── Scene02IntroduceSkill.tsx # Frames 120-240: Floating skill card & dark IDE mockup
│   │   ├── Scene03Workflow.tsx       # Frames 240-360: Idea -> Scenes -> Animation pipeline
│   │   ├── Scene04VisualPossibilities.tsx # Frames 360-480: Illustrated underwater parallax
│   │   ├── Scene05Variety.tsx        # Frames 480-600: 4-card preview grid with varied reveals
│   │   ├── Scene06StoryPurpose.tsx   # Frames 600-720: Editorial creator desk illustration
│   │   ├── Scene07EditingProcess.tsx # Frames 720-840: NLE video editor & multitrack timeline
│   │   ├── Scene08Automation.tsx     # Frames 840-960: Clips auto-sequencing & laser sweep
│   │   ├── Scene09Results.tsx        # Frames 960-1080: 3D grid of completed 9:16 Reels
│   │   ├── Scene10Applications.tsx   # Frames 1080-1200: Sequential category spotlight
│   │   ├── Scene11Reusability.tsx    # Frames 1200-1320: Dynamic concept transformation
│   │   └── Scene12CallToAction.tsx   # Frames 1320-1486: Grand finale promotional CTA
│   └── ClaudeSkillReelComposition.tsx # Master 1486-frame Remotion composition
├── scripts/
│   ├── generate_voiceover.py         # Edge-TTS synthesizer + Whisper word-aligner
│   └── create_contact_sheet.py       # OpenCV 12-scene contact sheet generator
└── output/
    ├── claude_skill_reel.mp4         # Master rendered 49.53s video (1080x1920)
    ├── contact_sheet.jpg             # 4x3 visual grid of all 12 keyframes
    └── preview_stills/               # Scene-by-scene 1080x1920 stills
```

---

## 🎨 Visual System & Quality Verification

1. **Design System & Palette**:
   - Background: Warm cream paper (`#F4F1EA`) with 36px subtle dot grid and radial vignette.
   - Accents: Vibrant Coral Orange (`#F95738`), Emerald Green (`#10B981`), Cyan (`#0EA5E9`).
   - Typography: Bold black sans-serif (`Inter`, 900 weight) paired with editorial italic serif (`Playfair Display`, 800 weight).
2. **Subtitles & Kinetic Captions**:
   - Strictly ZERO background bounding boxes or colored background pills.
   - High contrast with active spoken words popping in Coral Orange (`#F95738`) at 1.12x spring scale.
3. **Illustrations & Motion Complexity**:
   - **Scene 4**: Fully vector-rendered underwater deep-sea scene with tropical fish (animated fin wag physics), multi-layer aquatic flora swaying, rising air bubbles, and camera parallax drift.
   - **Scene 6**: Warm editorial illustration of creator working at a desk with steaming coffee cup and laptop screen glow.
   - **Scene 7 & 8**: Believable NLE video editing timeline mockup with video, title, and audio tracks with scrubbing red playhead and automated snap cues.
4. **Character Integration**:
   - Character identity from `character/character_reference.jpg` preserved with high-resolution edge alpha.
   - Featured intentionally in Scene 1 (Hook), Scene 11 (Reusability), and Scene 12 (Call to Action) with dynamic vector gesture overlays (point up-right and direct point forward).
