'use client';

import { CartProvider as USCProvider } from 'use-shopping-cart';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <USCProvider
      mode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!}
      successUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/?success=true`}
      cancelUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/?canceled=true`}
      currency="EUR"
      allowedCountries={['ES']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </USCProvider>
  );
}
