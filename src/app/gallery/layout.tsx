

import type { Metadata } from 'next';

// Los metadatos base ahora se generan dinámicamente en `page.tsx` para soportar imágenes individuales al compartir.
// Este archivo de layout puede permanecer para otros componentes de UI si es necesario, pero los metadatos se han movido.

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
