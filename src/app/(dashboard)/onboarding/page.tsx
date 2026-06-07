'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Mic, UserSquare, Video, ArrowRight } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="max-w-2xl w-full">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-1.5 w-16 rounded-full transition-colors ${s <= step ? 'bg-violet-600' : 'bg-white/10'}`} 
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-violet-600/20 text-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
              <Sparkles size={40} />
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight">Welcome to VidAgent</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Let's set up your digital identity. In the next few steps, you'll create an AI clone of your voice and face to generate videos instantly.
            </p>

            <div className="pt-8">
              <Button onClick={() => setStep(2)} size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 text-lg h-14 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all">
                Let's Start <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Voice */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-3">Clone Your Voice</h2>
              <p className="text-muted-foreground">Upload a 15-second audio clip of you speaking clearly.</p>
            </div>

            <Card className="p-6 bg-[#0D0D0D] border-border">
              <VoiceUploadModal 
                onSuccess={() => setStep(3)} 
                embedded 
              />
            </Card>

            <div className="flex justify-between items-center px-4">
              <Button variant="ghost" className="text-gray-500" onClick={() => setStep(1)}>Back</Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setStep(3)}>Skip for now</Button>
            </div>
          </div>
        )}

        {/* Step 3: Avatar */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserSquare size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-3">Create Your Avatar</h2>
              <p className="text-muted-foreground">Upload a clear photo or short video of your face.</p>
            </div>

            <Card className="p-6 bg-[#0D0D0D] border-border">
              <AvatarUploadModal 
                onSuccess={() => setStep(4)} 
                embedded 
              />
            </Card>

            <div className="flex justify-between items-center px-4">
              <Button variant="ghost" className="text-gray-500" onClick={() => setStep(2)}>Back</Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setStep(4)}>Skip for now</Button>
            </div>
          </div>
        )}

        {/* Step 4: First Project */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-fuchsia-500/20 text-fuchsia-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-3">You're All Set!</h2>
              <p className="text-muted-foreground">Let's create your first AI video project.</p>
            </div>

            <Card className="p-6 bg-[#0D0D0D] border-border flex flex-col items-center justify-center py-12">
              <CreateProjectModal 
                trigger={
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 text-lg">
                    Create First Project
                  </Button>
                }
              />
            </Card>

            <div className="flex justify-center mt-8">
              <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={handleComplete}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
