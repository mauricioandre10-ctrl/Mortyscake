
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Repostería Creativa en Ourense',
  description: 'Descubre recetas, consejos y tendencias en repostería desde Ourense. Artículos de Morty\'s Cake para inspirar tu creatividad en la cocina en Galicia.',
  openGraph: {
    title: 'Blog de Repostería | Morty\'s Cake Ourense',
    description: 'Recetas, consejos e inspiración para amantes de la pastelería en Ourense y Galicia.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Repostería | Morty\'s Cake Ourense',
    description: 'Recetas, consejos e inspiración para amantes de la pastelería en Ourense.',
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
