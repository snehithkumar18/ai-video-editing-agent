import Stripe from 'stripe';

type StripeCtorOptions = ConstructorParameters<typeof Stripe>[1];

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      '[stripe] Missing STRIPE_SECRET_KEY environment variable. ' +
      'Set it in .env.local or your deployment environment.'
    );
  }
  return key;
}

export const stripe = new Stripe(getStripeKey(), {
  apiVersion: '2024-10-28.acacia' as any,
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
