'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, CheckCircle2, AlertCircle, Image as ImageIcon, Video, Info, FileVideo } from 'lucide-react';
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
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#F8F7FC] border border-[#E5E3EB] p-1 rounded-xl">
            <TabsTrigger value="image" className="rounded-lg text-xs font-semibold text-[#78767B] data-[state=active]:bg-white data-[state=active]:text-[#7C3AED] data-[state=active]:shadow-sm">
              <ImageIcon className="w-4 h-4 mr-2" /> Photo Avatar
            </TabsTrigger>
            <TabsTrigger value="video" className="rounded-lg text-xs font-semibold text-[#78767B] data-[state=active]:bg-white data-[state=active]:text-[#7C3AED] data-[state=active]:shadow-sm">
              <Video className="w-4 h-4 mr-2" /> Video Avatar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="mt-0">
            <div className="flex flex-col md:flex-row gap-6">
              <div 
                className="flex-1 border-2 border-dashed border-[#E5E3EB] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C4B5FD] hover:bg-[#EDE9FE]/25 transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileSelect(e, 'image')} 
                  accept="image/png,image/jpeg,image/jpg" 
                  className="hidden" 
                />
                <div className="w-12 h-12 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={22} />
                </div>
                <h3 className="font-semibold text-sm mb-1 text-[#7C3AED]">Drag your photo here</h3>
                <p className="text-xs text-[#78767B] mb-3">or click to browse</p>
                <div className="text-[10px] text-[#78767B] space-y-0.5 mt-1">
                  <p>PNG, JPEG up to 10MB</p>
                  <p>Must have a clear, front-facing face</p>
                </div>
              </div>

              <div className="w-full md:w-52 bg-[#F8F7FC] border border-[#E5E3EB] rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7C3AED]">
                  <Info size={14} />
                  <span>Photo Guidelines</span>
                </div>
                <ul className="text-[10px] text-[#78767B] space-y-1.5 list-disc list-inside leading-relaxed font-medium">
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
                className="flex-1 border-2 border-dashed border-[#E5E3EB] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C4B5FD] hover:bg-[#EDE9FE]/25 transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileSelect(e, 'video')} 
                  accept="video/mp4,video/quicktime,video/webm" 
                  className="hidden" 
                />
                <div className="w-12 h-12 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Video size={22} />
                </div>
                <h3 className="font-semibold text-sm mb-1 text-[#7C3AED]">Drag your video here</h3>
                <p className="text-xs text-[#78767B] mb-3">or click to browse</p>
                <div className="text-[10px] text-[#78767B] space-y-0.5 mt-1">
                  <p>MP4, MOV up to 50MB</p>
                  <p>15-60 seconds, speaking clearly</p>
                </div>
              </div>

              <div className="w-full md:w-52 bg-[#F8F7FC] border border-[#E5E3EB] rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7C3AED]">
                  <Info size={14} />
                  <span>Video Guidelines</span>
                </div>
                <ul className="text-[10px] text-[#78767B] space-y-1.5 list-disc list-inside leading-relaxed font-medium">
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
        <div className="space-y-5">
          <div className="flex items-center gap-3.5 p-3.5 border border-[#E5E3EB] rounded-2xl bg-[#F8F7FC]">
            <div className="bg-[#EDE9FE] p-3 rounded-xl text-[#7C3AED]">
              {fileType === 'image' ? <ImageIcon size={22} /> : <FileVideo size={22} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-[#1E1B4B]">{file.name}</p>
              <p className="text-xs text-[#78767B] mt-0.5 font-medium">
                {formatFileSize(file.size)} • {fileType.toUpperCase()}
              </p>
            </div>
            <button 
              onClick={() => setFile(null)} 
              className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
            >
              Change
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="avatarName" className="text-sm font-semibold text-[#1E1B4B]">Avatar Name</Label>
            <Input 
              id="avatarName" 
              value={avatarName} 
              onChange={(e) => setAvatarName(e.target.value)} 
              placeholder="e.g. Professional Avatar"
              className="bg-white border-[#E5E3EB] rounded-xl text-[#1E1B4B] placeholder:text-[#B8B6BC] h-11 focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleUpload} disabled={!avatarName} className="btn-gradient text-white w-full h-11 rounded-xl font-semibold text-sm">
              Upload and Generate Avatar
            </Button>
          </div>
        </div>
      )}

      {step === 'validating' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 border-3 border-[#EDE9FE] border-t-[#7C3AED] rounded-full animate-spin mb-5" />
          <h3 className="font-semibold text-base text-[#1E1B4B]">Checking your file...</h3>
          <p className="text-xs text-[#78767B] mt-1">Validating file size and constraints</p>
        </div>
      )}

      {(step === 'uploading' || step === 'creating') && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
          <div className="w-14 h-14 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center animate-pulse">
            <UploadCloud size={24} />
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#1E1B4B]">
                {step === 'uploading' ? 'Uploading file...' : 'Initiating avatar generation...'}
              </span>
              <span className="text-[#7C3AED] font-bold">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2 bg-[#EDE9FE]" indicatorColor="bg-[#7C3AED]" />
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 size={26} />
          </div>
          <h3 className="font-semibold text-base text-[#1E1B4B] mb-1.5">Upload Complete!</h3>
          <p className="text-xs text-[#78767B] max-w-xs leading-relaxed font-medium">
            Your avatar is being processed in the background. We'll notify you when it's ready.
          </p>
        </div>
      )}

      {step === 'error' && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
            <AlertCircle size={26} />
          </div>
          <h3 className="font-semibold text-base text-[#1E1B4B] mb-1">Upload Failed</h3>
          <p className="text-xs text-red-500 mb-6 max-w-xs font-medium">{errorMsg}</p>
          <Button onClick={() => setStep('idle')} variant="outline" className="border-[#E5E3EB] text-[#1E1B4B] h-10 px-5 rounded-xl hover:bg-[#F8F7FC]">
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
      <DialogContent className="sm:max-w-[600px] bg-white border-[#E5E3EB] text-[#1E1B4B] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#1E1B4B] tracking-tight">Upload Avatar</DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}
