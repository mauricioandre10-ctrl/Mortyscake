
'use client';

import { CartProvider as USCProvider } from 'use-shopping-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
    console.error("Stripe public key is not set in environment variables.");
    return <>{children}</>;
  }
   if (!process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL) {
    console.error("WooCommerce store URL is not set in environment variables.");
    return <>{children}</>;
  }

  const wooCommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

  return (
    <USCProvider
      mode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
      successUrl={`${wooCommerceUrl}/finalizar-compra/order-received/`}
      cancelUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/?checkout-cancelled=true`}
      currency="EUR"
      allowedCountries={['ES']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      {children}
    </USCProvider>
  );
}
