
'use client';

import { CartProvider as USCProvider } from 'use-shopping-cart';

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <USCProvider
      mode="payment"
      cartMode="client-only"
      stripe={stripePublicKey!}
      successUrl={`${siteUrl || ''}/?success=true`}
      cancelUrl={`${siteUrl || ''}/?canceled=true`}
      currency="EUR"
      allowedCountries={['ES']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      {children}
    </USCProvider>
  );
}
