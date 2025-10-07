
'use client';

import { CartProvider } from 'use-shopping-cart';

const WOOCOMMERCE_CHECKOUT_URL = 'https://mortyscake.com/checkout/';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider
      cartMode="client-only"
      stripe="" // This is not needed for WooCommerce
      successUrl={`${WOOCOMMERCE_CHECKOUT_URL}?session_id={CHECKOUT_SESSION_ID}`}
      cancelUrl={WOOCOMMERCE_CHECKOUT_URL || ''}
      currency="EUR"
      allowedCountries={['ES', 'FR', 'DE', 'IT', 'PT']}
      billingAddressCollection={true}
    >
      {children}
    </CartProvider>
  );
}
