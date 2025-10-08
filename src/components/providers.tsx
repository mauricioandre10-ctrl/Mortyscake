'use client';

import { CartProvider } from '@/context/CartProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
