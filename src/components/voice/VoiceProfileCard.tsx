'use client';

import { VoiceProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
function formatDistanceToNowCustom(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) return 'just now';
  if (diffInMins < 60) return `${diffInMins}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${diffInDays}d`;
}
import AudioPreviewPlayer from './AudioPreviewPlayer';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface VoiceProfileCardProps {
  profile: VoiceProfile;
  onDelete: () => void;
  onSetDefault: () => void;
}

export default function VoiceProfileCard({ profile, onDelete, onSetDefault }: VoiceProfileCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getProviderColor = (provider: string) => {
    switch(provider) {
      case 'kokoro': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'fish_audio': return 'bg-pink-50 text-pink-600 border-pink-200';
      case 'elevenlabs': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-[#EDE9FE] text-[#7C3AED] border-[#7C3AED]/20';
    }
  };

  return (
    <>
      <div className="bg-white border border-[#E5E3EB] rounded-2xl p-5 hover:border-[#C4B5FD] transition-all card-hover group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-base text-[#1E1B4B]">{profile.name}</h3>
            <div className="flex gap-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getProviderColor(profile.provider)}`}>
                {profile.provider.charAt(0).toUpperCase() + profile.provider.slice(1).replace('_', ' ')}
              </span>
              {profile.is_default && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#7C3AED]/20 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Default
                </span>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#B8B6BC] hover:text-[#1E1B4B] hover:bg-[#F1F0F5] transition-colors -mr-1 -mt-1">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-[#E5E3EB] rounded-xl">
              <DropdownMenuItem 
                disabled={profile.is_default}
                onClick={onSetDefault}
                className="cursor-pointer text-[#1E1B4B]"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Set as default
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-[#1E1B4B]">
                <Edit2 className="mr-2 h-4 w-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 focus:text-red-500 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-xs text-[#78767B] mb-3">
          Created {formatDistanceToNowCustom(new Date(profile.created_at))} ago
        </div>
        
        <div className="p-3 bg-[#F8F7FC] rounded-xl border border-[#E5E3EB]">
          <AudioPreviewPlayer src={profile.preview_url || profile.sample_url} label="Preview" />
        </div>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-white border-[#E5E3EB] text-[#1E1B4B] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Delete Voice Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[#78767B] text-sm">
            Are you sure you want to delete &quot;{profile.name}&quot;? This action cannot be undone and videos using this voice may be affected.
          </div>
          <DialogFooter>
            <button 
              onClick={() => setShowDeleteConfirm(false)} 
              className="h-9 px-4 rounded-xl border border-[#E5E3EB] text-sm font-medium text-[#1E1B4B] hover:bg-[#F8F7FC] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
              className="h-9 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
