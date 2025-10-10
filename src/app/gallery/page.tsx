
'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ShareButton } from '@/components/ShareButton';
import { cn } from '@/lib/utils';

// Genera una lista de 60 imágenes con nombres consecutivos y alturas variables
const localGalleryImages = Array.from({ length: 60 }, (_, i) => ({
  id: `foto${i + 1}`,
  src: `/image/galeria/foto${i + 1}.webp`,
  alt: `Imagen de la galería de repostería ${i + 1}`,
  width: 800, // Ancho base constante
  height: 600 + ((i % 5) - 2) * 80, // Genera 5 alturas diferentes para un efecto más variado
}));

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
}

function GalleryComponent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const imageId = searchParams.get('image');

    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [siteUrl, setSiteUrl] = useState('');
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSiteUrl(window.location.origin);
        }
    }, []);

    useEffect(() => {
        if (imageId) {
            const image = localGalleryImages.find(img => img.id === imageId);
            setSelectedImage(image || null);
        } else {
            setSelectedImage(null);
        }
    }, [imageId]);

    const handleImageClick = (image: GalleryImage) => {
        const params = new URLSearchParams(searchParams);
        params.set('image', image.id);
        router.push(`${pathname}?${params.toString()}`);
    };
    
    const handleDialogClose = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('image');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };

    const getShareUrl = () => {
        if (!siteUrl || !selectedImage) return '';
        const params = new URLSearchParams();
        params.set('image', selectedImage.id);
        return `${siteUrl}${pathname}?${params.toString()}`;
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <header className="text-center mb-12">
                <h1 className="font-headline text-4xl md:text-5xl">Nuestra Galería</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Un vistazo a las dulces creaciones de nuestros cursos y encargos. Cada imagen cuenta una historia de pasión, sabor y arte.
                </p>
            </header>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {localGalleryImages.map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            "overflow-hidden rounded-lg break-inside-avoid shadow-md hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 cursor-pointer group opacity-0",
                            loadedImages.has(index) && "animate-fade-in opacity-100"
                        )}
                        onClick={() => handleImageClick(image)}
                        role="button"
                        aria-label={`Ver imagen ampliada: ${image.alt}`}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            priority={index < 8} // Reduce preload priority
                            onLoad={() => handleImageLoad(index)}
                        />
                    </div>
                ))}
            </div>

            <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
                <DialogContent className="w-auto max-w-none h-auto max-h-none p-0 bg-transparent border-none">
                {selectedImage && (
                    <>
                        <DialogTitle className="sr-only">Imagen Ampliada: {selectedImage.alt}</DialogTitle>
                        <DialogDescription className="sr-only">
                            Vista ampliada de la imagen: {selectedImage.alt}. Puedes cerrar esta vista con la tecla Escape o el botón de cierre.
                        </DialogDescription>
                        
                        <div className="relative w-[95vw] h-[95vh]">
                           <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className="object-contain"
                                sizes="95vw"
                            />
                        </div>
                        
                        <ShareButton
                            title="Mira esta creación de Morty's Cake"
                            text="¡Me encantó esta foto de la galería de Morty's Cake!"
                            url={getShareUrl()}
                            className="absolute top-4 right-14 z-20 bg-accent text-accent-foreground hover:bg-accent/90"
                            size="icon"
                        />
                    </>
                )}
                </DialogContent>
            </Dialog>
        </div>
    );
}


export default function GalleryPage() {
    return (
        <Suspense fallback={<div>Loading gallery...</div>}>
            <GalleryComponent />
        </Suspense>
    )
}
