import { spawn, ChildProcess } from 'child_process';
import path from 'path';

let voiceStudioProcess: ChildProcess | null = null;
let nextProcess: ChildProcess | null = null;

async function checkPortReady(url: string, maxAttempts = 15): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return true;
    } catch (e) {
      // Waiting
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  return false;
}

function startAll() {
  console.log('\n======================================================');
  console.log('🚀 Starting AI Video Editing Agent Dev Environment');
  console.log('======================================================\n');

  // 1. Start VoiceStudio Local Server on port 3900
  console.log('🎙️ [VoiceStudio] Launching local VoiceStudio server on port 3900...');
  const serverPath = path.resolve('src', 'server', 'voiceStudioServer.py');

  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  voiceStudioProcess = spawn(pythonCmd, [serverPath], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
  });

  voiceStudioProcess.stdout?.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.log(`\x1b[36m[VoiceStudio]\x1b[0m ${text}`);
  });

  voiceStudioProcess.stderr?.on('data', (data) => {
    const text = data.toString().trim();
    if (text && !text.includes('INFO:') && !text.includes('WARNING:')) {
      console.error(`\x1b[33m[VoiceStudio Warning]\x1b[0m ${text}`);
    }
  });

  // 2. Wait for VoiceStudio to be ready, then launch Next.js
  checkPortReady('http://127.0.0.1:3900/health').then((ready) => {
    if (ready) {
      console.log('✅ \x1b[32m[VoiceStudio] Local Voice Cloning Server is READY on http://127.0.0.1:3900\x1b[0m\n');
    } else {
      console.log('⚠️ [VoiceStudio] Startup probe timed out, proceeding with Next.js (cloud fallbacks will be used)\n');
    }

    console.log('⚡ [Next.js] Starting Next.js development server...\n');
    const nextBin = path.resolve('node_modules', 'next', 'dist', 'bin', 'next');
    nextProcess = spawn(process.execPath, [nextBin, 'dev'], {
      stdio: 'inherit',
      shell: false,
    });

    nextProcess.on('exit', (code) => {
      cleanup();
      process.exit(code || 0);
    });
  });

  function cleanup() {
    console.log('\n🛑 Shutting down dev services...');
    if (voiceStudioProcess) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(voiceStudioProcess.pid), '/f', '/t']);
        } else {
          voiceStudioProcess.kill('SIGTERM');
        }
      } catch (e) {}
    }
    if (nextProcess) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(nextProcess.pid), '/f', '/t']);
        } else {
          nextProcess.kill('SIGTERM');
        }
      } catch (e) {}
    }
  }

  process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });
}

startAll();
