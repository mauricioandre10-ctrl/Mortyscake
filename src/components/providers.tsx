'use client';

import { CartProvider } from '@/hooks/useCart';

// This component is no longer strictly necessary but is kept for structure.
// You could add other global providers here in the future (e.g., ThemeProvider).

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
