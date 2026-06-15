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
      <Card className="bg-white border border-[#E5E3EB] hover:border-[#C4B5FD] transition-all duration-300 group overflow-hidden flex flex-col rounded-2xl shadow-sm hover:shadow-md">
        <div className="relative aspect-square bg-[#F8F7FC] border-b border-[#E5E3EB]">
          {profile.preview_image_url ? (
            <img 
              src={profile.preview_image_url} 
              alt={profile.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#EDE9FE]/30 text-[#7C3AED]/40">
              <User size={56} />
            </div>
          )}

          {profile.status === 'processing' && (
            <div className="absolute inset-0 bg-[#1E1B4B]/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin mb-2" />
              <span className="text-xs font-semibold text-white tracking-wider uppercase">Processing...</span>
            </div>
          )}

          {profile.status === 'failed' && (
            <div className="absolute inset-0 bg-red-900/95 flex flex-col items-center justify-center backdrop-blur-sm p-4 text-center">
              <XCircle className="w-8 h-8 text-red-100 mb-2" />
              <span className="text-xs font-bold text-white tracking-wider uppercase">Processing Failed</span>
            </div>
          )}

          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-[#1E1B4B]/80 backdrop-blur-md text-white border-none shadow-sm px-2.5 py-0.5 rounded-lg text-[10px] font-semibold tracking-wide flex items-center gap-1">
              {profile.file_type === 'image' ? <ImageIcon size={11} /> : <Video size={11} />}
              {profile.file_type === 'image' ? 'Photo' : 'Video'}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-3.5 flex flex-row items-center justify-between mt-auto">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <h3 className="font-bold text-sm text-[#1E1B4B] truncate pr-2">{profile.name}</h3>
            {profile.is_default && (
              <div className="mt-0.5">
                <Badge variant="outline" className="bg-[#EDE9FE] text-[#7C3AED] border-[#7C3AED]/20 font-semibold text-[10px] px-2 py-0">
                  <CheckCircle2 size={10} className="mr-1" /> Default
                </Badge>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-[#78767B] hover:text-[#1E1B4B] hover:bg-[#F1F0F5] rounded-lg shrink-0">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-white border border-[#E5E3EB] text-[#1E1B4B] rounded-xl shadow-lg">
              <DropdownMenuItem 
                disabled={profile.is_default || profile.status !== 'ready'}
                onClick={onSetDefault}
                className="cursor-pointer text-xs font-medium focus:bg-[#EDE9FE] focus:text-[#7C3AED]"
              >
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Set as default
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs font-medium focus:bg-[#EDE9FE] focus:text-[#7C3AED]">
                <Edit2 className="mr-2 h-3.5 w-3.5" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 focus:text-red-500 focus:bg-red-50 focus:bg-red-500/10 cursor-pointer text-xs font-medium"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-white border border-[#E5E3EB] text-[#1E1B4B] rounded-3xl p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1E1B4B]">Delete Avatar Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[#78767B] text-sm leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-[#1E1B4B]">"{profile.name}"</span>? This action cannot be undone and videos using this avatar may be affected.
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="h-10 px-5 rounded-xl border border-[#E5E3EB] text-[#1E1B4B] hover:bg-[#F8F7FC]">Cancel</Button>
            <Button variant="destructive" onClick={() => {
              onDelete();
              setShowDeleteConfirm(false);
            }} className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
