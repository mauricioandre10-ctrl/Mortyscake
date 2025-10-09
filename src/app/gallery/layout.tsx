
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galería de Tartas y Postres',
  description: 'Explora nuestra galería de creaciones de repostería. Inspírate con nuestras tartas de boda, cumpleaños y postres personalizados, todos hechos con pasión y arte.',
  openGraph: {
    title: 'Galería de Creaciones | Morty\'s Cake',
    description: 'Un vistazo a las dulces obras de arte de nuestros cursos y encargos. Cada imagen cuenta una historia de sabor.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galería de Creaciones | Morty\'s Cake',
    description: 'Inspírate con nuestra galería de tartas y postres únicos.',
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
