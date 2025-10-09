'use client';

import { CartProvider as USCProvider } from 'use-shopping-cart';

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <USCProvider
      cartMode="client-only"
      stripe={stripePublicKey!}
      successUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/?success=true`}
      cancelUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/?canceled=true`}
      currency="EUR"
      allowedCountries={['ES']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      {children}
    </USCProvider>
  );
}
