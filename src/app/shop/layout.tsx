
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tienda de Repostería Gourmet en Ourense para toda Galicia',
  description: 'Encuentra ingredientes de alta calidad y herramientas profesionales en nuestra tienda de repostería en Ourense. Envíos a toda Galicia.',
  openGraph: {
    title: 'Tienda de Repostería | Morty\'s Cake Ourense y Galicia',
    description: 'Ingredientes, herramientas y todo lo que necesitas para tus creaciones de repostería. Servimos a toda Galicia desde Ourense.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tienda de Repostería | Morty\'s Cake Ourense y Galicia',
    description: 'Ingredientes y herramientas para tus creaciones de repostería en Ourense y Galicia.',
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
