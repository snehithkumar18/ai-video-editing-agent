'use client';

import { useEffect, useState, useRef } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import { AvatarProfile } from '@/lib/types';
import AvatarCard from './AvatarCard';
import AvatarUploadModal from './AvatarUploadModal';
import { User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface AvatarGridProps {
  initialProfiles: AvatarProfile[];
}

export default function AvatarGrid({ initialProfiles }: AvatarGridProps) {
  const { avatarProfiles, deleteAvatarProfile, setDefault } = useAvatarStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    useAvatarStore.setState({ avatarProfiles: initialProfiles });
    setInitialized(true);
  }, [initialProfiles]);

  useEffect(() => {
    const processingAvatars = avatarProfiles.filter(p => p.status === 'processing');
    
    if (processingAvatars.length > 0) {
      pollingRef.current = setInterval(async () => {
        let hasChanges = false;
        const updatedProfiles = await Promise.all(avatarProfiles.map(async (profile) => {
          if (profile.status !== 'processing') return profile;
          
          try {
            const res = await fetch(`/api/avatar/${profile.id}/status`);
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.data.status !== 'processing') {
                hasChanges = true;
                if (data.data.status === 'ready') toast.success(`Avatar "${profile.name}" is ready!`);
                if (data.data.status === 'failed') toast.error(`Avatar "${profile.name}" processing failed.`);
                return { ...profile, ...data.data };
              }
            }
          } catch (e) {
            console.error('Polling error', e);
          }
          return profile;
        }));

        if (hasChanges) {
          useAvatarStore.setState({ avatarProfiles: updatedProfiles });
        }
      }, 3000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [avatarProfiles]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/avatar/${id}`, { method: 'DELETE' });
      if (res.ok) {
        deleteAvatarProfile(id);
        toast.success('Avatar profile deleted');
      } else {
        toast.error('Failed to delete avatar profile');
      }
    } catch (e) {
      toast.error('Failed to delete avatar profile');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/avatar/default`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarId: id })
      });
      if (res.ok) {
        setDefault(id);
        toast.success('Default avatar updated');
      } else {
        toast.error('Failed to update default avatar');
      }
    } catch (e) {
      toast.error('Failed to update default avatar');
    }
  };

  if (!initialized) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-xl bg-[#0D0D0D]" />)}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
          <Plus size={18} /> Add Avatar
        </Button>
      </div>

      {avatarProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {avatarProfiles.map(profile => (
            <AvatarCard 
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
            <User className="text-violet-400 w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium mb-2">No avatars yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">Upload a photo or video to create your AI presenter.</p>
          <Button onClick={() => setIsModalOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
            Upload your first avatar
          </Button>
        </div>
      )}

      <AvatarUploadModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(profile) => {
          useAvatarStore.getState().addAvatarProfile(profile);
          setIsModalOpen(false);
          toast.success('Avatar profile created');
        }} 
      />
    </>
  );
}
