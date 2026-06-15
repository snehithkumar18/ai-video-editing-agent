'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, Mic, UserSquare, Video, ArrowRight, Shield } from 'lucide-react';

import VoiceUploadModal from '@/components/voice/VoiceUploadModal';
import AvatarUploadModal from '@/components/avatar/AvatarUploadModal';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const supabase = createClient();

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-1.5 w-10 rounded-full transition-colors ${s <= step ? 'bg-[#7C3AED]' : 'bg-[#E5E3EB]'}`} 
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-[#EDE9FE] text-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-200/50">
              <Sparkles size={32} />
            </div>
            
            <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">Welcome to VidAgent AI</h1>
            <p className="text-[#78767B] max-w-sm mx-auto leading-relaxed">
              Let&apos;s set up your digital identity. In the next few steps, you&apos;ll create an AI clone of your voice and face.
            </p>

            <div className="pt-4">
              <button 
                onClick={() => setStep(2)} 
                className="h-12 px-8 rounded-xl btn-gradient text-white font-semibold text-sm inline-flex items-center gap-2"
              >
                Let&apos;s Start <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Voice Clone */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-[#E5E3EB] p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#1E1B4B] mb-1">Clone Your Voice</h2>
                <p className="text-sm text-[#78767B]">
                  Upload a 30-second audio clip of yourself speaking for the most accurate AI clone.
                </p>
              </div>

              {/* Upload Area */}
              <div className="upload-zone p-8 flex flex-col items-center text-center cursor-pointer mb-4">
                <div className="w-14 h-14 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center mb-3">
                  <Mic size={24} />
                </div>
                <p className="text-sm font-medium text-[#7C3AED] mb-1">
                  Tap to select or drag audio here
                </p>
                <p className="text-xs text-[#78767B]">
                  WAV, MP3, or M4A (Max 25MB)
                </p>
              </div>

              <VoiceUploadModal 
                onSuccess={() => setStep(3)} 
                embedded 
              />

              {/* Security Notice */}
              <div className="flex items-start gap-3 mt-4 p-3 bg-[#F8F7FC] rounded-xl">
                <Shield size={16} className="text-[#7C3AED] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#78767B] leading-relaxed">
                  Your voice data is encrypted and used only for your personal AI avatar. We never share your biometric data.
                </p>
              </div>
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-[#78767B]">
              Don&apos;t have a recording?{' '}
              <button className="text-[#7C3AED] font-semibold hover:text-[#6D28D9]">Record one now</button>
            </p>

            <div className="flex justify-between items-center">
              <button className="text-sm text-[#78767B] hover:text-[#1E1B4B] transition-colors" onClick={() => setStep(1)}>Back</button>
              <button className="text-sm text-[#78767B] hover:text-[#7C3AED] transition-colors" onClick={() => setStep(3)}>Skip for now</button>
            </div>
          </div>
        )}

        {/* Step 3: Avatar */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E3EB] p-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserSquare size={28} />
                </div>
                <h2 className="text-xl font-bold text-[#1E1B4B] mb-1">Create Your Avatar</h2>
                <p className="text-sm text-[#78767B]">Upload a clear photo or short video of your face.</p>
              </div>

              <AvatarUploadModal 
                onSuccess={() => setStep(4)} 
                embedded 
              />
            </div>

            <div className="flex justify-between items-center">
              <button className="text-sm text-[#78767B] hover:text-[#1E1B4B] transition-colors" onClick={() => setStep(2)}>Back</button>
              <button className="text-sm text-[#78767B] hover:text-[#7C3AED] transition-colors" onClick={() => setStep(4)}>Skip for now</button>
            </div>
          </div>
        )}

        {/* Step 4: First Project */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E3EB] p-6 flex flex-col items-center text-center py-10">
              <div className="w-14 h-14 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center mb-4">
                <Video size={28} />
              </div>
              <h2 className="text-xl font-bold text-[#1E1B4B] mb-1">You&apos;re All Set!</h2>
              <p className="text-sm text-[#78767B] mb-6">Let&apos;s create your first AI video project.</p>

              <CreateProjectModal 
                trigger={
                  <button className="h-12 px-8 rounded-xl btn-gradient text-white font-semibold text-sm inline-flex items-center gap-2">
                    Create First Project
                  </button>
                }
              />
            </div>

            <div className="flex justify-center">
              <button 
                className="text-sm text-[#78767B] hover:text-[#7C3AED] transition-colors" 
                onClick={handleComplete}
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
