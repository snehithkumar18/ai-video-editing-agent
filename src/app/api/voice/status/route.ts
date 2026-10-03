import { NextResponse } from 'next/server';
import { checkVoiceStudioHealth } from '@/lib/services/voiceStudioService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const voiceStudio = await checkVoiceStudioHealth();

    return NextResponse.json({
      success: true,
      data: {
        voiceStudio: {
          available: voiceStudio.available,
          endpoint: voiceStudio.endpoint,
          protocol: voiceStudio.protocol || 'voicestudio.speech.v1',
          error: voiceStudio.error,
        },
        kokoro: {
          available: true,
          provider: 'Kokoro-TTS-Zero (Hugging Face CPU)',
        },
        whisper: {
          available: !!process.env.GROQ_API_KEY,
          provider: 'Groq Whisper Large v3',
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to check voice service status',
    }, { status: 500 });
  }
}
