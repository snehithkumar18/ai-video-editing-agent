'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PricingCards from '../billing/PricingCards';
import { useAuthStore } from '@/store/useAuthStore';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function UpgradeModal({ open, onClose, title = "Upgrade your plan", message = "You've reached the limits of your current plan. Upgrade to continue creating." }: UpgradeModalProps) {
  const user = useAuthStore(s => s.user);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-6xl bg-white border-[#E5E3EB] text-[#1E1B4B] overflow-hidden rounded-3xl p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-[#1E1B4B] tracking-tight">{title}</DialogTitle>
          <p className="text-sm text-[#78767B] mt-1">{message}</p>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-1 pb-4 custom-scrollbar">
          <PricingCards currentPlanId={user?.plan || 'free'} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
