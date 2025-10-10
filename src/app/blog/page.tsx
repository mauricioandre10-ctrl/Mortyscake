
import type { Metadata } from 'next';
import { PostsList } from './posts-list';

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

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Desde nuestra Cocina</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Consejos, recetas e inspiración para tu viaje en el mundo de la repostería.
        </p>
      </header>
      
      <PostsList />
    </div>
  );
}
