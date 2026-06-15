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
            className={`flex flex-col p-6 rounded-2xl border bg-white relative transition-all duration-300 ${
              isCurrent 
                ? 'border-[#7C3AED] shadow-[0_0_24px_rgba(124,58,237,0.06)]' 
                : 'border-[#E5E3EB] hover:border-[#C4B5FD] hover:shadow-md'
            }`}
          >
            {isCurrent && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Current Plan
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#1E1B4B] mb-2">{plan.name}</h3>
              <p className="text-xs text-[#78767B] min-h-[40px] leading-relaxed">{details.desc}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#1E1B4B]">${plan.price}</span>
                <span className="text-xs text-[#78767B] font-medium">/mo</span>
              </div>
            </div>

            <div className="flex-1">
              <ul className="space-y-3 mb-8">
                {details.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#1E1B4B]/80 font-medium">
                    <Check size={14} className="text-[#7C3AED] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={() => handleCheckout(plan.priceId)}
              disabled={isCurrent || isLoading === plan.priceId}
              variant={isCurrent ? 'outline' : 'default'}
              className={`w-full h-10 rounded-xl text-xs font-semibold ${
                isCurrent 
                  ? 'border-[#E5E3EB] text-[#1E1B4B] hover:bg-[#F8F7FC]' 
                  : (key === 'starter' 
                      ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm' 
                      : 'bg-[#F8F7FC] hover:bg-[#F1F0F5] text-[#1E1B4B] border border-[#E5E3EB]')
              }`}
            >
              {isLoading === plan.priceId ? (
                'Loading...'
              ) : isCurrent ? (
                'Current Plan'
              ) : plan.price === 0 ? (
                'Downgrade'
              ) : (
                <span className="flex items-center gap-1.5 justify-center">
                  Upgrade <Zap size={12} className={key==='starter' ? 'fill-white/20' : ''} />
                </span>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
