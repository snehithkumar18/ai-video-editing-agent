# Native Dependencies

This project uses native binaries and libraries that must be installed on your machine or CI runner.

## Required at runtime
- ffmpeg (and ffprobe)
- system libs for `canvas` (cairo, pango, libpng, libjpeg, giflib)
- libvips for `sharp`
- Python and build tools for some native modules

## Ubuntu / Debian
```bash
sudo apt update
sudo apt install -y ffmpeg \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev libpng-dev build-essential python3
# libvips for sharp
sudo apt install -y libvips-dev
```

## macOS (Homebrew)
```bash
brew install ffmpeg vips cairo pango libpng libjpeg
xcode-select --install   # if you need build tools
```

## Windows (recommended: WSL) 
- Option 1 (WSL): follow Ubuntu instructions inside WSL.
- Option 2 (native Windows): use Chocolatey or Scoop
```powershell
choco install ffmpeg
# libvips via scoop or download installer from https://www.libvips.org
``` 

## Notes & Troubleshooting
- `canvas` often fails to build if `cairo` and `pango` are missing. Install them first.
- `sharp` requires `libvips`; prefer installing via package manager to avoid long builds.
- `face-api` model files must be placed at `public/models` (see src/lib/utils/faceDetection.ts).
- For CI, install ffmpeg and libvips in your pipeline image or use Docker with required tools.

## Quick Dev Steps
1. Install Node.js (>=16)
2. Install system packages above
3. Run `npm install` (or `pnpm install`)
4. Copy `.env.example` to `.env.local` and fill secrets
5. Start dev server: `npm run dev`

If you want, I can add a Dockerfile or a GitHub Actions job that includes these dependencies.