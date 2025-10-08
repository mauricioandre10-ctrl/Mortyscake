
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizar Compra',
  description: 'Completa tu pedido de forma segura en Morty\'s Cake.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
