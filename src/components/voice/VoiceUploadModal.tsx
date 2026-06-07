'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Mic, UploadCloud, CheckCircle2, AlertCircle, FileAudio } from 'lucide-react';
import { VoiceProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatFileSize, formatDuration } from '@/lib/utils/formatters';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

interface VoiceUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (profile: VoiceProfile) => void;
}

type Step = 'idle' | 'validating' | 'uploading' | 'creating' | 'complete' | 'error';

export default function VoiceUploadModal({ open, onClose, onSuccess }: VoiceUploadModalProps) {
  const [step, setStep] = useState<Step>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{ duration: number; size: number } | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('idle');
    setFile(null);
    setFileInfo(null);
    setVoiceName('');
    setErrorMsg('');
    setUploadProgress(0);
  };

  const handleClose = () => {
    if (step === 'uploading' || step === 'creating') return;
    resetState();
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setStep('validating');
    
    try {
      const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextCtor) throw new Error('AudioContext is not supported in this browser');
      const audioContext = new AudioContextCtor();
      const arrayBuffer = await selectedFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const duration = audioBuffer.duration;
      
      if (duration < 15) {
        throw new Error("Recording must be at least 15 seconds long");
      }
      if (duration > 180) {
        throw new Error("Recording must be under 3 minutes");
      }

      setFile(selectedFile);
      setFileInfo({ duration, size: selectedFile.size });
      
      const defaultName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setVoiceName(defaultName);
      setStep('idle');
    } catch (err) {
      setErrorMsg((err as Error).message || "Invalid audio file format");
      setStep('error');
    }
  };

  const handleUpload = async () => {
    if (!file || !voiceName) return;

    setStep('uploading');
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            // Scale to 80% max for upload phase
            setUploadProgress(10 + Math.floor(progress * 0.7));
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Network error')));
        
        xhr.open('POST', '/api/upload/voice');
        xhr.send(formData);
      });

      if (!uploadRes.success) throw new Error(uploadRes.error);

      setStep('creating');
      setUploadProgress(90);

      const createRes = await fetch('/api/voice/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storageUrl: uploadRes.data.storageUrl,
          voiceName,
        })
      });

      const createData = await createRes.json();
      if (!createData.success) throw new Error(createData.error);

      setStep('complete');
      setUploadProgress(100);
      
      setTimeout(() => {
        onSuccess(createData.data);
        resetState();
      }, 1500);

    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred");
      setStep('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0D0D0D] border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Upload Voice Profile</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {step === 'idle' && !file && (
            <div 
              className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/webm" 
                className="hidden" 
              />
              <div className="w-16 h-16 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-1 text-white">Drag your audio file here</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Accepts MP3, WAV, M4A</p>
                <p>Minimum 15 seconds, maximum 3 minutes</p>
              </div>
            </div>
          )}

          {step === 'idle' && file && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-black/20">
                <div className="bg-violet-600/20 p-3 rounded-full text-violet-400">
                  <FileAudio size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-white">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(fileInfo?.size || 0)} • {formatDuration(fileInfo?.duration)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-muted-foreground hover:text-white">
                  Change
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voiceName">Voice Name</Label>
                <Input 
                  id="voiceName" 
                  value={voiceName} 
                  onChange={(e) => setVoiceName(e.target.value)} 
                  placeholder="e.g. My Podcast Voice"
                  className="bg-background border-border"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleUpload} disabled={!voiceName} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
                  Upload Voice
                </Button>
              </div>
            </div>
          )}

          {step === 'validating' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 border-4 border-violet-600/20 border-t-violet-600 rounded-full animate-spin mb-6" />
              <h3 className="font-medium text-lg text-white">Checking your file...</h3>
              <p className="text-sm text-muted-foreground mt-2">Validating audio duration and quality</p>
            </div>
          )}

          {(step === 'uploading' || step === 'creating') && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              <div className="w-16 h-16 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center animate-pulse">
                <UploadCloud size={32} />
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white">
                    {step === 'uploading' ? 'Uploading file...' : 'Setting up voice profile...'}
                  </span>
                  <span className="text-violet-400">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-white/10" indicatorColor="bg-violet-600" />
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-medium text-lg text-white">Voice cloned successfully!</h3>
              <p className="text-sm text-muted-foreground mt-2">Your voice is ready to use in your videos.</p>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="font-medium text-lg text-white mb-2">Upload Failed</h3>
              <p className="text-sm text-red-400 mb-8 max-w-sm">{errorMsg}</p>
              <Button onClick={() => setStep('idle')} variant="outline" className="border-border">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
