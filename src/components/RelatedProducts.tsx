
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShareButton } from './ShareButton';
import { trackViewDetails } from '@/lib/events';
import { apiUrl, siteUrl as configSiteUrl } from '@/lib/config';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  short_description: string;
  images: { src: string; alt: string }[];
  category_names: string[];
}

interface RelatedProductsProps {
  currentProductId: number;
  categories: string[];
  productType: 'shop' | 'courses';
}

function ProductCard({ product, productType, siteUrl }: { product: Product, productType: 'shop' | 'courses', siteUrl: string | undefined }) {
  const imageUrl = product.images?.[0]?.src;
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price || product.price);
  const linkHref = `/${productType}/${product.slug}`;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card group">
        <div className="relative">
            {isOnSale && (
                <Badge variant="destructive" className="absolute top-2 left-2 z-10">Oferta</Badge>
            )}
            <ShareButton 
                title={product.name} 
                text={`Echa un vistazo: ${product.name}`} 
                url={`${siteUrl}${linkHref}`}
                className="absolute top-2 right-2 z-20 h-8 w-8"
                size="icon"
            />
            <Link href={linkHref} className="block" onClick={() => trackViewDetails(product.name, productType === 'courses' ? 'Curso' : 'Producto')}>
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
        <Link href={linkHref} className="flex flex-col flex-grow" onClick={() => trackViewDetails(product.name, productType === 'courses' ? 'Curso' : 'Producto')}>
            <CardContent className="flex flex-col flex-grow p-6">
                <CardTitle className="font-card-title text-xl mb-2">
                    {product.name}
                </CardTitle>
                <CardDescription className="text-sm" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
            </CardContent>
            <CardFooter className="flex-col items-center gap-2 bg-muted/30 p-4 mt-auto">
                 <div className="flex items-baseline gap-2">
                    {isOnSale && product.regular_price && (
                      <span className="text-lg text-muted-foreground line-through">
                        €{product.regular_price}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary">
                      {product.price === "0.00" && productType === 'courses' ? 'Gratis' : `€${product.price}`}
                    </span>
                 </div>
                <Button variant="secondary" size="sm" className="w-full">Ver Detalles</Button>
            </CardFooter>
        </Link>
    </Card>
  )
}

export function RelatedProducts({ currentProductId, categories, productType }: RelatedProductsProps) {
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const siteUrl = configSiteUrl;

  useEffect(() => {
    async function fetchRelatedProducts() {
      if (!apiUrl || categories.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const productsApiUrl = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        // We fetch products from the first category of the current product.
        productsApiUrl.searchParams.set('category_slug', categories[0]);
        productsApiUrl.searchParams.set('per_page', '5'); // Fetch 5 to have extras if one is the current product

        const response = await fetch(productsApiUrl.toString(), {
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) throw new Error('Failed to fetch related products');
        
        const data: Product[] = await response.json();

        // Filter out the current product and take up to 4
        const filteredData = data.filter(p => p.id !== currentProductId).slice(0, 4);
        
        setRelated(filteredData);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [currentProductId, categories]);

  if (loading) {
    return (
      <section className="mt-16">
        <h2 className="font-headline text-3xl md:text-4xl mb-8">También te podría interesar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[...Array(4)].map((_, i) => (
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
      </section>
    );
  }

  if (related.length === 0) {
    return null; // Don't show the section if there are no related products
  }

  return (
    <section className="mt-16">
      <h2 className="font-headline text-3xl md:text-4xl mb-8">También te podría interesar</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {related.map(product => (
          <ProductCard key={product.id} product={product} productType={productType} siteUrl={siteUrl} />
        ))}
      </div>
    </section>
  );
}
