
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galería de Tartas y Postres Artísticos en Ourense, Galicia',
  description: 'Explora nuestra galería de creaciones de repostería en Ourense. Inspírate con nuestras tartas de boda, cumpleaños y postres personalizados hechos en el corazón de Galicia.',
  openGraph: {
    title: 'Galería de Creaciones | Morty\'s Cake Ourense y Galicia',
    description: 'Un vistazo a las dulces obras de arte de nuestros cursos y encargos en Ourense, Galicia. Cada imagen cuenta una historia de sabor.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galería de Creaciones | Morty\'s Cake Ourense y Galicia',
    description: 'Inspírate con nuestra galería de tartas y postres únicos hechos en Ourense para toda Galicia.',
    images: ['/image/fondo_heder.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
