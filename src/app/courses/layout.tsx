
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos de Repostería Online y Presenciales',
  description: 'Explora nuestra gama de cursos de repostería en Ourense. Aprende desde técnicas fundamentales hasta decoración avanzada y convierte tu pasión en arte.',
  openGraph: {
    title: 'Cursos de Repostería | Morty\'s Cake',
    description: 'Encuentra el curso perfecto para ti, ya seas principiante o busques perfeccionar tu técnica. ¡Inscríbete hoy!',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos de Repostería | Morty\'s Cake',
    description: 'Explora nuestros cursos de repostería y aprende desde cero hasta nivel experto con técnicas profesionales.',
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
