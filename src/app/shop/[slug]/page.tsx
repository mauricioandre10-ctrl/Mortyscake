
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Truck, ShieldCheck, ArrowLeft, Info } from 'lucide-react';
import { AddToCart } from '@/components/AddToCart';
import { notFound } from 'next/navigation';

const WP_API_URL = 'https://cms.mortyscake.com';

// This function is required for static export with dynamic routes.
// It tells Next.js not to pre-render any pages at build time.
// Data fetching will happen on the client side.
export async function generateStaticParams() {
    return [];
}

// Fetch a single product by its slug
async function getProduct(slug: string) {
    try {
        const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?slug=${slug}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        // The API returns an array, so we get the first element
        if (data && Array.isArray(data) && data.length > 0) {
            return data[0];
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch product on server", error);
        return null;
    }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  // Critical check: If no product is found, stop execution immediately.
  if (!product) {
    notFound();
    return null; // Ensure no further rendering happens if product is not found.
  }

  return (
        <div className="container mx-auto py-12 px-4 md:px-6">
           <div className="mb-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a la tienda</span>
                </Link>
            </Button>
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
                unoptimized
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
                             {product.attributes && product.attributes.map((attr: any) => (
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
        </div>
  );
}
