'use client';

import { useState, useEffect } from 'react';
import { Mic, CheckCircle2, AlertCircle, RefreshCw, Volume2, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceProfile } from '@/lib/types';
import { toast } from 'sonner';

interface VoiceStudioStatusBannerProps {
  profiles: VoiceProfile[];
}

export default function VoiceStudioStatusBanner({ profiles }: VoiceStudioStatusBannerProps) {
  const [status, setStatus] = useState<{
    available: boolean;
    endpoint: string;
    protocol?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTester, setShowTester] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [testText, setTestText] = useState('Hello! This voice was cloned locally with VoiceStudio with zero cloud costs.');
  const [generating, setGenerating] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/voice/status');
      if (res.ok) {
        const json = await res.json();
        setStatus(json.data.voiceStudio);
      } else {
        setStatus({ available: false, endpoint: 'http://127.0.0.1:3900' });
      }
    } catch (err) {
      setStatus({ available: false, endpoint: 'http://127.0.0.1:3900' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    if (profiles.length > 0) {
      setSelectedVoiceId(profiles[0].id);
    }
  }, [profiles]);

  const handleTestClone = async () => {
    if (!testText.trim()) {
      toast.error('Please enter sample text to synthesize');
      return;
    }

    if (!selectedVoiceId && profiles.length > 0) {
      setSelectedVoiceId(profiles[0].id);
    }

    const voice = profiles.find((p) => p.id === selectedVoiceId) || profiles[0];
    if (!voice) {
      toast.error('Please upload or select a voice profile first');
      return;
    }

    setGenerating(true);
    setPreviewAudioUrl(null);

    try {
      const res = await fetch('/api/voice/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId: voice.id,
          text: testText,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.previewUrl) {
        setPreviewAudioUrl(json.data.previewUrl);
        toast.success('Cloned voice generated successfully!');
      } else {
        throw new Error(json.error || 'Failed to generate voice preview');
      }
    } catch (err: any) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E3EB] shadow-sm p-5 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
            <Mic size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#1E1B4B]">VoiceStudio Engine</h3>
              {loading ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium animate-pulse">
                  Checking...
                </span>
              ) : status?.available ? (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  ONLINE (Port 3900)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200">
                  <AlertCircle size={12} />
                  OFFLINE (Fallback Active)
                </span>
              )}
            </div>
            <p className="text-xs text-[#78767B] mt-0.5">
              {status?.available
                ? 'High-speed zero-shot voice cloning running locally on your computer with zero cloud fees.'
                : 'Server offline. Automatically starts when you run npm run dev.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            disabled={loading}
            className="h-8 text-xs border-[#E5E3EB] text-[#475569] hover:bg-[#F8FAFC]"
          >
            <RefreshCw size={13} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setShowTester(!showTester)}
            className="h-8 text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium"
          >
            <Sparkles size={13} className="mr-1.5" />
            {showTester ? 'Hide Clone Tester' : '⚡ Test Voice Cloning'}
          </Button>
        </div>
      </div>

      {/* Offline Command Helper */}
      {!loading && !status?.available && (
        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#64748B]" />
            <span>To start VoiceStudio server in background:</span>
            <code className="bg-white px-2 py-0.5 rounded border border-[#CBD5E1] font-mono text-[#0F172A]">
              npm run dev
            </code>
            <span>or</span>
            <code className="bg-white px-2 py-0.5 rounded border border-[#CBD5E1] font-mono text-[#0F172A]">
              python src/server/voiceStudioServer.py
            </code>
          </div>
        </div>
      )}

      {/* Interactive Quick Voice Clone Tester */}
      {showTester && (
        <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#1E1B4B] uppercase tracking-wider">
              Instant Zero-Shot Voice Clone Test
            </h4>
            <span className="text-[11px] text-[#64748B]">100% Free Local Synthesis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-[11px] font-medium text-[#475569] block mb-1">
                Target Voice Profile
              </label>
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="w-full text-xs h-8 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#1E1B4B] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              >
                {profiles.length > 0 ? (
                  profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.is_default ? '(Default)' : ''}
                    </option>
                  ))
                ) : (
                  <option value="">Default Female (af_bella)</option>
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-[#475569] block mb-1">
                Script to Synthesize
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Enter text to speak..."
                  className="flex-1 text-xs h-8 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#1E1B4B] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                />
                <Button
                  size="sm"
                  onClick={handleTestClone}
                  disabled={generating}
                  className="h-8 text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white shrink-0"
                >
                  {generating ? (
                    <>
                      <RefreshCw size={12} className="mr-1.5 animate-spin" />
                      Cloning...
                    </>
                  ) : (
                    <>
                      <Volume2 size={12} className="mr-1.5" />
                      Speak Script
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Audio Output Player */}
          {previewAudioUrl && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-xs font-medium text-[#1E1B4B]">Synthesized Speech Preview</span>
              </div>
              <audio controls src={previewAudioUrl} className="h-8 max-w-xs" autoPlay />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
