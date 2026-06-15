'use client';

import { useEffect, useState } from 'react';
import { useVoiceStore } from '@/store/useVoiceStore';
import { VoiceProfile } from '@/lib/types';
import VoiceProfileCard from './VoiceProfileCard';
import VoiceUploadModal from './VoiceUploadModal';
import { Mic, Plus } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl bg-[#F1F0F5]" />)}
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="h-9 px-5 rounded-xl btn-gradient text-white text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Voice Profile
        </button>
      </div>

      {voiceProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#E5E3EB] rounded-2xl text-center bg-white py-20">
          <div className="w-14 h-14 bg-[#EDE9FE] rounded-2xl flex items-center justify-center mb-4">
            <Mic className="text-[#7C3AED]" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-[#1E1B4B] mb-1">No voice profiles yet</h3>
          <p className="text-sm text-[#78767B] max-w-md mb-6">Upload an audio sample to clone your voice and use it across all your videos.</p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="h-10 px-6 rounded-xl btn-gradient text-white text-sm font-semibold"
          >
            Upload your first voice
          </button>
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
