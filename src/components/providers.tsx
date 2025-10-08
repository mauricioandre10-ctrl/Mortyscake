'use client';

import { CartProvider as USCProvider } from 'use-shopping-cart';

export function Providers({ children }: { children: React.ReactNode }) {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  const wooCommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripePublicKey || !wooCommerceUrl || !siteUrl) {
    console.warn("Faltan variables de entorno para el carrito de compras. La funcionalidad del carrito estará deshabilitada.");
    return <>{children}</>;
  }

  return (
    <USCProvider
      mode="client-only"
      stripe={stripePublicKey}
      successUrl={`${siteUrl}/?success=true`}
      cancelUrl={`${siteUrl}/?canceled=true`}
      currency="EUR"
      allowedCountries={['ES']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      {children}
    </USCProvider>
  );
}
