import Stripe from 'stripe';

type StripeCtorOptions = ConstructorParameters<typeof Stripe>[1];

let stripeInstance: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(target, prop, receiver) {
    if (prop === '$$typeof' || prop === 'then') {
      return undefined;
    }
    if (!stripeInstance) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error(
          '[stripe] Missing STRIPE_SECRET_KEY environment variable. ' +
          'Set it in .env.local or your deployment environment.'
        );
      }
      stripeInstance = new Stripe(key, {
        apiVersion: '2024-10-28.acacia' as any,
      });
    }
    return Reflect.get(stripeInstance, prop, receiver);
  }
});

export const PLANS = {
  free: { 
    name: 'Free', 
    priceId: null, 
    price: 0, 
    renderCredits: 5, 
    maxVoiceProfiles: 1, 
    maxAvatarProfiles: 1, 
    watermark: true 
  },
  starter: { 
    name: 'Starter', 
    priceId: process.env.STRIPE_STARTER_PRICE_ID, 
    price: 49, 
    renderCredits: 15, 
    maxVoiceProfiles: 3, 
    maxAvatarProfiles: 3, 
    watermark: false 
  },
  pro: { 
    name: 'Pro', 
    priceId: process.env.STRIPE_PRO_PRICE_ID, 
    price: 99, 
    renderCredits: 40, 
    maxVoiceProfiles: 10, 
    maxAvatarProfiles: 10, 
    watermark: false 
  },
  agency: { 
    name: 'Agency', 
    priceId: process.env.STRIPE_AGENCY_PRICE_ID, 
    price: 249, 
    renderCredits: -1, 
    maxVoiceProfiles: -1, 
    maxAvatarProfiles: -1, 
    watermark: false 
  }
};
