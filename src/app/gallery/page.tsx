
import Image from 'next/image';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { GalleryClient } from './gallery-client';

// Genera una lista de 60 imágenes con nombres consecutivos y alturas variables
const localGalleryImages = Array.from({ length: 60 }, (_, i) => ({
  id: `foto${i + 1}`,
  src: `/image/galeria/foto${i + 1}.webp`,
  alt: `Imagen de la galería de repostería ${i + 1}`,
  width: 800, // Ancho base constante
  height: 600 + ((i % 5) - 2) * 80, // Genera 5 alturas diferentes para un efecto más variado
}));

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const siteUrl = 'https://mortyscake.com';
  const imageId = searchParams?.image;

  if (typeof imageId === 'string') {
    const image = localGalleryImages.find(img => img.id === imageId);
    if (image) {
      const imageUrl = `${siteUrl}${image.src}`;
      return {
        title: `Foto: ${image.alt}`,
        description: 'Una de las creaciones de la galería de Morty\'s Cake.',
        openGraph: {
          title: `Foto de la Galería de Morty's Cake`,
          description: image.alt,
          images: [{
            url: imageUrl,
            width: image.width,
            height: image.height,
          }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Foto de la Galería de Morty's Cake`,
            description: image.alt,
            images: [imageUrl],
        }
      };
    }
  }

  // Metadatos por defecto si no hay imagen seleccionada
  return {
    title: 'Galería de Tartas y Postres Artísticos en Ourense, Galicia',
    description: 'Explora nuestra galería de creaciones de repostería en Ourense. Inspírate con nuestras tartas de boda, cumpleaños y postres personalizados hechos en el corazón de Galicia.',
    openGraph: {
        title: 'Galería de Creaciones | Morty\'s Cake Ourense y Galicia',
        description: 'Un vistazo a las dulces obras de arte de nuestros cursos y encargos en Ourense, Galicia. Cada imagen cuenta una historia de sabor.',
        images: [`${siteUrl}/image/fondo_heder.webp`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Galería de Creaciones | Morty\'s Cake Ourense y Galicia',
        description: 'Inspírate con nuestra galería de tartas y postres únicos hechos en Ourense para toda Galicia.',
        images: [`${siteUrl}/image/fondo_heder.webp`],
    },
  };
}


export default function GalleryPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const initialImageId = typeof searchParams?.image === 'string' ? searchParams.image : null;

    return (
        <Suspense fallback={<div>Loading gallery...</div>}>
            <GalleryClient images={localGalleryImages} initialImageId={initialImageId} />
        </Suspense>
    )
}
