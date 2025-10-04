
'use client';

import { CartProvider } from 'use-shopping-cart';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
      successUrl="https://example.com/success"
      cancelUrl="https://example.com/cancel"
      currency="EUR"
      allowedCountries={['ES', 'FR', 'DE', 'IT', 'PT']}
      billingAddressCollection={true}
    >
      {children}
    </CartProvider>
  );
}
