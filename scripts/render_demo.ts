import { generateTalkingCharacterVideo } from '../src/lib/services/talkingCharacterService';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Loading photo and audio for new character...');
  const imagePath = 'C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/.user_uploaded/media_1791047054675.jpg';
  const audioPath = 'public/speech_female.wav';
  const timestampsPath = 'public/timestamps_female.json';

  const imgBuffer = fs.readFileSync(imagePath);
  const audioBuffer = fs.readFileSync(audioPath);
  const timestamps = JSON.parse(fs.readFileSync(timestampsPath, 'utf-8'));

  console.log('🎬 Starting Talking Character Render:');
  console.log(' - Image: media_1791047054675.jpg (736x981)');
  console.log(' - Audio: speech_female.wav (47.5s, 132 words)');
  console.log(' - Mouth calibrated Y: 0.275, X: 0.510');
  console.log(' - Resolution: 720x1280 (9:16 vertical video)');

  const t0 = Date.now();
  const videoBuffer = await generateTalkingCharacterVideo({
    imageBuffer: imgBuffer,
    audioBuffer: audioBuffer,
    timestamps,
    mode: 'canvas',
    mouthNormalizedY: 0.275,
    mouthNormalizedX: 0.510,
    width: 720,
    height: 1280,
    fps: 30,
  });

  const outputPath = path.resolve('public', 'character_talking_video.mp4');
  fs.writeFileSync(outputPath, videoBuffer);

  const durationSec = ((Date.now() - t0) / 1000).toFixed(1);
  const sizeMb = (videoBuffer.length / 1024 / 1024).toFixed(2);
  console.log(`✅ SUCCESS! Rendered 47.5s video in ${durationSec}s`);
  console.log(`📁 Saved to: ${outputPath} (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
