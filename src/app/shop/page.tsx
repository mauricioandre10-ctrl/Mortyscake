
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'alpha-asc' | 'alpha-desc';

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Popularidad' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'alpha-asc', label: 'Alfabético: A-Z' },
    { value: 'alpha-desc', label: 'Alfabético: Z-A' },
];

const CACHE_KEY = 'all_products_cache';
const CACHE_DURATION = 3600 * 1000; // 1 hora en milisegundos
const WP_API_URL = 'https://mortyscake.com';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOption>('default');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // 1. Intentar cargar desde la caché
      try {
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (cachedItem) {
          const { timestamp, data } = JSON.parse(cachedItem);
          const isCacheValid = (new Date().getTime() - timestamp) < CACHE_DURATION;
          if (isCacheValid) {
            setProducts(data);
            setLoading(false);
          }
        }
      } catch (e) {
          console.error("Failed to read from localStorage", e);
      }

      // 2. Fetch de la red
      try {
        const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products`);
        const data = await response.json();
        
        setProducts(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: new Date().getTime(), data }));

      } catch (error) {
        console.error('Error fetching products from API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortOrder) {
      case 'price-desc':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(b.price));
      case 'price-asc':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'alpha-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'default':
      default:
        // WooCommerce default sort is popularity (menu_order)
        return products.sort((a, b) => a.menu_order - b.menu_order);
    }
  }, [products, sortOrder]);
  
  const showLoadingSkeleton = loading && products.length === 0;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestra Tienda</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ingredientes, herramientas y todo lo que necesitas para que tus creaciones de repostería cobren vida.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <span className="text-sm font-medium mr-2 text-muted-foreground">Ordenar por:</span>
        {sortOptions.map(option => (
          <Button
            key={option.value}
            variant={sortOrder === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortOrder(option.value)}
            className="rounded-full"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {showLoadingSkeleton ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/30 p-4">
                 <Skeleton className="h-8 w-1/4" />
                 <Skeleton className="h-10 w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product: any) => (
            <Card key={product.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardHeader className="p-0">
                <Link href={`/shop/${product.slug}`} className="block relative aspect-square">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-6">
                <CardTitle as="h3" className="font-headline text-xl mb-2">
                   <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                </CardTitle>
                <CardDescription className="text-sm" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/30 p-4 mt-auto">
                <span className="text-2xl font-bold text-primary">
                  €{product.price}
                </span>
                <AddToCart
                  name={product.name}
                  description={product.short_description || ''}
                  id={String(product.id)}
                  price={parseFloat(product.price)}
                  currency="EUR"
                  image={product.images?.[0]?.src || ''}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
