
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tienda de Repostería Gourmet',
  description: 'Encuentra ingredientes de alta calidad, herramientas profesionales y utensilios para llevar tu repostería al siguiente nivel. Todo lo que necesitas para crear en Ourense.',
  openGraph: {
    title: 'Tienda de Repostería | Morty\'s Cake',
    description: 'Ingredientes, herramientas y todo lo que necesitas para tus creaciones de repostería.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tienda de Repostería | Morty\'s Cake',
    description: 'Ingredientes, herramientas y todo lo que necesitas para tus creaciones de repostería.',
    images: ['/image/fondo_heder.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
