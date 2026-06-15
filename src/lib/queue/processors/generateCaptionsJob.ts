import { Job } from 'bullmq';
import { createClient } from '@/lib/supabase/admin';
import { uploadBuffer } from '@/lib/services/storageService';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function processGenerateCaptions(job: Job): Promise<{ captionUrl: string; wordCount: number }> {
  const { projectId, audioUrl } = job.data;
  const supabase = createClient();

  // 1. Download audio from R2 as Buffer
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) throw new Error(`Failed to download audio for captions from ${audioUrl}`);
  const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

  // 2. Transcribe using Groq Whisper
  const file = new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' });
  const transcription = await groq.audio.transcriptions.create({
    file,
    model: 'whisper-large-v3',
    response_format: 'verbose_json',
    timestamp_granularities: ['word']
  });

  type TranscriptionWord = {
    word: string;
    start: number;
    end: number;
  };

  // 3. Transform to caption format
  const words = Array.isArray((transcription as any).words) ? ((transcription as any).words as TranscriptionWord[]) : [];
  const captions = words.map((w: TranscriptionWord) => ({
    id: `caption-${w.start}`,
    word: w.word.trim(),
    start: w.start,
    end: w.end,
    style: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 8,
      animation: 'fadeIn',
      position: 'bottom'
    }
  }));

  // 4. Upload captions JSON to R2
  const captionsBuffer = Buffer.from(JSON.stringify(captions), 'utf-8');
  const captionsKey = `project-assets/${projectId}/captions_${Date.now()}.json`;
  const captionUrl = await uploadBuffer(captionsBuffer, captionsKey, 'application/json');

  // 5. Save as project_asset
  await supabase.from('project_assets').insert({
    project_id: projectId,
    type: 'caption_json',
    url: captionUrl,
    metadata: { wordCount: captions.length }
  });

  // 6. Update render_progress
  await supabase
    .from('projects')
    .update({ render_progress: 70 })
    .eq('id', projectId);

  return { captionUrl, wordCount: captions.length };
}
