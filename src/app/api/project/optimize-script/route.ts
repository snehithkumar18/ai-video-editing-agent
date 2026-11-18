import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';
import logger from '@/lib/logger';

const isGroqConfigured = !!process.env.GROQ_API_KEY;
const groq = isGroqConfigured ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { script } = await request.json();

    if (!script || typeof script !== 'string') {
      return NextResponse.json({ success: false, error: 'Script content is required' }, { status: 400 });
    }

    let optimizedScript = script;

    if (groq) {
      const response = await groq.chat.completions.create({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'system',
            content: `You are an expert short-form viral video scriptwriter. 
Your task is to transform and compress the user's raw script into an ultra-high retention vertical reel script that speaks in STRICTLY UNDER 50 SECONDS (Target: 110 to 130 spoken words).

Strict Rules:
1. Hook the viewer in the first 3 seconds with a bold problem, controversy, or surprising insight.
2. Structure the core message into 3 fast, punchy actionable steps or insights (e.g., "Step One...", "Step Two...", "Step Three...").
3. End with a sharp 1-sentence call to action.
4. Keep the pacing punchy, concise, and energetic.
5. Output ONLY the spoken narration text. Absolutely NO stage directions, NO speaker tags (like [Voiceover:] or Narrator:), NO timestamps, and NO emojis.`
          },
          {
            role: 'user',
            content: script
          }
        ],
        temperature: 0.4,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        optimizedScript = content.trim();
      }
    } else {
      logger.warn('[Optimize Script] Groq is not configured, running in fallback mode');
      // Mock optimization: Add structural formatting and hook suggestions
      if (script.length > 5) {
        optimizedScript = `🔥 Here is the secret:\n\n${script}\n\nLike and subscribe for more daily tips!`;
      } else {
        optimizedScript = `🚀 Double your productivity starting today. It begins with one simple habit. Then another. Suddenly you are working half as much.`;
      }
    }

    return NextResponse.json({ success: true, optimizedScript });

  } catch (error) {
    logger.error('Optimize Script Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to optimize script' }, { status: 500 });
  }
}
