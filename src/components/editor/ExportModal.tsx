'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Download, MonitorPlay, Smartphone, Square, CheckCircle2, AlertCircle, Share2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export default function ExportModal({ open, onClose, projectId }: ExportModalProps) {
  const [quality, setQuality] = useState('1080p');
  const [format, setFormat] = useState('mp4');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  
  const [step, setStep] = useState<'config' | 'rendering' | 'complete' | 'error'>('config');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [finalUrl, setFinalUrl] = useState('');
  
  const user = useAuthStore(s => s.user);
  const pollingRef = useRef<any>(null);

  const creditsCost = quality === '4K' ? 4 : quality === '1080p' ? 2 : 1;
  const creditsRemaining = user?.render_credits || 0;
  const canAfford = user?.plan === 'agency' || creditsRemaining >= creditsCost;

  const handleExport = async () => {
    if (!canAfford) return;
    
    setStep('rendering');
    setProgress(0);

    try {
      const res = await fetch('/api/project/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, quality, format, aspectRatio })
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Start polling
      pollingRef.current = setInterval(async () => {
        const statusRes = await fetch(`/api/video/status/${projectId}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.success) {
            setProgress(statusData.data.render_progress || 0);
            
            if (statusData.data.status === 'complete' || (statusData.data.render_progress === 100 && statusData.data.final_video_url)) {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setFinalUrl(statusData.data.final_video_url);
              setStep('complete');
            } else if (statusData.data.status === 'failed') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setErrorMsg(statusData.data.error_message || 'Rendering failed');
              setStep('error');
            }
          }
        }
      }, 2000);

    } catch (err) {
      setErrorMsg((err as Error).message || 'Export failed');
      setStep('error');
    }
  };

  const handleClose = () => {
    if (step === 'rendering') return;
    setStep('config');
    setProgress(0);
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0D0D0D] border-border text-foreground">
        <DialogHeader>
          <DialogTitle>{step === 'config' ? 'Export Video' : step === 'rendering' ? 'Rendering...' : step === 'complete' ? 'Export Complete' : 'Export Failed'}</DialogTitle>
        </DialogHeader>

        {step === 'config' && (
          <div className="py-4 space-y-6">
            {/* Aspect Ratio */}
            <div className="space-y-3">
              <Label className="text-gray-400">Aspect Ratio</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '9:16', icon: Smartphone, label: 'Vertical' },
                  { id: '16:9', icon: MonitorPlay, label: 'Horizontal' },
                  { id: '1:1', icon: Square, label: 'Square' }
                ].map(ar => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all ${
                      aspectRatio === ar.id 
                        ? 'border-violet-500 bg-violet-500/10 text-violet-400' 
                        : 'border-border bg-black hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    <ar.icon size={24} className="mb-2" />
                    <span className="text-xs font-medium">{ar.label}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">{ar.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality & Format */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-gray-400">Quality</Label>
                <RadioGroup value={quality} onValueChange={setQuality}>
                  <div className="flex items-center space-x-2 border border-border p-2 rounded-md bg-black">
                    <RadioGroupItem value="720p" id="720p" />
                    <Label htmlFor="720p" className="flex-1 cursor-pointer">SD (720p) <span className="text-xs text-gray-500 ml-1">1 credit</span></Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border p-2 rounded-md bg-black">
                    <RadioGroupItem value="1080p" id="1080p" />
                    <Label htmlFor="1080p" className="flex-1 cursor-pointer">HD (1080p) <span className="text-xs text-gray-500 ml-1">2 credits</span></Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border p-2 rounded-md bg-black opacity-60">
                    <RadioGroupItem value="4K" id="4K" disabled />
                    <Label htmlFor="4K" className="flex-1 cursor-pointer">4K <span className="text-[10px] text-violet-400 ml-1 border border-violet-500/30 px-1 rounded">PRO</span></Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-400">Format</Label>
                <RadioGroup value={format} onValueChange={setFormat}>
                  <div className="flex items-center space-x-2 border border-border p-2 rounded-md bg-black">
                    <RadioGroupItem value="mp4" id="mp4" />
                    <Label htmlFor="mp4" className="flex-1 cursor-pointer">MP4</Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border p-2 rounded-md bg-black">
                    <RadioGroupItem value="webm" id="webm" />
                    <Label htmlFor="webm" className="flex-1 cursor-pointer">WebM</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Cost summary */}
            <div className={`p-4 rounded-lg border flex items-center justify-between ${canAfford ? 'bg-violet-500/10 border-violet-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div>
                <p className="text-sm font-medium text-white">Export Cost</p>
                <p className={`text-xs ${canAfford ? 'text-violet-400' : 'text-red-400'}`}>
                  You have {user?.plan === 'agency' ? 'unlimited' : creditsRemaining} credits
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">{creditsCost} <span className="text-sm font-normal text-gray-400">credits</span></p>
              </div>
            </div>
          </div>
        )}

        {step === 'rendering' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-24 h-24">
              <svg className="animate-spin w-full h-full text-violet-500/20" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" stroke="currentColor" strokeDasharray="283" strokeDashoffset="0" />
              </svg>
              <svg className="absolute top-0 left-0 animate-[spin_2s_linear_infinite] w-full h-full text-violet-500" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" stroke="currentColor" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} className="transition-all duration-500 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-white">{progress}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Processing video...</p>
              <p className="text-sm text-gray-400 mt-1">Applying effects and burning captions</p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to share!</h3>
            <p className="text-gray-400 text-sm max-w-[280px] mx-auto mb-8">
              Your video has been successfully exported in {quality} quality.
            </p>
            
            <a 
              href={finalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              download
              className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2 h-12 text-base mb-4 flex items-center justify-center rounded-lg font-medium transition-colors"
            >
              <Download size={18} /> Download Video
            </a>
            
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="w-10 h-10 border-gray-700 hover:bg-white/5 rounded-full" title="Share link">
                <Share2 size={16} />
              </Button>
              <Button variant="outline" size="icon" className="w-10 h-10 border-gray-700 hover:bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white" title="Share to Twitter">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </Button>
              <Button variant="outline" size="icon" className="w-10 h-10 border-gray-700 hover:bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white" title="Share to Facebook">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              </Button>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Export Failed</h3>
            <p className="text-red-400 text-sm max-w-[280px] mx-auto mb-8">{errorMsg}</p>
            <Button onClick={() => setStep('config')} variant="outline" className="border-gray-700">
              Try Again
            </Button>
          </div>
        )}

        {step === 'config' && (
          <DialogFooter className="pt-4 border-t border-border mt-2">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleExport} 
              disabled={!canAfford}
              className="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]"
            >
              Start Export
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
