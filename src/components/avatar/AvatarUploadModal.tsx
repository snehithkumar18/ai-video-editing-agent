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
  open: boolean;
  onClose: () => void;
  onSuccess: (profile: AvatarProfile) => void;
}

type Step = 'idle' | 'validating' | 'uploading' | 'creating' | 'complete' | 'error';
type FileType = 'image' | 'video';

export default function AvatarUploadModal({ open, onClose, onSuccess }: AvatarUploadModalProps) {
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
      
      // Don't wait for processing, just close and show in grid as processing
      setTimeout(() => {
        onSuccess({
          id: createData.data.avatarId,
          user_id: '',
          name: avatarName,
          type: uploadRes.data.fileType,
          status: 'processing',
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as AvatarProfile);
        resetState();
      }, 1500);

    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred");
      setStep('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0D0D0D] border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {step === 'idle' && !file && (
            <Tabs defaultValue="image" className="w-full">
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
                    onClick={() => {
                      setFileType('image');
                      fileInputRef.current?.click();
                    }}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => handleFileSelect(e, fileType)} 
                      accept={fileType === 'image' ? "image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime"} 
                      className="hidden" 
                    />
                    <div className="w-16 h-16 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-white">Upload Photo</h3>
                    <p className="text-sm text-muted-foreground mb-4">Click to browse or drag</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>JPG, PNG, WEBP</p>
                      <p>Max 10MB</p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-48 bg-background border border-border rounded-xl p-4">
                    <h4 className="font-medium text-sm text-white mb-3 flex items-center"><Info className="w-4 h-4 mr-1.5 text-violet-400" /> Tips for Photos</h4>
                    <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 marker:text-violet-500/50">
                      <li>Face must be clearly visible</li>
                      <li>Good lighting, avoid shadows</li>
                      <li>Look directly at camera</li>
                      <li>Single person only</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="video" className="mt-0">
                <div className="flex flex-col md:flex-row gap-6">
                  <div 
                    className="flex-1 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors group"
                    onClick={() => {
                      setFileType('video');
                      fileInputRef.current?.click();
                    }}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => handleFileSelect(e, fileType)} 
                      accept={fileType === 'image' ? "image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime"} 
                      className="hidden" 
                    />
                    <div className="w-16 h-16 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Video size={32} />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-white">Upload Video</h3>
                    <p className="text-sm text-muted-foreground mb-4">Click to browse or drag</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>MP4, MOV</p>
                      <p>Max 100MB</p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-48 bg-background border border-border rounded-xl p-4">
                    <h4 className="font-medium text-sm text-white mb-3 flex items-center"><Info className="w-4 h-4 mr-1.5 text-violet-400" /> Tips for Videos</h4>
                    <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 marker:text-violet-500/50">
                      <li>Maximum 30 seconds</li>
                      <li>Keep head relatively still</li>
                      <li>Well-lit, minimal background movement</li>
                      <li>Single person only</li>
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
                    {formatFileSize(file.size)} • {fileType === 'image' ? 'Photo' : 'Video'}
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
                  placeholder="e.g. Studio Setup"
                  className="bg-background border-border"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleUpload} disabled={!avatarName} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
                  Create Avatar Profile
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
      </DialogContent>
    </Dialog>
  );
}
