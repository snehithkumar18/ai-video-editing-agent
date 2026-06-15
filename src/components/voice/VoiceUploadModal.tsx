'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Mic, UploadCloud, CheckCircle2, AlertCircle, FileAudio } from 'lucide-react';
import { VoiceProfile } from '@/lib/types';
import { formatFileSize, formatDuration } from '@/lib/utils/formatters';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

interface VoiceUploadModalProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess: (profile: VoiceProfile) => void;
  embedded?: boolean;
}

type Step = 'idle' | 'validating' | 'uploading' | 'creating' | 'complete' | 'error';

export default function VoiceUploadModal({ open = false, onClose = () => {}, onSuccess, embedded = false }: VoiceUploadModalProps) {
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

  const body = (
    <div className="py-4">
      {step === 'idle' && !file && (
        <div 
          className="upload-zone p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/webm" 
            className="hidden" 
          />
          <div className="w-14 h-14 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Mic size={24} />
          </div>
          <h3 className="font-semibold text-sm mb-1 text-[#7C3AED]">Tap to select or drag audio here</h3>
          <div className="text-xs text-[#78767B] space-y-0.5 mt-1">
            <p>WAV, MP3, or M4A</p>
            <p>(Max 25MB)</p>
          </div>
        </div>
      )}

      {step === 'idle' && file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-3 border border-[#E5E3EB] rounded-xl bg-[#F8F7FC]">
            <div className="w-10 h-10 bg-[#EDE9FE] rounded-xl flex items-center justify-center text-[#7C3AED]">
              <FileAudio size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-[#1E1B4B]">{file.name}</p>
              <p className="text-xs text-[#78767B]">
                {formatFileSize(fileInfo?.size || 0)} • {formatDuration(fileInfo?.duration)}
              </p>
            </div>
            <button 
              onClick={() => setFile(null)} 
              className="text-xs font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
            >
              Change
            </button>
          </div>

          <div>
            <label htmlFor="voiceName" className="block text-sm font-medium text-[#1E1B4B] mb-1.5">Voice Name</label>
            <input 
              id="voiceName" 
              value={voiceName} 
              onChange={(e) => setVoiceName(e.target.value)} 
              placeholder="e.g. My Podcast Voice"
              className="w-full h-11 px-4 rounded-xl border border-[#E5E3EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#B8B6BC] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
            />
          </div>

          <button 
            onClick={handleUpload} 
            disabled={!voiceName}
            className="w-full h-11 rounded-xl btn-gradient text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Voice
          </button>
        </div>
      )}

      {step === 'validating' && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-14 h-14 border-3 border-[#EDE9FE] border-t-[#7C3AED] rounded-full animate-spin mb-5" />
          <h3 className="font-medium text-base text-[#1E1B4B]">Checking your file...</h3>
          <p className="text-sm text-[#78767B] mt-1">Validating audio duration and quality</p>
        </div>
      )}

      {(step === 'uploading' || step === 'creating') && (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
          <div className="w-14 h-14 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center animate-pulse">
            <UploadCloud size={24} />
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-[#1E1B4B]">
                {step === 'uploading' ? 'Uploading file...' : 'Setting up voice profile...'}
              </span>
              <span className="text-[#7C3AED] font-semibold">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2 bg-[#EDE9FE]" indicatorColor="bg-[#7C3AED]" />
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="font-medium text-base text-[#1E1B4B]">Voice cloned successfully!</h3>
          <p className="text-sm text-[#78767B] mt-1">Your voice is ready to use in your videos.</p>
        </div>
      )}

      {step === 'error' && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
            <AlertCircle size={28} />
          </div>
          <h3 className="font-medium text-base text-[#1E1B4B] mb-1">Upload Failed</h3>
          <p className="text-sm text-red-500 mb-6 max-w-sm">{errorMsg}</p>
          <button 
            onClick={() => setStep('idle')} 
            className="h-10 px-6 rounded-xl border border-[#E5E3EB] text-sm font-medium text-[#1E1B4B] hover:bg-[#F8F7FC] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-white border-[#E5E3EB] text-[#1E1B4B] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Upload Voice Profile</DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}
