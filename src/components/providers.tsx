'use client';

import { useMemo } from 'react';
import { CartProvider as USCProvider } from 'use-shopping-cart';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

export function Providers({ children }: { children: React.ReactNode }) {
  const stripePromise = useMemo(() => {
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    if (!publicKey) {
      console.warn("Falta la clave pública de Stripe. La funcionalidad del carrito puede no funcionar como se espera para el checkout directo.");
      return null;
    }
    return loadStripe(publicKey);
  }, []);
  
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
