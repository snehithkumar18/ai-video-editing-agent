'use client';

import { useEffect, useState } from 'react';
import { useVoiceStore } from '@/store/useVoiceStore';
import { VoiceProfile } from '@/lib/types';
import VoiceProfileCard from './VoiceProfileCard';
import VoiceUploadModal from './VoiceUploadModal';
import { Mic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface VoiceGridProps {
  initialProfiles: VoiceProfile[];
}

export default function VoiceGrid({ initialProfiles }: VoiceGridProps) {
  const { voiceProfiles, fetchVoiceProfiles, deleteVoiceProfile, setDefault } = useVoiceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    useVoiceStore.setState({ voiceProfiles: initialProfiles });
    setInitialized(true);
  }, [initialProfiles]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/voice/${id}`, { method: 'DELETE' });
      if (res.ok) {
        deleteVoiceProfile(id);
        toast.success('Voice profile deleted');
      } else {
        toast.error('Failed to delete voice profile');
      }
    } catch (e) {
      toast.error('Failed to delete voice profile');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/voice/default`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voiceId: id })
      });
      if (res.ok) {
        setDefault(id);
        toast.success('Default voice updated');
      } else {
        toast.error('Failed to update default voice');
      }
    } catch (e) {
      toast.error('Failed to update default voice');
    }
  };

  if (!initialized) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl bg-[#0D0D0D]" />)}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
          <Plus size={18} /> Add Voice Profile
        </Button>
      </div>

      {voiceProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voiceProfiles.map(profile => (
            <VoiceProfileCard 
              key={profile.id} 
              profile={profile} 
              onDelete={() => handleDelete(profile.id)}
              onSetDefault={() => handleSetDefault(profile.id)}
            />
          ))}
        </div>
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg text-center bg-[#0D0D0D] py-24">
          <div className="bg-violet-600/20 p-4 rounded-full mb-4">
            <Mic className="text-violet-400 w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium mb-2">No voice profiles yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">Upload an audio sample to clone your voice and use it across all your videos.</p>
          <Button onClick={() => setIsModalOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
            Upload your first voice
          </Button>
        </div>
      )}

      <VoiceUploadModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(profile) => {
          useVoiceStore.getState().addVoiceProfile(profile);
          setIsModalOpen(false);
          toast.success('Voice profile created');
        }} 
      />
    </>
  );
}
