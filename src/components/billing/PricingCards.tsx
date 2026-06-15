'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import { PLANS } from '@/lib/stripe';
import logger from '@/lib/logger';

interface PricingCardsProps {
  currentPlanId: string;
}

export default function PricingCards({ currentPlanId }: PricingCardsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string | null | undefined) => {
    if (!priceId) {
      window.location.href = 'mailto:support@vidagent.app?subject=Downgrade to Free';
      return;
    }

    setIsLoading(priceId);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e) {
      logger.error(e);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanDetails = (planKey: string) => {
    switch(planKey) {
      case 'free': return { desc: 'Perfect for trying out the platform', features: ['5 renders per month', '1 Voice & 1 Avatar', 'VidAgent Watermark', '720p Export Quality'] };
      case 'starter': return { desc: 'For consistent content creators', features: ['15 renders per month', '3 Voices & 3 Avatars', 'No Watermark', '1080p Export Quality', 'Priority Queue'] };
      case 'pro': return { desc: 'For professional marketers', features: ['40 renders per month', '10 Voices & 10 Avatars', 'No Watermark', '4K Export Quality', 'API Access'] };
      case 'agency': return { desc: 'For high-volume teams', features: ['Unlimited renders', 'Unlimited Profiles', 'No Watermark', '4K Export Quality', 'Dedicated Support'] };
      default: return { desc: '', features: [] };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(PLANS).map(([key, plan]) => {
        const details = getPlanDetails(key);
        const isCurrent = currentPlanId === key;

        return (
          <div 
            key={key} 
            className={`flex flex-col p-6 rounded-xl border bg-[#0D0D0D] relative ${
              isCurrent ? 'border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.1)]' : 'border-border'
            }`}
          >
            {isCurrent && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Current Plan
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-400 min-h-[40px]">{details.desc}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
            </div>

            <div className="flex-1">
              <ul className="space-y-3 mb-8">
                {details.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-violet-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={() => handleCheckout(plan.priceId)}
              disabled={isCurrent || isLoading === plan.priceId}
              variant={isCurrent ? 'outline' : (key === 'starter' ? 'default' : 'secondary')}
              className={`w-full ${key === 'starter' && !isCurrent ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''}`}
            >
              {isLoading === plan.priceId ? (
                'Loading...'
              ) : isCurrent ? (
                'Current Plan'
              ) : plan.price === 0 ? (
                'Downgrade'
              ) : (
                <span className="flex items-center gap-2">Upgrade <Zap size={14} className={key==='starter' ? 'fill-white/20' : ''} /></span>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
