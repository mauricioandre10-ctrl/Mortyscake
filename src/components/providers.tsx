'use client';

import { CartProvider as USCProvider } from 'use-shopping-cart';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Conditional loading of Stripe
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <USCProvider
      mode="client-only"
      stripe={stripePublicKey!}
      successUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/?success=true`}
      cancelUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/?canceled=true`}
      currency="EUR"
      allowedCountries={['ES']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      ) : (
        children
      )}
    </USCProvider>
  );
}
