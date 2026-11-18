# AI Video Editing Agent (VidAgent)

[![CI Pipeline](https://github.com/snehithkumar18/Ai-video-editing-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/snehithkumar18/Ai-video-editing-agent/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)
![Remotion](https://img.shields.io/badge/Remotion-4.0-red?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-4.1-FCC72B?style=flat&logo=vitest)

**VidAgent** is an AI-powered short-form video creation and automated editing platform. It automates the entire lifecycle of vertical content creation (Instagram Reels, YouTube Shorts, TikTok)—transforming raw scripts, audio voiceovers, photos, and long camera footage into high-retention, studio-grade vertical videos with automated beat-synchronization, kinetic typography, AI talking avatars, and cinematic computer vision stabilization.

---

## Key Features

- **Programmatic Video Composition Engine:** Powered by Remotion 4.0 for pixel-perfect, deterministic frame-by-frame rendering at 1080×1920 (9:16 vertical) in 24 & 30 FPS.
- **Cinematic Beat-Sync Automation:** Algorithmic scene segmentation, beat detection, and micro-cuts synchronized to audio drops and musical phrases.
- **2-Pass Camera Stabilization:** Built-in FFmpeg `vidstab` motion-tracking and Gaussian smoothing pipeline eliminating handheld camera shake for smooth gimbal-quality playback.
- **Facial Computer Vision & Skin Science:**
  - Automated blemish inpainting (`cv2.inpaint`) removing skin anomalies while keeping eyes, lashes, lips, and jewelry tack-sharp.
  - LAB/YCrCb selective color grading calibrating warm-golden melanin skin tones and boosting vibrant jewel tones.
  - Micro-contrast retention via Contrast-Adaptive Sharpening (CAS).
- **AI Talking Character Synthesis:** Lip-sync generation via SadTalker (`facevid2vid`) driven by neural audio tracks.
- **Local Speech & Voice Studio:** Integrated local FastAPI engine supporting Edge-TTS, OmniVoice, and voice cloning with sub-millisecond word alignment via Groq Whisper (`whisper-large-v3`).
- **Full-Stack SaaS Architecture:** Next.js 16 App Router dashboard, multi-track timeline editor, project manager, Supabase authentication & storage, Redis/BullMQ asynchronous render queue, and Stripe billing.

---

## Viral Template Catalog

1. **Aesthetic Beat-Sync Reel (`AestheticBeatSyncReel`):** High-fashion and luxury brand reels with 15 rapid beat-synced intro photo cuts followed by stabilized, color-graded action video shots.
2. **Split-Screen Master Reel (`SplitScreenMaster`):** High-retention explainer format with top 65% dynamic B-roll / UI motion graphics and bottom 35% cutout speaking avatar.
3. **Zoom Meeting Style Reel (`ZoomReel`):** Floating macOS/Zoom-style interface with participant tags, animated progress indicators, and synced karaoke captions.
4. **White Minimalist Reel (`WhiteMinimalReel`):** Clean studio-white backdrop, isolated presenter framing, and high-legibility bold kinetic typography.
5. **Claude Skill / Code Walkthrough (`ClaudeSkillReel`):** Interactive terminal and code-diff animations designed for developer-focused tutorials and SaaS launches.

---

## System Architecture

```
                    +------------------------------------+
                    |        Next.js 16 Dashboard        |
                    |  (React 19, Tailwind 4, Zustand)   |
                    +-----------------+------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
+--------v-----------------------+                 +---------------v----------------+
|       AI Media Ingestion       |                 |     Asynchronous Workers       |
| - Edge-TTS / Kokoro Speech     |                 | - BullMQ Render Queue          |
| - Groq Whisper Word Sync       |                 | - Redis Job State Management   |
| - SadTalker Avatar Lip-Sync    |                 | - Supabase Storage & Database  |
+--------+-----------------------+                 +---------------+----------------+
         |                                                         |
         +----------------------------+----------------------------+
                                      |
                    +-----------------v------------------+
                    |    Computer Vision & Enhancement   |
                    | - 2-Pass vidstab Stabilization     |
                    | - LAB/YCrCb Selective Skin Grade   |
                    | - Lanczos 1080x1920 + CAS Sharp    |
                    | - minterpolate Motion Blend (24fps)|
                    +-----------------+------------------+
                                      |
                    +-----------------v------------------+
                    |      Remotion Rendering Engine     |
                    | - Headless Chromium Multi-Process  |
                    | - H.264 All-Intra Encoding         |
                    | - Master 1080x1920 MP4 Output      |
                    +------------------------------------+
```

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend & UI** | Next.js 16, React 19, Tailwind CSS 4, Radix UI, Shadcn UI, Lucide Icons |
| **State & Store** | Zustand, Zundo (Temporal undo/redo), TanStack React Query |
| **Video Engine** | Remotion 4.0 (`@remotion/renderer`, `@remotion/player`, `@remotion/bundler`) |
| **Media Processing** | FFmpeg (libx264, vidstab, minterpolate, cas), OpenCV (Python), Sharp |
| **Speech & Audio** | FastAPI, edge-tts, Kokoro TTS, Groq Whisper API |
| **Database & Auth** | Supabase (PostgreSQL, Row-Level Security, Storage Buckets) |
| **Job Queue** | BullMQ, Redis (ioredis / Upstash) |
| **Payments** | Stripe SDK (`@stripe/stripe-js`, `stripe`) |
| **Testing & CI** | Vitest, TypeScript Typecheck, GitHub Actions |

---

## Directory Structure

```
├── .github/workflows/          # GitHub Actions CI/CD workflows
├── public/                     # Static media, audio, assets, and renders
│   ├── audio/                  # Background music & sound effects
│   ├── renders/                # Exported master video MP4s
│   └── thumbnails/             # Clean, text-free video thumbnails
├── scripts/                    # Media processing, stabilization & CV pipelines
│   ├── build_ultra_realistic_smooth_reel.py
│   ├── process_realistic_photos.py
│   ├── process_realistic_clips.py
│   └── remove_blemish_and_vibrant.py
├── src/
│   ├── app/                    # Next.js App Router (Dashboard, APIs, Projects)
│   ├── components/             # UI Components (Editor, Timeline, VideoPlayer)
│   ├── lib/                    # Core utilities, Supabase client, Validators
│   ├── remotion/               # Remotion Root, Compositions & Templates
│   │   ├── templates/          # BeatSync, SplitScreen, Zoom, Minimalist
│   │   ├── Root.tsx            # Composition registry
│   │   └── index.ts            # Remotion entry point
│   └── server/                 # Local FastAPI VoiceStudio & SadTalker services
└── workers/                    # BullMQ async video rendering workers
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- Python >= 3.10
- FFmpeg installed and available on `PATH` (with `libvidstab` enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/snehithkumar18/Ai-video-editing-agent.git
   cd Ai-video-editing-agent
   ```

2. **Install Node dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GROQ_API_KEY=your-groq-api-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

Run the automated test suite with Vitest:

```bash
# Run unit tests
npm test

# Run TypeScript type check
npx tsc --noEmit
```

---

## License

This project is licensed under the [MIT License](LICENSE).
