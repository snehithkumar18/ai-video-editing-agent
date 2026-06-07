import Stripe from 'stripe';

type StripeCtorOptions = ConstructorParameters<typeof Stripe>[1];

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia' as StripeCtorOptions['apiVersion'], // cast to the constructor option type
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
