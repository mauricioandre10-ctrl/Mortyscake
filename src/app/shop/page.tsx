
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
const WP_API_URL = 'https://cms.mortyscake.com';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  menu_order: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOption>('default');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

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

      try {
        const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products`);
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
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

  const handleProductClick = async (product: Product) => {
    setIsModalOpen(true);
    setLoadingModal(true);
    try {
        const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?slug=${product.slug}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product details: ${response.statusText}`);
        }
        const productDetails = await response.json();
        setSelectedProduct(productDetails[0]); 
    } catch(error) {
        console.error("Error fetching product details", error);
        setIsModalOpen(false);
    } finally {
        setLoadingModal(false);
    }
  }


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
          {sortedProducts.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardHeader className="p-0">
                {product.images?.[0]?.src ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.name}
                      width={600}
                      height={600}
                      className="object-cover w-full h-auto aspect-square"
                      unoptimized
                    />
                  ) : (
                    <div className="aspect-square w-full bg-muted" />
                  )}
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-6">
                <CardTitle className="font-headline text-xl mb-2">
                   {product.name}
                </CardTitle>
                <CardDescription className="text-sm" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/30 p-4 mt-auto">
                <span className="text-2xl font-bold text-primary">
                  €{product.price}
                </span>
                <Button onClick={() => handleProductClick(product)}>Ver Detalles</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0">
            {loadingModal || !selectedProduct ? (
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="p-4">
                        <Carousel>
                            <CarouselContent>
                                {selectedProduct.images.map(image => (
                                    <CarouselItem key={image.id}>
                                        <div className="aspect-square relative">
                                            <Image src={image.src} alt={image.alt} fill className="object-cover rounded-md" unoptimized/>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {selectedProduct.images.length > 1 && (
                              <>
                                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                              </>
                            )}
                        </Carousel>
                    </div>
                    <div className="flex flex-col p-8">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-3xl mb-4">{selectedProduct.name}</DialogTitle>
                      </DialogHeader>
                      <div className="prose prose-sm dark:prose-invert max-w-none flex-grow overflow-y-auto pr-2" dangerouslySetInnerHTML={{ __html: selectedProduct.description }}/>

                      <DialogFooter className="mt-8 flex-col sm:flex-col sm:space-x-0 items-stretch gap-4">
                          <div className="flex justify-between items-center">
                               <span className="text-3xl font-bold text-primary">
                                  €{selectedProduct.price}
                                </span>
                                <AddToCart 
                                  name={selectedProduct.name}
                                  description={selectedProduct.short_description || ''}
                                  id={String(selectedProduct.id)}
                                  price={parseFloat(selectedProduct.price)}
                                  currency="EUR"
                                  image={selectedProduct.images?.[0]?.src}
                                />
                          </div>
                      </DialogFooter>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
