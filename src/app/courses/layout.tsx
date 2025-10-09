
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos de Repostería en Ourense | Online y Presenciales',
  description: 'Explora nuestros cursos de repostería en Ourense. Aprende desde técnicas fundamentales hasta decoración avanzada y convierte tu pasión en arte en Galicia.',
  openGraph: {
    title: 'Cursos de Repostería en Ourense | Morty\'s Cake',
    description: 'Encuentra el curso de repostería perfecto para ti en Ourense. ¡Inscríbete hoy y aprende con los mejores de Galicia!',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos de Repostería en Ourense | Morty\'s Cake',
    description: 'Aprende repostería desde cero hasta nivel experto con nuestros cursos en Ourense.',
    images: ['/image/fondo_heder.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
