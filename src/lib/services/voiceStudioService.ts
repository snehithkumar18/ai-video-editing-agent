import logger from '@/lib/logger';

const DEFAULT_VOICESTUDIO_URL = process.env.VOICESTUDIO_API_URL || 'http://127.0.0.1:3900';

export interface VoiceStudioHealth {
  available: boolean;
  endpoint: string;
  protocol?: string;
  error?: string;
}

export interface VoiceStudioCloneOptions {
  text: string;
  referenceAudioBuffer: Buffer;
  referenceAudioMime?: string;
  language?: string;
  speed?: number;
  engine?: 'omnivoice' | 'cosyvoice' | 'voxcpm2';
}

/**
 * Checks whether VoiceStudio local backend is running and reachable.
 */
export async function checkVoiceStudioHealth(baseUrl = DEFAULT_VOICESTUDIO_URL): Promise<VoiceStudioHealth> {
  try {
    const res = await fetch(`${baseUrl}/.well-known/voicestudio-speech`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        available: true,
        endpoint: baseUrl,
        protocol: data.protocol || 'voicestudio.speech.v1',
      };
    }

    // Fallback health check
    const healthRes = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });

    return {
      available: healthRes.ok,
      endpoint: baseUrl,
    };
  } catch (err: any) {
    return {
      available: false,
      endpoint: baseUrl,
      error: err.message,
    };
  }
}

/**
 * Clones a voice from a reference audio sample and synthesizes new speech text using VoiceStudio.
 * Uses VoiceStudio's local OmniVoice / CosyVoice engine.
 */
export async function cloneAndSynthesizeVoiceStudio(
  options: VoiceStudioCloneOptions,
  baseUrl = DEFAULT_VOICESTUDIO_URL
): Promise<{ audioBuffer: Buffer; provider: string }> {
  const { text, referenceAudioBuffer, referenceAudioMime = 'audio/wav', language = 'Auto', speed = 1.0, engine } = options;

  logger.info(`[VoiceStudio] Requesting voice cloning for ${text.length} chars via ${baseUrl}`);

  const refBase64 = referenceAudioBuffer.toString('base64');
  const refDataUri = `data:${referenceAudioMime};base64,${refBase64}`;

  // Method A: Standard VoiceStudio v1/audio/speech endpoint (ElevenLabs/OpenAI compatible format with voice clone extension)
  try {
    const payload = {
      model: engine || 'omnivoice',
      input: text,
      voice: refDataUri,
      language: language,
      speed: speed,
      response_format: 'wav',
    };

    const res = await fetch(`${baseUrl}/v1/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000), // cloning can take 5-15s
    });

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);
      logger.info(`[VoiceStudio] Successfully synthesized ${audioBuffer.length} bytes via /v1/audio/speech`);
      return { audioBuffer, provider: 'voicestudio_local' };
    }
  } catch (err: any) {
    logger.warn(`[VoiceStudio] /v1/audio/speech call failed, trying MCP endpoint:`, err.message);
  }

  // Method B: VoiceStudio MCP JSON-RPC endpoint at /mcp
  try {
    // 1. Clone voice tool
    const cloneRpc = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: 'clone_voice',
        arguments: {
          reference_audio: refBase64,
        },
      },
    };

    const cloneRes = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cloneRpc),
      signal: AbortSignal.timeout(30000),
    });

    if (cloneRes.ok) {
      const cloneData = await cloneRes.json();
      const profileId = cloneData?.result?.profile_id || cloneData?.result?.content?.[0]?.text;

      if (profileId) {
        // 2. Generate speech with the cloned profile
        const genRpc = {
          jsonrpc: '2.0',
          id: Date.now() + 1,
          method: 'tools/call',
          params: {
            name: 'generate_speech',
            arguments: {
              text: text,
              profile_id: profileId,
              format: 'wav',
              language: language,
            },
          },
        };

        const genRes = await fetch(`${baseUrl}/mcp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(genRpc),
          signal: AbortSignal.timeout(60000),
        });

        if (genRes.ok) {
          const genData = await genRes.json();
          const wavBase64 = genData?.result?.wav_base64 || genData?.result?.content?.[0]?.data;
          if (wavBase64) {
            const audioBuffer = Buffer.from(wavBase64, 'base64');
            logger.info(`[VoiceStudio] Successfully synthesized ${audioBuffer.length} bytes via MCP tool`);
            return { audioBuffer, provider: 'voicestudio_mcp' };
          }
        }
      }
    }
  } catch (mcpErr: any) {
    logger.error(`[VoiceStudio] MCP cloning failed:`, mcpErr);
  }

  throw new Error(`VoiceStudio is unreachable at ${baseUrl} or generation failed.`);
}

/**
 * Designs a brand new voice from a text description using VoiceStudio.
 */
export async function designVoiceVoiceStudio(
  description: string,
  baseUrl = DEFAULT_VOICESTUDIO_URL
): Promise<string> {
  const rpc = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: 'design_voice',
      arguments: { description },
    },
  };

  const res = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rpc),
  });

  if (!res.ok) throw new Error(`VoiceStudio design_voice failed: ${res.statusText}`);
  const data = await res.json();
  return data?.result?.profile_id || 'voice_designed';
}
