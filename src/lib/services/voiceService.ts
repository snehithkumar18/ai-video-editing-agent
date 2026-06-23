import Groq from 'groq-sdk';
import { VoiceProfile } from '../types';
import logger from '@/lib/logger';

function getGroq(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      '[voiceService] Missing GROQ_API_KEY environment variable. ' +
      'Set it in .env.local or your deployment environment.'
    );
  }
  return new Groq({ apiKey: key });
}

export async function generateSpeechGroqTTS(text: string, voiceSampleUrl: string): Promise<Buffer> {
  // Use Groq's Orpheus TTS model (replaced decommissioned playai-tts)
  const groq = getGroq();
  
  const response = await groq.audio.speech.create({
    model: 'canopylabs/orpheus-v1-english',
    voice: 'Kore',
    input: text,
    response_format: 'mp3',
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateSpeechOpenVoice(text: string, voiceSampleUrl: string): Promise<Buffer> {
  const res = await fetch('https://api-inference.huggingface.co/models/myshell-ai/OpenVoice', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!res.ok) throw new Error('OpenVoice TTS failed');

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateSpeechFishAudio(text: string, referenceUrl: string): Promise<Buffer> {
  const res = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      reference_id: referenceUrl,
      format: 'mp3',
    }),
  });

  if (!res.ok) throw new Error('Fish Audio TTS failed');

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateSpeechElevenLabs(text: string, voiceId: string): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.5 },
    }),
  });

  if (!res.ok) throw new Error('ElevenLabs TTS failed');

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateSpeech(text: string, voiceProfile: VoiceProfile): Promise<{ audioBuffer: Buffer; providerUsed: string }> {
  try {
    const buffer = await generateSpeechGroqTTS(text, voiceProfile.sample_url);
    return { audioBuffer: buffer, providerUsed: 'groq_playai' };
  } catch (error) {
    logger.warn('Provider 1 Groq PlayAI TTS failed, falling back to OpenVoice', error);
  }

  try {
    const buffer = await generateSpeechOpenVoice(text, voiceProfile.sample_url);
    return { audioBuffer: buffer, providerUsed: 'openvoice' };
  } catch (error) {
    logger.warn('Provider 2 OpenVoice failed, falling back to Fish Audio', error);
  }

  try {
    const buffer = await generateSpeechFishAudio(text, voiceProfile.provider_voice_id || voiceProfile.sample_url);
    return { audioBuffer: buffer, providerUsed: 'fish_audio' };
  } catch (error) {
    logger.warn('Provider 3 Fish Audio failed, falling back to ElevenLabs', error);
  }

  const buffer = await generateSpeechElevenLabs(text, voiceProfile.provider_voice_id!);
  return { audioBuffer: buffer, providerUsed: 'elevenlabs' };
}

export async function cloneVoiceWithElevenLabs(audioBuffer: Buffer, name: string): Promise<string> {
  const formData = new FormData();
  formData.append('name', name);
  
  const blob = new Blob([audioBuffer as any], { type: 'audio/mpeg' });
  formData.append('files', blob, 'sample.mp3');

  const res = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('ElevenLabs voice cloning failed');

  const data = await res.json();
  return data.voice_id;
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export async function transcribeAudioForTimestamps(audioBuffer: Buffer): Promise<WordTimestamp[]> {
  const file = new File([audioBuffer as any], 'audio.mp3', { type: 'audio/mpeg' });
  
  const transcription = await getGroq().audio.transcriptions.create({
    file,
    model: 'whisper-large-v3',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  });

  const verbose = transcription as any;
  if (!verbose.words) return [];

  return verbose.words.map((w: { word?: string; start?: number; end?: number }) => ({
    word: w.word || '',
    start: w.start || 0,
    end: w.end || 0,
  }));
}

