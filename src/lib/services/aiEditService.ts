import Groq from 'groq-sdk'
import { AIEditResponse, ReplaceBRollOp, AddBRollOp } from '@/lib/types/aiEdit'

const isGroqConfigured = !!process.env.GROQ_API_KEY;
const groq = isGroqConfigured ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

function mockAIEditResponse(prompt: string, timelineSummary: string): AIEditResponse {
  const normalized = prompt.toLowerCase();
  const operations: any[] = [];
  let explanation = "Simulated AI edit response for local testing.";
  let summary = "Simulated update";

  if (normalized.includes('yellow') || normalized.includes('color')) {
    operations.push({
      type: 'UPDATE_ALL_CAPTIONS_STYLE',
      changes: { color: '#FFFF00', fontWeight: 'bold' },
      reasoning: 'Updated caption color to yellow as requested.'
    });
    explanation = 'I have updated all captions to have a bright yellow color and bold styling.';
    summary = 'Changed all captions to yellow, bold';
  } else if (normalized.includes('bounce') || normalized.includes('animation')) {
    operations.push({
      type: 'UPDATE_ALL_CAPTIONS_STYLE',
      changes: { animation: 'bounce' },
      reasoning: 'Changed animation to bounce.'
    });
    explanation = 'I have updated all captions to use the bounce animation.';
    summary = 'Set caption animation to bounce';
  } else if (normalized.includes('size') || normalized.includes('bigger') || normalized.includes('large') || normalized.includes('font')) {
    operations.push({
      type: 'UPDATE_ALL_CAPTIONS_STYLE',
      changes: { fontSize: 48 },
      reasoning: 'Increased font size.'
    });
    explanation = 'I have updated all captions to a larger font size of 48px.';
    summary = 'Set caption font size to 48px';
  } else if (normalized.includes('delete') || normalized.includes('remove') || normalized.includes('cut')) {
    operations.push({
      type: 'DELETE_CLIP',
      trackId: 'track-captions',
      clipId: 'caption-1',
      reasoning: 'Deleted clip as requested.'
    });
    explanation = 'I have removed the first caption clip.';
    summary = 'Deleted caption-1';
  } else if (normalized.includes('broll') || normalized.includes('b-roll') || normalized.includes('replace') || normalized.includes('add video')) {
    operations.push({
      type: 'ADD_BROLL',
      searchQuery: 'nature landscape',
      insertAtSecond: 5,
      durationSeconds: 5,
      newAssetUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
      reasoning: 'Added nature B-roll clip.'
    });
    explanation = 'I have added a scenic nature B-roll clip starting at second 5.';
    summary = 'Added nature B-roll at 5s';
  } else {
    operations.push({
      type: 'UPDATE_ALL_CAPTIONS_STYLE',
      changes: { color: '#FFFF00', animation: 'pop' },
      reasoning: 'Applied default style update.'
    });
    explanation = `Since GROQ_API_KEY is not set, I am running in local mock mode. I have applied a default test edit (color: yellow, animation: pop) for your prompt: "${prompt}".`;
    summary = 'Applied test edit (yellow color & pop animation)';
  }

  return {
    operations,
    explanation,
    humanReadableSummary: summary,
    confidence: 'high'
  };
}

export async function processAIEditPrompt(
  prompt: string,
  timelineSummary: string,
  pexelsApiKey: string
): Promise<AIEditResponse> {
  if (!isGroqConfigured || !groq) {
    return mockAIEditResponse(prompt, timelineSummary);
  }


  const systemPrompt = `You are an expert video editor AI assistant. You receive a video timeline summary and a natural language editing instruction. You must return a JSON object with the exact operations needed to make those edits.

AVAILABLE OPERATION TYPES AND THEIR REQUIRED FIELDS:

UPDATE_CAPTION_STYLE: { type, clipId, changes: { fontSize?, color?, backgroundColor?, animation?, position?, fontWeight? }, reasoning }
UPDATE_ALL_CAPTIONS_STYLE: { type, changes: { fontSize?, color?, backgroundColor?, animation?, position?, fontWeight? }, reasoning }
UPDATE_CAPTION_TEXT: { type, clipId, newText, reasoning }
MOVE_CLIP: { type, trackId, clipId, newStart (seconds), reasoning }
TRIM_CLIP: { type, trackId, clipId, newStart, newEnd (seconds), reasoning }
DELETE_CLIP: { type, trackId, clipId, reasoning }
REPLACE_BROLL: { type, clipId, searchQuery (what to search on Pexels), reasoning }
ADD_BROLL: { type, searchQuery, insertAtSecond, durationSeconds, reasoning }
UPDATE_CLIP_OPACITY: { type, trackId, clipId, opacity (0.0-1.0), reasoning }
UPDATE_AUDIO_VOLUME: { type, trackId, clipId, volume (0.0-1.0), reasoning }
UPDATE_ALL_AUDIO_VOLUME: { type, trackId, volumeMultiplier (e.g. 0.7 = reduce by 30%), reasoning }
TRIM_TOTAL_DURATION: { type, newDurationSeconds, reasoning }

CAPTION STYLE FIELDS:
- fontSize: number (pixels, e.g. 48)
- color: hex string (e.g. "#FFFF00" for yellow, "#FFFFFF" for white, "#000000" for black, "#FF0000" for red)
- backgroundColor: rgba string (e.g. "rgba(0,0,0,0.6)") or "transparent"
- animation: "none" | "fadeIn" | "bounce" | "pop" | "typewriter"
- position: "top" | "center" | "bottom"
- fontWeight: "normal" | "bold"

RULES:
- Only use clip IDs and track IDs that exist in the timeline summary
- For REPLACE_BROLL and ADD_BROLL, use descriptive emotional search queries for Pexels
- Times must be within the video duration
- Return ONLY valid JSON, no markdown, no explanation outside the JSON
- If the user's request is unclear, make the best reasonable interpretation

RETURN FORMAT:
{
  "operations": [...],
  "explanation": "Human readable explanation of what you're changing",
  "humanReadableSummary": "Short 1-line summary like: Changed all captions to yellow, 56px, bounce animation",
  "confidence": "high" | "medium" | "low"
}`

  const userMessage = `CURRENT TIMELINE:
${timelineSummary}

USER'S EDITING INSTRUCTION:
"${prompt}"

Return the JSON operations to fulfill this request.`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  })

  const parsed: AIEditResponse = JSON.parse(response.choices[0].message.content!)
  
  // For REPLACE_BROLL and ADD_BROLL operations, fetch actual Pexels URLs
  for (const op of parsed.operations) {
    if (op.type === 'REPLACE_BROLL' || op.type === 'ADD_BROLL') {
      const searchOp = op as ReplaceBRollOp | AddBRollOp
      try {
        const pexelsRes = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchOp.searchQuery)}&per_page=5&orientation=portrait`,
          { headers: { Authorization: pexelsApiKey } }
        )
        const pexelsData = await pexelsRes.json()
        if (pexelsData.videos?.length > 0) {
          const video = pexelsData.videos[0]
          const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0]
          searchOp.newAssetUrl = file.link
        }
      } catch (err) {
        console.error('Failed to fetch from Pexels API in aiEditService:', err)
        // If Pexels fails, operation will be skipped or handled gracefully in applyOperations
      }
    }
  }

  return parsed
}
