
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos de Repostería Online y en Vivo',
  description: 'Explora nuestra completa gama de cursos de repostería. Aprende desde técnicas fundamentales hasta decoración avanzada y convierte tu pasión en arte.',
  openGraph: {
    title: 'Cursos de Repostería Online | Morty\'s Cake',
    description: 'Encuentra el curso perfecto para ti, ya seas principiante o busques perfeccionar tu técnica. ¡Inscríbete hoy!',
    images: ['/image/og-image-courses.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos de Repostería Online | Morty\'s Cake',
    description: 'Explora nuestra completa gama de cursos de repostería. Aprende desde técnicas fundamentales hasta decoración avanzada.',
    images: ['/image/og-image-courses.webp'],
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
