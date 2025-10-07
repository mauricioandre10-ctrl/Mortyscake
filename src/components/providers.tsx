
'use client';

import { CartProvider } from 'use-shopping-cart';

const WOOCOMMERCE_URL = 'https://cms.mortyscake.com';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider
      cartMode="client-only"
      mode="payment"
      shouldPersist={true}
      stripe={''} // Dummy value, not used for WooCommerce
      successUrl={`${WOOCOMMERCE_URL}/checkout/order-received`}
      cancelUrl={`${WOOCOMMERCE_URL}/cart`}
      currency="EUR"
      allowedCountries={['ES', 'FR', 'DE', 'IT', 'PT']}
      billingAddressCollection={true}
    >
      {children}
    </CartProvider>
  );
}
