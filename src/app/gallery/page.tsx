
'use client';

import Image from 'next/image';
import { galleryImages } from '@/lib/gallery-images';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

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
          {galleryImages.map((image, index) => (
             <DialogTrigger asChild key={index} onClick={() => setSelectedImage(image)}>
                <div className="overflow-hidden rounded-lg break-inside-avoid shadow-md hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        data-ai-hint={image.hint}
                        unoptimized
                    />
                </div>
            </DialogTrigger>
          ))}
        </div>
        
        {selectedImage && (
             <DialogContent className="max-w-4xl p-0 border-0">
                <div className="relative aspect-video">
                    <Image 
                        src={selectedImage.src.replace(/\d+\/\d+$/, `${selectedImage.width*2}/${selectedImage.height*2}`)} // Fetch higher res for dialog
                        alt={selectedImage.alt}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        unoptimized
                    />
                </div>
            </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
