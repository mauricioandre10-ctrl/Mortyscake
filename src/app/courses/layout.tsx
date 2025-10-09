
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos de Repostería en Ourense | Online y Presenciales en Galicia',
  description: 'Explora nuestros cursos de repostería en Ourense, disponibles online para toda Galicia. Aprende desde técnicas fundamentales hasta decoración avanzada y convierte tu pasión en arte.',
  openGraph: {
    title: 'Cursos de Repostería en Ourense | Morty\'s Cake Galicia',
    description: 'Encuentra el curso de repostería perfecto para ti en Ourense, con opción online para toda Galicia. ¡Inscríbete hoy!',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos de Repostería en Ourense y Online para Galicia',
    description: 'Aprende repostería desde cero hasta nivel experto con nuestros cursos en Ourense, también disponibles online en Galicia.',
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