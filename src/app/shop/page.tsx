
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { wooCommerce } from '@/lib/woocommerce';
import { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await wooCommerce.get('products');
        if (response.status === 200) {
          setProducts(response.data);
        } else {
          console.error('Error fetching products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products from WooCommerce:', error);
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
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'price-asc':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'alpha-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'default':
      default:
        return products;
    }
  }, [products, sortOrder]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <header className="text-center mb-12">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
        </header>
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
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestra Tienda</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ingredientes, herramientas y todo lo que necesitas para que tus creaciones de repostería cobren vida.
        </p>
      </header>

      <div className="flex justify-end mb-8">
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Orden por defecto</SelectItem>
            <SelectItem value="price-asc">Precio: de menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: de mayor a menor</SelectItem>
            <SelectItem value="alpha-asc">Alfabéticamente, A-Z</SelectItem>
            <SelectItem value="alpha-desc">Alfabéticamente, Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedProducts.map((product: any) => (
          <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card">
            <CardHeader className="p-0">
              <Link href={`/shop/${product.slug}`} className="block relative aspect-square">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
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
    </div>
  );
}
