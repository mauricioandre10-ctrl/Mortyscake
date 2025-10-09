
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Repostería Creativa en Ourense para Galicia',
  description: 'Descubre recetas, consejos y tendencias en repostería desde Ourense. Artículos de Morty\'s Cake para inspirar tu creatividad en la cocina en toda Galicia.',
  openGraph: {
    title: 'Blog de Repostería | Morty\'s Cake Ourense y Galicia',
    description: 'Recetas, consejos e inspiración para amantes de la pastelería en Ourense y para toda la comunidad de Galicia.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Repostería | Morty\'s Cake Ourense y Galicia',
    description: 'Recetas, consejos e inspiración para amantes de la pastelería en Ourense y Galicia.',
    images: ['/image/fondo_heder.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
