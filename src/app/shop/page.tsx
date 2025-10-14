
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShareButton } from '@/components/ShareButton';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { trackViewDetails } from '@/lib/events';
import { apiUrl, siteUrl as configSiteUrl } from '@/lib/config';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  menu_order: number;
  category_names: string[];
}

function ProductCard({ product, siteUrl }: { product: Product, siteUrl: string | undefined }) {
  const imageUrl = product.images?.[0]?.src;
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card group">
        <div className="relative">
            <ShareButton 
                title={product.name} 
                text={`Echa un vistazo a este producto: ${product.name}`} 
                url={`${siteUrl}/shop/${product.slug}`}
                className="absolute top-2 right-2 z-20 h-8 w-8"
                size="icon"
            />
            <Link href={`/shop/${product.slug}`} className="block" onClick={() => trackViewDetails(product.name, 'Producto')}>
              <div className="aspect-square w-full bg-muted relative rounded-t-lg overflow-hidden">
              {imageUrl ? (
                  <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  ) : (
                  <div className="w-full h-full bg-muted"></div>
                  )}
              </div>
            </Link>
        </div>
         <Link href={`/shop/${product.slug}`} className="flex flex-col flex-grow" onClick={() => trackViewDetails(product.name, 'Producto')}>
            <CardContent className="flex flex-col flex-grow p-6">
                <CardTitle className="font-card-title text-xl mb-2">
                    {product.name}
                </CardTitle>
                <CardDescription className="text-sm" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
            </CardContent>
            <CardFooter className="flex-col items-center gap-2 bg-muted/30 p-4 mt-auto">
                <span className="text-2xl font-bold text-primary">
                €{product.price}
                </span>
                <Button variant="secondary" size="sm" className="w-full">Ver Detalles</Button>
            </CardFooter>
        </Link>
    </Card>
  )
}

function ProductsList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const siteUrl = configSiteUrl;

    useEffect(() => {
        async function getProducts() {
            if (!apiUrl) {
                setError('La configuración del sitio no es correcta.');
                setLoading(false);
                return;
            }

            try {
                const productsApiUrl = new URL(`${apiUrl}/wp-json/morty/v1/products`);
                productsApiUrl.searchParams.set('category_exclude_slug', 'cursos');
                productsApiUrl.searchParams.set('per_page', '100');

                const response = await fetch(productsApiUrl.toString(), {
                  signal: AbortSignal.timeout(30000), // 30-second timeout
                  next: { revalidate: 3600 } // Revalidate every hour
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.statusText}`);
                }
                const data = await response.json();

                const filteredData = data.filter((item: Product) => 
                    !item.category_names || !item.category_names.includes('Cursos')
                );
                
                const sortedProducts = filteredData.sort((a: Product, b: Product) => a.menu_order - b.menu_order);
                setProducts(sortedProducts);
            } catch (err) {
                console.error('[CLIENT] An unexpected error occurred:', err);
                setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
            } finally {
                setLoading(false);
            }
        }
        
        getProducts();
    }, []);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <p className="text-center text-destructive col-span-full">Error al cargar los productos: {error}</p>
    }

    if (products.length === 0) {
        return <p className="text-center text-muted-foreground col-span-full">No se encontraron productos en este momento. Por favor, inténtalo de nuevo más tarde.</p>
    }

    return (
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} siteUrl={siteUrl} />
          ))}
        </div>
    )
}

export default function ShopPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Nuestra Tienda</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ingredientes, herramientas y todo lo que necesitas para que tus creaciones de repostería cobren vida.
        </p>
      </header>

      <ProductsList />
      
    </div>
  );
}


function LoadingSkeleton() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter className="flex-col items-center gap-2 bg-muted/30 p-4">
               <Skeleton className="h-8 w-1/4" />
               <Skeleton className="h-10 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
}
