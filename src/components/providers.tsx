'use client';

import { useMemo } from 'react';
import { CartProvider as USCProvider } from 'use-shopping-cart';

export function Providers({ children }: { children: React.ReactNode }) {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  const memoizedStripeKey = useMemo(() => stripePublicKey || '', [stripePublicKey]);

  if (!memoizedStripeKey) {
    console.warn("Falta la clave pública de Stripe. La funcionalidad del carrito puede no funcionar como se espera para el checkout directo.");
  }
  
  return (
    <USCProvider
      mode="client-only"
      stripe={memoizedStripeKey}
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
