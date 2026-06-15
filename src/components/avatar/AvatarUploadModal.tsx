'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, CheckCircle2, AlertCircle, Image as ImageIcon, Video, Info } from 'lucide-react';
import { AvatarProfile } from '@/lib/types';
import { formatFileSize } from '@/lib/utils/formatters';

interface AvatarUploadModalProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess: (profile: AvatarProfile) => void;
  embedded?: boolean;
}

type Step = 'idle' | 'validating' | 'uploading' | 'creating' | 'complete' | 'error';
type FileType = 'image' | 'video';

export default function AvatarUploadModal({ open = false, onClose = () => {}, onSuccess, embedded = false }: AvatarUploadModalProps) {
  const [step, setStep] = useState<Step>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>('image');
  const [avatarName, setAvatarName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('idle');
    setFile(null);
    setAvatarName('');
    setErrorMsg('');
    setUploadProgress(0);
  };

  const handleClose = () => {
    if (step === 'uploading' || step === 'creating') return;
    resetState();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setStep('validating');
    setFileType(type);
    
    // Basic validation
    if (type === 'image' && selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg("Image must be under 10MB");
      setStep('error');
      return;
    }
    
    if (type === 'video' && selectedFile.size > 100 * 1024 * 1024) {
      setErrorMsg("Video must be under 100MB");
      setStep('error');
      return;
    }

    setFile(selectedFile);
    const defaultName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setAvatarName(defaultName);
    setStep('idle');
  };

  const handleUpload = async () => {
    if (!file || !avatarName) return;

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
            setUploadProgress(10 + Math.floor(progress * 0.8)); // Up to 90%
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
        
        xhr.open('POST', '/api/upload/avatar');
        xhr.send(formData);
      });

      if (!uploadRes.success) throw new Error(uploadRes.error);

      setStep('creating');
      setUploadProgress(95);

      const createRes = await fetch('/api/avatar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storageUrl: uploadRes.data.storageUrl,
          avatarName,
          fileType: uploadRes.data.fileType
        })
      });

      const createData = await createRes.json();
      if (!createData.success) throw new Error(createData.error);

      setStep('complete');
      setUploadProgress(100);
      
      setTimeout(() => {
        onSuccess({
          id: createData.data.avatarId,
          user_id: '',
          name: avatarName,
          file_type: uploadRes.data.fileType as 'image' | 'video' | null,
          original_asset_url: uploadRes.data.storageUrl || '',
          processed_asset_url: null,
          preview_image_url: null,
          status: 'processing',
          is_default: false,
          metadata: {},
          created_at: new Date().toISOString()
        });
        resetState();
      }, 1500);

    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred");
      setStep('error');
    }
  };

  const body = (
    <div className="py-2">
      {step === 'idle' && !file && (
        <Tabs defaultValue="image" className="w-full" onValueChange={(v) => setFileType(v as FileType)}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-background border border-border">
            <TabsTrigger value="image" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" /> Upload Photo
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Video className="w-4 h-4 mr-2" /> Upload Video
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="mt-0">
            <div className="flex flex-col md:flex-row gap-6">
              <div 
                className="flex-1 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileSelect(e, 'image')} 
                  accept="image/png,image/jpeg,image/jpg" 
                  className="hidden" 
                />
                <div className="w-12 h-12 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={24} />
                </div>
                <h3 className="font-semibold text-base mb-1 text-white">Drag your photo here</h3>
                <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
                <div className="text-[10px] text-muted-foreground">
                  <p>Accepts PNG, JPEG up to 10MB</p>
                  <p>Must have a clear, front-facing face</p>
                </div>
              </div>

              <div className="w-full md:w-56 bg-black/20 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                  <Info size={14} />
                  <span>Photo Guidelines</span>
                </div>
                <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Neutral facial expression</li>
                  <li>Good lighting, solid background</li>
                  <li>Looking directly at camera</li>
                  <li>No sunglasses, hats or masks</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-0">
            <div className="flex flex-col md:flex-row gap-6">
              <div 
                className="flex-1 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileSelect(e, 'video')} 
                  accept="video/mp4,video/quicktime,video/webm" 
                  className="hidden" 
                />
                <div className="w-12 h-12 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Video size={24} />
                </div>
                <h3 className="font-semibold text-base mb-1 text-white">Drag your video here</h3>
                <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
                <div className="text-[10px] text-muted-foreground">
                  <p>Accepts MP4, MOV up to 50MB</p>
                  <p>15-60 seconds, speaking clearly</p>
                </div>
              </div>

              <div className="w-full md:w-56 bg-black/20 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                  <Info size={14} />
                  <span>Video Guidelines</span>
                </div>
                <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Stable camera, eye level</li>
                  <li>Clear speech, minimal noise</li>
                  <li>Keep head relatively still</li>
                  <li>No background voices</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {step === 'idle' && file && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-black/20">
            <div className="bg-violet-600/20 p-3 rounded-full text-violet-400">
              {fileType === 'image' ? <ImageIcon size={24} /> : <Video size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-white">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {fileType.toUpperCase()}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-muted-foreground hover:text-white">
              Change
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarName">Avatar Name</Label>
            <Input 
              id="avatarName" 
              value={avatarName} 
              onChange={(e) => setAvatarName(e.target.value)} 
              placeholder="e.g. Professional Avatar"
              className="bg-background border-border"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleUpload} disabled={!avatarName} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
              Upload and Generate Avatar
            </Button>
          </div>
        </div>
      )}

      {step === 'validating' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 border-4 border-violet-600/20 border-t-violet-600 rounded-full animate-spin mb-6" />
          <h3 className="font-medium text-lg text-white">Checking your file...</h3>
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
                {step === 'uploading' ? 'Uploading file...' : 'Initiating avatar generation...'}
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
          <h3 className="font-medium text-lg text-white mb-2">Upload Complete!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your avatar is being processed in the background. We'll notify you when it's ready.
          </p>
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
  );

  if (embedded) {
    return body;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0D0D0D] border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}
