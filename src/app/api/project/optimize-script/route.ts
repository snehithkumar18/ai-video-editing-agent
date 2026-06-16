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
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert short-form video scriptwriter. Your task is to optimize the user-provided script to make it highly engaging, add structural hooks, remove unnecessary words, and format it clearly with line breaks for natural speech flow. Keep it punchy and under 600 characters if possible. Output ONLY the optimized script.'
          },
          {
            role: 'user',
            content: script
          }
        ],
        temperature: 0.7,
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
