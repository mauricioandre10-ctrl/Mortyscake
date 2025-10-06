
'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Truck, ShieldCheck, ArrowLeft, Info } from 'lucide-react';
import { AddToCart } from '@/components/AddToCart';
import { wooCommerce } from '@/lib/woocommerce';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage({ params: serverParams }: { params: { slug: string } }) {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const slug = params.slug;
      if (!slug) return;
      try {
        const response = await wooCommerce.get('products', {
          slug: Array.isArray(slug) ? slug[0] : slug,
        });
        if (response.data && response.data.length > 0) {
          setProduct(response.data[0]);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);


  if (loading) {
    return (
       <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
            <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-10 w-1/3" />
                        </div>
                        <Skeleton className="h-12 w-full" />
                         <div className="border-t pt-4 space-y-3 text-sm">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
       <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda</span>
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={product.images[0].src}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col">
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
                 <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < product.average_rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating_count} reseñas)</span>
            </div>
            <div className="text-muted-foreground text-lg prose" dangerouslySetInnerHTML={{ __html: product.description }} />
            
            <Card className="border mt-auto">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Precio</span>
                        <span className="font-bold text-3xl text-primary">
                            €{product.price}
                        </span>
                    </div>
                     <AddToCart 
                        name={product.name}
                        description={product.short_description || ''}
                        id={String(product.id)}
                        price={parseFloat(product.price)}
                        currency="EUR"
                        image={product.images?.[0]?.src || ''}
                        className="w-full"
                        size="lg"
                     />
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Truck className="w-5 h-5 text-muted-foreground" />
                            <span>Envío en 24/48 horas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                             <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                            <span>Pago 100% seguro</span>
                        </div>
                         {product.attributes.map((attr: any) => (
                         <div key={attr.id} className="flex items-start gap-2 text-sm">
                            <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <span className="font-semibold">{attr.name}:</span> {attr.options.join(', ')}
                            </div>
                         </div>
                      ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
       {product.attributes.length > 0 && (
         <div className="max-w-6xl mx-auto mt-16 pt-8 border-t">
          <h2 className="font-headline text-3xl font-bold text-center mb-8">Detalles del Producto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {product.attributes.map((attr: any) => (
                    <div key={attr.id} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                        <h3 className="font-bold text-lg mb-1">{attr.name}</h3>
                        <p className="text-muted-foreground text-sm">{attr.options.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
