import { loadStripe } from '@stripe/stripe-js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();

export const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Debug: log if Stripe key is present
if (!stripeKey) {
  console.warn('Stripe publishable key not found. Set VITE_STRIPE_PUBLISHABLE_KEY in .env');
} else {
  console.log('Stripe key loaded:', stripeKey.substring(0, 20) + '...');
}
