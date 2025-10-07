
'use client';

import { CartProvider } from 'use-shopping-cart';

const WOOCOMMERCE_CHECKOUT_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_CHECKOUT_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL + '/checkout';
const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!WOOCOMMERCE_URL) {
    // Or a loading spinner, or some fallback UI
    return <div>Configurando la tienda...</div>;
  }
  return (
    <CartProvider
      cartMode="client-only"
      mode="payment"
      shouldPersist={true}
      stripe={''} // Dummy value, not used for WooCommerce
      successUrl={`${WOOCOMMERCE_CHECKOUT_URL}/order-received`}
      cancelUrl={`${WOOCOMMERCE_URL}/cart`}
      currency="EUR"
      allowedCountries={['ES', 'FR', 'DE', 'IT', 'PT']}
      billingAddressCollection={true}
    >
      {children}
    </CartProvider>
  );
}
