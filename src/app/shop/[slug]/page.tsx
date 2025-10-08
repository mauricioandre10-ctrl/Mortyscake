
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Info, FileText, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddToCart } from '@/components/AddToCart';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ShareButton } from '@/components/ShareButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  category_names: string[];
  sku: string;
  tags: { name: string; slug: string }[];
  rating_count: number;
  attributes: { name: string; options: string[] }[] | Record<string, { name: string; options: string[] }>;
}

export default function ProductDetailPage({ params }: { params: { slug: string }}) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getProduct(slug: string) {
            const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
            console.log('[CLIENT] WOOCOMMERCE_API_URL:', apiUrl);

            if (!apiUrl) {
                console.error("[CLIENT] Error: La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_STORE_URL no está configurada.");
                setError("La configuración del sitio no es correcta.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const url = new URL(`${apiUrl}/wp-json/morty/v1/products`);
                url.searchParams.set('slug', slug);
                url.searchParams.set('per_page', '1');
                
                console.log(`[CLIENT] Fetching URL: ${url.toString()}`);
                const response = await fetch(url.toString(), { cache: 'no-store' });
                
                console.log(`[CLIENT] Response status for slug ${slug}: ${response.status}`);
                if (!response.ok) {
                    console.error(`[CLIENT] Failed to fetch product. Status: ${response.status}, StatusText: ${response.statusText}`);
                    throw new Error(`No se pudo cargar la información del producto (Estatus: ${response.status}).`);
                }
                
                const products = await response.json();
                if (products.length === 0) {
                    console.log(`[CLIENT] No product found for slug: ${slug}`);
                    throw new Error("El producto que buscas no existe o no está disponible.");
                }

                const fetchedProduct = products[0];

                if (fetchedProduct && fetchedProduct.category_names && fetchedProduct.category_names.includes('Cursos')) {
                    console.log(`[CLIENT] Product found for slug ${slug}, but it IS a course. Skipping.`);
                    throw new Error("Este producto es un curso, no un artículo de la tienda.");
                } else {
                    console.log(`[CLIENT] Successfully found product: ${fetchedProduct.name}`);
                    setProduct(fetchedProduct);
                }
            } catch (err) {
                console.error('[CLIENT] An unexpected error occurred:', err);
                setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
            } finally {
                setLoading(false);
            }
        }
        
        if (params.slug) {
            getProduct(params.slug);
        }
    }, [params.slug]);


    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-4">No se pudo cargar el producto</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button asChild variant="outline">
                  <Link href="/shop">
                    <ArrowLeft className="mr-2" />
                    Volver a la Tienda
                  </Link>
                </Button>
            </div>
        );
    }
    
    if (!product) {
        return null;
    }
  
  const fullDescription = product.description || product.short_description || 'No hay descripción disponible.';
  const productAttributes = Array.isArray(product.attributes) ? product.attributes : Object.values(product.attributes);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/shop">
            <ArrowLeft className="mr-2" />
            Volver a la Tienda
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images?.length > 0 ? (
                product.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="aspect-square relative rounded-lg overflow-hidden border">
                      <Image
                        src={image.src}
                        alt={image.alt || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                    <div className="w-full h-full bg-muted"></div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
             {product.images?.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
              </>
            )}
          </Carousel>
        </div>

        <div className="flex flex-col lg:col-span-2">
           <div className="flex justify-between items-start">
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <ShareButton title={product.name} text={`Echa un vistazo a este producto: ${product.name}`} />
          </div>
          
          <div 
            className="prose dark:prose-invert max-w-none text-muted-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: product.short_description || '' }}
          />

          <div className="mt-auto">
              <div className="flex items-center mb-6">
                   <span className="text-4xl font-bold text-primary">
                      €{product.price}
                    </span>
              </div>
            
              <AddToCart 
                  id={String(product.id)}
                  size="lg"
              />
          </div>
        </div>
      </div>

       <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description"><FileText className="mr-2"/>Descripción</TabsTrigger>
            <TabsTrigger value="additional-info"><Info className="mr-2"/>Info Adicional</TabsTrigger>
            <TabsTrigger value="reviews"><MessageSquare className="mr-2"/>Valoraciones ({product.rating_count})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6 px-4 border rounded-b-md">
             <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: fullDescription }}
              />
          </TabsContent>
          <TabsContent value="additional-info" className="py-6 px-4 border rounded-b-md">
            <table className="w-full text-sm">
                <tbody>
                  {product.sku && (
                     <tr className="border-b">
                        <td className="py-3 font-semibold pr-4">SKU</td>
                        <td className="py-3">{product.sku}</td>
                    </tr>
                  )}
                   {productAttributes && productAttributes.map((attr, index) => (
                     attr.name && attr.options.length > 0 && (
                        <tr key={index} className="border-b">
                        <td className="py-3 font-semibold pr-4">{attr.name}</td>
                        <td className="py-3">{attr.options.join(', ')}</td>
                        </tr>
                     )
                  ))}
                  {product.tags?.length > 0 && (
                    <tr className="border-b">
                        <td className="py-3 font-semibold pr-4 align-top">Etiquetas</td>
                        <td className="py-3">
                           <div className="flex flex-wrap gap-2">
                                {product.tags.map(tag => (
                                    <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                                ))}
                            </div>
                        </td>
                    </tr>
                   )}
                </tbody>
            </table>
          </TabsContent>
          <TabsContent value="reviews" className="py-6 px-4 border rounded-b-md">
             <h3 className="text-xl font-bold mb-4">Opiniones de los clientes</h3>
            <p className="text-muted-foreground">Actualmente no hay valoraciones para este producto.</p>
             {/* TODO: Implementar la muestra de valoraciones de WooCommerce */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
                <Skeleton className="w-full aspect-square" />
            </div>
            <div className="flex flex-col lg:col-span-2 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="mt-auto pt-4 space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
        <div className="mt-12">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full mt-2" />
        </div>
      </div>
    );
}

