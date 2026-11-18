import Groq from 'groq-sdk';
import logger from '@/lib/logger';

export interface DirectedScene {
  sceneIndex: number;
  start: number;
  end: number;
  duration: number;
  textSegment: string;
  visualType: 'motion_graphics' | 'stock_broll' | 'hybrid';
  stockKeywords: string[];
  stockVideoUrl?: string;
  motionGraphicTitle: string;
  motionGraphicSubtitle: string;
  motionGraphicBadge: string;
  accentColor: string;
}

const ACCENT_COLORS = ['#38BDF8', '#F95738', '#A855F7', '#10B981', '#EC4899', '#F59E0B'];

/**
 * Uses Groq LLM to intelligently analyze the speech transcript,
 * break it into timed scenes, query Pexels for stock clips where appropriate,
 * and generate motion graphics directives.
 */
export async function directVideoScenes(
  script: string,
  wordTimestamps: Array<{ word: string; start: number; end: number }>,
  totalDuration: number,
  pexelsApiKey: string
): Promise<DirectedScene[]> {
  const isGroqConfigured = !!process.env.GROQ_API_KEY;
  const groq = isGroqConfigured ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

  if (!groq || wordTimestamps.length === 0) {
    return generateFallbackScenes(script, totalDuration);
  }

  try {
    const prompt = `You are an expert viral reel director. 
Analyze this script and break it down into 4 to 6 sequential visual scenes that alternate between animated motion graphics and cinematic stock video.

Script:
"${script}"

Total Duration: ${totalDuration.toFixed(1)} seconds.

For each scene, output a JSON array of scene objects:
- sceneIndex: number (1, 2, 3...)
- textSegment: the exact portion of the script spoken in this scene
- visualType: 'motion_graphics' | 'stock_broll' | 'hybrid' (alternate intelligently)
- stockKeywords: array of 2-3 specific visual search terms if stock video fits (e.g. ["typing code", "developer keyboard", "server room"])
- motionGraphicTitle: short high-impact title (3-5 words, e.g. "AUTONOMOUS AI WORKFLOW")
- motionGraphicSubtitle: supporting subtitle or step instruction (5-8 words)
- motionGraphicBadge: tag badge (e.g. "STEP 1: VOICE SYNC", "10X SPEED", "THE SECRET")

Output ONLY valid JSON. No markdown code blocks, no text before or after.`;

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.8-27b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    let rawJson = response.choices[0]?.message?.content?.trim() || '';
    if (rawJson.startsWith('```')) {
      rawJson = rawJson.replace(/^```json?\s*/, '').replace(/```\s*$/, '').trim();
    }

    const parsedScenes = JSON.parse(rawJson);
    if (!Array.isArray(parsedScenes) || parsedScenes.length === 0) {
      return generateFallbackScenes(script, totalDuration);
    }

    // Match each scene's textSegment to word timestamps for exact frame-level accuracy
    const sceneCount = parsedScenes.length;
    const approxSceneDuration = totalDuration / sceneCount;

    const scenes: DirectedScene[] = [];
    for (let i = 0; i < parsedScenes.length; i++) {
      const ps = parsedScenes[i];
      const start = i === 0 ? 0 : scenes[i - 1].end;
      const end = i === sceneCount - 1 ? totalDuration : Math.min(totalDuration, start + approxSceneDuration);
      const duration = Math.max(1, end - start);
      const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];

      let stockVideoUrl: string | undefined;

      // If scene uses stock B-roll or hybrid, search Pexels
      if ((ps.visualType === 'stock_broll' || ps.visualType === 'hybrid') && pexelsApiKey && ps.stockKeywords?.length > 0) {
        stockVideoUrl = await fetchPexelsPortraitClip(ps.stockKeywords, pexelsApiKey);
      }

      scenes.push({
        sceneIndex: i + 1,
        start,
        end,
        duration,
        textSegment: ps.textSegment || '',
        visualType: ps.visualType || 'hybrid',
        stockKeywords: ps.stockKeywords || [],
        stockVideoUrl,
        motionGraphicTitle: ps.motionGraphicTitle || `SCENE ${i + 1}`,
        motionGraphicSubtitle: ps.motionGraphicSubtitle || ps.textSegment || '',
        motionGraphicBadge: ps.motionGraphicBadge || `PART ${i + 1}`,
        accentColor,
      });
    }

    return scenes;
  } catch (err) {
    logger.error('[SceneDirector] Failed to direct scenes with LLM, using algorithmic fallback:', err);
    return generateFallbackScenes(script, totalDuration);
  }
}

/**
 * Searches Pexels for a vertical 9:16 portrait video clip matching keywords.
 */
async function fetchPexelsPortraitClip(keywords: string[], apiKey: string): Promise<string | undefined> {
  for (const query of keywords) {
    try {
      const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3&orientation=portrait`;
      const res = await fetch(url, {
        headers: {
          Authorization: apiKey,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          const video = data.videos[0];
          // Pick best 720p or HD portrait mp4 file
          const file = video.video_files?.find((f: any) => f.quality === 'hd' && f.width <= 1080) || video.video_files?.[0];
          if (file?.link) {
            return file.link;
          }
        }
      }
    } catch (e) {
      logger.warn(`[Pexels] Query "${query}" failed:`, e);
    }
  }
  return undefined;
}

function generateFallbackScenes(script: string, totalDuration: number): DirectedScene[] {
  const sentences = script
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const count = Math.max(1, Math.min(5, sentences.length));
  const sceneDur = totalDuration / count;

  return Array.from({ length: count }, (_, i) => ({
    sceneIndex: i + 1,
    start: i * sceneDur,
    end: (i + 1) * sceneDur,
    duration: sceneDur,
    textSegment: sentences[i] || script,
    visualType: i % 2 === 0 ? 'motion_graphics' : 'hybrid',
    stockKeywords: ['technology', 'modern workspace', 'code'],
    motionGraphicTitle: `STEP ${i + 1} WORKFLOW`,
    motionGraphicSubtitle: sentences[i] || '',
    motionGraphicBadge: `PHASE ${i + 1}`,
    accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
  }));
}
