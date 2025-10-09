
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Repostería Creativa',
  description: 'Descubre recetas, consejos, y las últimas tendencias en el mundo de la repostería. Artículos de Morty\'s Cake para inspirar tu creatividad en la cocina.',
  openGraph: {
    title: 'Blog de Repostería | Morty\'s Cake',
    description: 'Recetas, consejos e inspiración para amantes de la pastelería. ¡Aprende y crea con nosotros!',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Repostería | Morty\'s Cake',
    description: 'Recetas, consejos e inspiración para amantes de la pastelería. ¡Aprende y crea con nosotros!',
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
