
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tienda de Repostería Gourmet en Ourense',
  description: 'Encuentra ingredientes de alta calidad y herramientas profesionales en nuestra tienda de repostería en Ourense. Todo lo que necesitas para crear en Galicia.',
  openGraph: {
    title: 'Tienda de Repostería | Morty\'s Cake Ourense',
    description: 'Ingredientes, herramientas y todo lo que necesitas para tus creaciones de repostería en Ourense.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tienda de Repostería | Morty\'s Cake Ourense',
    description: 'Ingredientes y herramientas para tus creaciones de repostería en Ourense.',
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
