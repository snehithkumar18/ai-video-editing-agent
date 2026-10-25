# Instagram Reel Reconstruction Engine

A deterministic, frame-accurate motion graphics and character video reconstruction pipeline built with **Remotion**, **React**, **TypeScript**, and **OpenCV / Whisper**.

This system reconstructs the viral 65.8-second vertical Instagram Reel ([`instagram.com/reel/De4byPBoLWT/`](https://www.instagram.com/reel/De4byPBoLWT/)) frame-by-frame, replacing the original illustrated character with a custom cutout character identity while faithfully recreating the typography, spring physics, color palette, audio mastery, and kinetic captions across all 19 scenes.

---

## 📁 Project Structure

```
reel_reconstruction/
├── reference/
│   └── reference_reel.mp4            # Original 65.8s Instagram Reel (720x1280 @ 30 FPS)
├── analysis/
│   ├── video_metadata.json           # FFprobe stream parameters, codecs, FPS, bitrates
│   ├── scene_breakdown.json          # Precise boundaries & durations for all 19 scenes
│   ├── visual_inventory.json         # Typography, hex colors, graphic asset specs
│   ├── animation_timeline.json       # Keyframe triggers, spring physics, and events
│   ├── audio_events.json             # Whisper word-level timestamps (218 words, 21 segments)
│   ├── reference_contact_sheet.jpg   # 4x5 visual grid of scene keyframes
│   └── frames/                       # 19 representative keyframe stills extracted via OpenCV
├── assets/
│   ├── character/
│   │   ├── character_reference.jpg   # User photo source reference
│   │   ├── character_cutout.png      # Alpha-transparent high-res character cutout
│   │   └── character_manifest.json   # Identity, anchor coordinates & scene-pose mapping
│   ├── audio/
│   │   └── reference_audio.wav       # Master 44.1kHz 16-bit PCM narrator audio track
│   └── graphics/                     # UI components, badges, icons, cards
├── src/
│   ├── components/
│   │   ├── BackgroundLayer.tsx       # Warm off-white (#F4F1EA) + 28px dot matrix + vignette
│   │   ├── CharacterLayer.tsx        # Dynamic character rigging, breathing, & gestures
│   │   └── KineticSubtitles.tsx      # High-retention word highlights (zero background boxes)
│   ├── scenes/
│   │   ├── Scene01AccountGrowth.tsx  # Frames 0-144: 39.5K profile card, velocity badge
│   │   ├── Scene02TheSystem.tsx      # Frames 144-252: NOW calendar, SEALED ribbon, padlock
│   │   ├── Scene03EarlyTikTok.tsx    # Frames 252-354: Phone mockup, exponential growth curve
│   │   ├── Scene04RealMotion.tsx     # Frames 354-435: Isometric exploded wireframe plates
│   │   ├── Scene05CrowdAudience.tsx  # Frames 435-519: Crowd silhouettes & mystery question marks
│   │   ├── Scene06MarketSaturation.tsx # Frames 519-669: Theater seating diagram & SOLD OUT badge
│   │   ├── Scene07DotTransition.tsx  # Frames 669-720: Red ticket No. 2481 & dot matrix wipe
│   │   ├── Scene08AISlopGrid.tsx     # Frames 720-792: 6-card AI slop grid & warning tags
│   │   ├── Scene09System221Files.tsx # Frames 792-954: Dark system card rolling counter to 221
│   │   ├── Scene10HookPatterns.tsx   # Frames 954-1053: patterns.md 3-rule checklist
│   │   ├── Scene11MotionPhysics.tsx  # Frames 1053-1176: Zoom kick reticle & damping dial
│   │   ├── Scene12CaptionTimeline.tsx # Frames 1176-1287: DAW timeline, playhead & word offset
│   │   ├── Scene13AudioProcessing.tsx # Frames 1287-1404: 4-dial studio rack (CUT, SPEED, LOUD, PEAK)
│   │   ├── Scene14ReviewRelease.tsx  # Frames 1404-1530: Automated QC inspector film cell
│   │   ├── Scene15SingleLineInput.tsx # Frames 1530-1635: Dark Claude Code terminal prompt
│   │   ├── Scene16WorkflowChecklist.tsx # Frames 1635-1716: 4-stage pipeline completion bar
│   │   ├── Scene17GrowthAnalytics.tsx # Frames 1716-1845: 4.9M views dashboard & spline chart
│   │   ├── Scene18BrandDeals.tsx     # Frames 1845-1875: $2,500 card with BRAND DEALS rubber stamp
│   │   └── Scene19CallToAction.tsx   # Frames 1875-1974: Giant "SKILL" speech bubble & DM cards
│   └── ReelComposition.tsx           # Sequenced master Remotion timeline
├── scripts/
│   ├── analyze_reference_video.py    # OpenCV scene detection & frame extraction
│   ├── transcribe_reference.py       # Whisper speech-to-text with millisecond timestamps
│   ├── generate_analysis_files.py    # Aggregates metadata, visual inventory & timeline
│   └── compare_frames.py             # Generates side-by-side visual comparison stills
└── output/
    ├── reconstructed_reel.mp4        # Rendered 65.8s video (720x1280 @ 30 FPS)
    ├── comparisons/                  # Reference vs Reconstruction validation images
    └── still_scene_*.png             # Individual verified scene stills
```

---

## 🚀 How to Run & Reproduce

### 1. Analyze a New Reference Video
To extract metadata, detect scene cuts, and extract representative keyframes:
```bash
python reel_reconstruction/scripts/analyze_reference_video.py
python reel_reconstruction/scripts/transcribe_reference.py
python reel_reconstruction/scripts/generate_analysis_files.py
```

### 2. Replacing the Character Asset
1. Place your reference photo into `reel_reconstruction/assets/character/character_reference.jpg`.
2. Remove the background (using `rembg` or photo editor) and save to:
   - `reel_reconstruction/assets/character/character_cutout.png`
   - `public/reel_reconstruction/character_cutout.png`
3. Adjust placement or pose parameters in `reel_reconstruction/assets/character/character_manifest.json`.

### 3. Preview in Remotion Studio
Open the interactive preview player:
```bash
npx remotion studio src/remotion/index.ts
```
Select the **ReelReconstruction** composition in the sidebar.

### 4. Render Still Frames
To render any verified frame (e.g. Scene 1 at frame 66, Scene 19 at frame 1914):
```bash
npx remotion still src/remotion/index.ts ReelReconstruction reel_reconstruction/output/still_scene_01.png --frame=66
npx remotion still src/remotion/index.ts ReelReconstruction reel_reconstruction/output/still_scene_19.png --frame=1914
```

### 5. Render Full MP4 Video
```bash
npx remotion render src/remotion/index.ts ReelReconstruction reel_reconstruction/output/reconstructed_reel.mp4 --concurrency=4
```

### 6. Generate Side-by-Side Comparison Stills
```bash
python reel_reconstruction/scripts/compare_frames.py
```

---

## 🎨 Design System

- **Background Palette**: Warm textured paper `#F4F1EA` with a subtle 28px dot matrix and radial vignette.
- **Accent Color**: Vivid Coral Red (`#E11D48` / `#EF4444`) used for rubber stamps, active subtitle words, and focal callouts.
- **Card Styling**:
  - Light cards: `#FFFFFF` with `border: 1px solid #E2E0D8` and soft elevation shadows.
  - Dark cards: `#0B0D0F` / `#121417` with subtle borders (`rgba(255,255,255,0.1)`).
- **Typography**:
  - Primary Headlines: Sans-serif (`Inter`, `Montserrat`), 800/900 weight, uppercase/lowercase tracking.
  - Emphasis Keywords: Italic Serif (`Playfair Display`, `Georgia`) in vibrant Coral Red.
  - Monospace Data / Code: `Fira Code`, `JetBrains Mono`.
- **Subtitles**: Zero background boxes or colored bounding pills. High contrast with active spoken word highlighted in `#E11D48`.
- **Character Layer**: Anchored in the bottom 35% of the frame (y: 820px–1280px), preserving upper 65% space for UI cards and motion graphics.
