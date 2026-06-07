'use client';

import { VoiceProfile } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
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
      case 'kokoro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'fish_audio': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'elevenlabs': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
    }
  };

  return (
    <>
      <Card className="bg-[#0D0D0D] border-border hover:border-violet-500/50 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-white">{profile.name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className={getProviderColor(profile.provider)}>
                {profile.provider.charAt(0).toUpperCase() + profile.provider.slice(1).replace('_', ' ')}
              </Badge>
              {profile.is_default && (
                <Badge variant="outline" className="bg-violet-600/20 text-violet-400 border-violet-600/30">
                  <CheckCircle2 size={12} className="mr-1" /> Default
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white -mr-2 -mt-2">
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-border text-white">
              <DropdownMenuItem 
                disabled={profile.is_default}
                onClick={onSetDefault}
                className="cursor-pointer focus:bg-white/10"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Set as default
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10">
                <Edit2 className="mr-2 h-4 w-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent>
          <div className="mt-4 mb-2 text-xs text-muted-foreground">
            Created {formatDistanceToNow(new Date(profile.created_at))} ago
          </div>
          
          <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/5">
            <AudioPreviewPlayer src={profile.preview_url || profile.sample_url} label="Preview" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-[#0D0D0D] border-border text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Voice Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-muted-foreground text-sm">
            Are you sure you want to delete "{profile.name}"? This action cannot be undone and videos using this voice may be affected.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="border-border">Cancel</Button>
            <Button variant="destructive" onClick={() => {
              onDelete();
              setShowDeleteConfirm(false);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
