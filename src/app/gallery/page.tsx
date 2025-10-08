
'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';

// Se reemplazan las imágenes de marcador de posición por imágenes locales.
const localGalleryImages = Array.from({ length: 12 }, (_, i) => ({
  src: `/image/galeria/galeria_${i + 1}.webp`,
  alt: `Imagen de la galería de repostería ${i + 1}`,
  width: 800,
  height: 600 + (i % 3 - 1) * 100, // Variar ligeramente la altura para el efecto masonry
}));

interface GalleryImage {
    src: string;
    alt: string;
    width: number;
    height: number;
}


export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestra Galería</h1>
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
                    />
                </div>
            </DialogTrigger>
          ))}
        </div>
        
        {selectedImage && (
             <DialogContent className="max-w-4xl p-0 border-0">
                <div className="relative aspect-[4/3]">
                    <Image 
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        fill
                        className="object-contain"
                        sizes="100vw"
                    />
                </div>
            </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
