'use client';

import { AvatarProfile } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, CheckCircle2, Edit2, Trash2, User, Loader2, XCircle, Image as ImageIcon, Video } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface AvatarCardProps {
  profile: AvatarProfile;
  onDelete: () => void;
  onSetDefault: () => void;
}

export default function AvatarCard({ profile, onDelete, onSetDefault }: AvatarCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <Card className="bg-[#0D0D0D] border-border hover:border-violet-500/50 transition-all duration-300 group overflow-hidden flex flex-col">
        <div className="relative aspect-square bg-black border-b border-border">
          {profile.preview_image_url ? (
            <img 
              src={profile.preview_image_url} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-violet-900/10 text-violet-500/50">
              <User size={64} />
            </div>
          )}

          {profile.status === 'processing' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-2" />
              <span className="text-sm font-medium text-white">Processing...</span>
            </div>
          )}

          {profile.status === 'failed' && (
            <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center backdrop-blur-sm p-4 text-center">
              <XCircle className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-sm font-medium text-white mb-1">Processing Failed</span>
            </div>
          )}

          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-white/10 shadow-lg">
              {profile.type === 'image' ? <ImageIcon size={12} className="mr-1" /> : <Video size={12} className="mr-1" />}
              {profile.type === 'image' ? 'Photo' : 'Video'}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-4 flex flex-row items-center justify-between mt-auto">
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <h3 className="font-bold text-base text-white truncate pr-2">{profile.name}</h3>
            {profile.is_default && (
              <div>
                <Badge variant="outline" className="bg-violet-600/20 text-violet-400 border-violet-600/30 font-normal">
                  <CheckCircle2 size={12} className="mr-1" /> Default
                </Badge>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white shrink-0">
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-border text-white">
              <DropdownMenuItem 
                disabled={profile.is_default || profile.status !== 'ready'}
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
      </Card>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-[#0D0D0D] border-border text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Avatar Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-muted-foreground text-sm">
            Are you sure you want to delete "{profile.name}"? This action cannot be undone and videos using this avatar may be affected.
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
