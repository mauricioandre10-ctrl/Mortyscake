
'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from 'react';
import { ShareButton } from '@/components/ShareButton';

// Genera una lista de 60 imágenes con nombres consecutivos y alturas variables
const localGalleryImages = Array.from({ length: 60 }, (_, i) => ({
  src: `/image/galeria/foto${i + 1}.webp`,
  alt: `Imagen de la galería de repostería ${i + 1}`,
  width: 800, // Ancho base constante
  height: 600 + ((i % 5) - 2) * 80, // Genera 5 alturas diferentes para un efecto más variado
}));

interface GalleryImage {
    src: string;
    alt: string;
    width: number;
    height: number;
}


export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [siteUrl, setSiteUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSiteUrl(window.location.origin);
        }
    }, []);


  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Nuestra Galería</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Un vistazo a las dulces creaciones de nuestros cursos y encargos. Cada imagen cuenta una historia de pasión, sabor y arte.
        </p>
      </header>

      <Dialog>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {localGalleryImages.map((image, index) => (
             <DialogTrigger asChild key={index} onClick={() => setSelectedImage(image)}>
                <div className="overflow-hidden rounded-lg break-inside-avoid shadow-md hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        priority={index < 12} // Prioriza la carga de las primeras 12 imágenes
                    />
                </div>
            </DialogTrigger>
          ))}
        </div>
        
        {selectedImage && (
             <DialogContent className="max-w-[99vw] max-h-[99vh] w-auto h-auto p-0 bg-transparent border-0 flex items-center justify-center">
                <Image 
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={selectedImage.width}
                    height={selectedImage.height}
                    className="object-contain h-auto w-auto max-h-[99vh] max-w-[99vw] rounded-lg shadow-2xl"
                    sizes="99vw"
                />
                 <ShareButton
                    title="Mira esta creación de Morty's Cake"
                    text="¡Me encantó esta foto de la galería de Morty's Cake!"
                    url={siteUrl ? `${siteUrl}${selectedImage.src}` : selectedImage.src}
                    className="absolute top-4 right-4 z-20 bg-black/50 text-white hover:bg-black/70"
                    size="icon"
                 />
            </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
