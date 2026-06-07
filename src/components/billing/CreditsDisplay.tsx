'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function CreditsDisplay() {
  const user = useAuthStore(s => s.user);

  if (!user || user.plan === 'agency') return null;

  const maxCredits = user.plan === 'pro' ? 40 : user.plan === 'starter' ? 15 : 5;
  const credits = user.render_credits ?? 0;
  
  const percent = Math.min(100, Math.max(0, (credits / maxCredits) * 100));
  
  const isLow = credits <= 2 && credits > 0;
  const isEmpty = credits === 0;

  return (
    <div className="px-4 py-4 border-t border-border mt-auto shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white flex items-center gap-1.5">
          <Zap size={14} className={isEmpty ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-violet-400'} />
          Credits
        </span>
        <span className="text-xs text-gray-400 font-mono">{credits} / {maxCredits}</span>
      </div>
      
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full rounded-full ${isEmpty ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-violet-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {(isLow || isEmpty) && (
        <Link href="/billing" className={`text-xs block text-center py-1.5 rounded-md ${isEmpty ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'} transition-colors`}>
          {isEmpty ? 'Upgrade to generate' : 'Running low. Buy more?'}
        </Link>
      )}
    </div>
  );
}
