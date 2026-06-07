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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and billing details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0D0D0D] border-border p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Current Plan</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-white capitalize">{planDetails.name}</span>
              {currentPlanId !== 'free' && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded font-medium">Active</span>
              )}
            </div>
          </div>
          
          {userData?.stripe_customer_id ? (
            <form action="/api/stripe/create-portal" method="POST">
              <Button type="submit" variant="outline" className="w-fit border-gray-700">
                Manage Billing in Stripe
              </Button>
            </form>
          ) : (
            <p className="text-xs text-gray-500">Upgrade to a paid plan to manage billing.</p>
          )}
        </Card>

        <Card className="bg-[#0D0D0D] border-border p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Render Credits</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{currentPlanId === 'agency' ? '∞' : userData?.render_credits || 0}</span>
              <span className="text-gray-500 mb-1">remaining this month</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
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

      <div className="pt-8 border-t border-border mt-12">
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <PricingCards currentPlanId={currentPlanId} />
      </div>
    </div>
  );
}
