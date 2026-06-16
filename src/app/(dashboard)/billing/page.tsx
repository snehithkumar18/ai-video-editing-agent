import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PricingCards from '@/components/billing/PricingCards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PLANS } from '@/lib/stripe';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('plan, render_credits, stripe_customer_id')
    .eq('id', user.id)
    .single();

  const currentPlanId = userData?.plan || 'free';
  const planDetails = PLANS[currentPlanId as keyof typeof PLANS] || PLANS.free;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1E1B4B]">Billing & Plans</h1>
        <p className="text-[#78767B]">Manage your subscription and billing details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-[#E5E3EB] p-6 flex flex-col justify-between rounded-3xl shadow-sm">
          <div>
            <h3 className="text-xs font-semibold text-[#78767B] uppercase tracking-wider mb-2">Current Plan</h3>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1E1B4B] capitalize">{planDetails.name}</span>
              {currentPlanId !== 'free' && (
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-2.5 py-0.5 rounded-lg font-semibold">Active</span>
              )}
            </div>
          </div>
          
          {userData?.stripe_customer_id ? (
            <form action="/api/stripe/create-portal" method="POST">
              <Button type="submit" variant="outline" className="w-fit border-[#E5E3EB] text-[#1E1B4B] hover:bg-[#F8F7FC] rounded-xl h-10 px-5 font-semibold text-sm">
                Manage Billing in Stripe
              </Button>
            </form>
          ) : (
            <p className="text-xs text-[#78767B] font-medium">Upgrade to a paid plan to manage billing.</p>
          )}
        </Card>

        <Card className="bg-white border-[#E5E3EB] p-6 flex flex-col justify-between rounded-3xl shadow-sm">
          <div>
            <h3 className="text-xs font-semibold text-[#78767B] uppercase tracking-wider mb-2">Render Credits</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-bold text-[#1E1B4B]">{currentPlanId === 'agency' ? '∞' : userData?.render_credits || 0}</span>
              <span className="text-[#78767B] text-sm font-medium mb-1">remaining this month</span>
            </div>
            <div className="w-full bg-[#F8F7FC] border border-[#E5E3EB] h-3 rounded-full mt-4 overflow-hidden relative">
              <div 
                className="h-full bg-violet-600 rounded-full" 
                style={{ 
                  width: currentPlanId === 'agency' ? '100%' : `${Math.min(100, ((userData?.render_credits || 0) / planDetails.renderCredits) * 100)}%` 
                }} 
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-8 border-t border-[#E5E3EB] mt-12">
        <h2 className="text-2xl font-bold mb-6 text-[#1E1B4B]">Available Plans</h2>
        <PricingCards currentPlanId={currentPlanId} />
      </div>
    </div>
  );
}
