import { NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;

          let planName = 'free';
          let renderCredits = PLANS.free.renderCredits;

          if (priceId === PLANS.starter.priceId) {
            planName = 'starter';
            renderCredits = PLANS.starter.renderCredits;
          } else if (priceId === PLANS.pro.priceId) {
            planName = 'pro';
            renderCredits = PLANS.pro.renderCredits;
          } else if (priceId === PLANS.agency.priceId) {
            planName = 'agency';
            renderCredits = PLANS.agency.renderCredits;
          }

          await supabase
            .from('users')
            .update({
              plan: planName,
              render_credits: renderCredits,
              stripe_subscription_id: subscriptionId,
            })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;

        let planName = 'free';
        let renderCredits = PLANS.free.renderCredits;

        if (priceId === PLANS.starter.priceId) {
          planName = 'starter';
          renderCredits = PLANS.starter.renderCredits;
        } else if (priceId === PLANS.pro.priceId) {
          planName = 'pro';
          renderCredits = PLANS.pro.renderCredits;
        } else if (priceId === PLANS.agency.priceId) {
          planName = 'agency';
          renderCredits = PLANS.agency.renderCredits;
        }

        await supabase
          .from('users')
          .update({
            plan: planName,
            render_credits: renderCredits,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('users')
          .update({
            plan: 'free',
            render_credits: PLANS.free.renderCredits,
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    // Still return 200 so Stripe doesn't retry unnecessarily if it's our internal DB issue
  }

  // Always return 200 to acknowledge receipt
  return new Response(JSON.stringify({ received: true }), { 
    status: 200, 
    headers: { 'Content-Type': 'application/json' } 
  });
}
