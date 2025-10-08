
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddToCart } from '@/components/AddToCart';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ShareButton } from '@/components/ShareButton';

const WP_API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

// This enables ISR (Incremental Static Regeneration)
// The page will be re-generated at most once per hour
export const revalidate = 3600;

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
}

// This function tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  if (!WP_APIURL) return [];
  try {
    const apiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
    apiUrl.searchParams.set('category_exclude_slug', 'cursos');
    apiUrl.searchParams.set('per_page', '100');

    const response = await fetch(apiUrl.toString());
    if (!response.ok) return [];

    const products: Product[] = await response.json();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for products:', error);
    return [];
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  if (!WP_API_URL) return null;
  try {
    // We can fetch directly from WordPress here because this runs on the server
    const apiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
    apiUrl.searchParams.set('slug', slug);

    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string }}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }
  
  const fullDescription = product.description || product.short_description || 'No hay descripción disponible.';

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
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
                        unoptimized
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

        <div className="flex flex-col">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
          
          <div 
            className="prose dark:prose-invert max-w-none text-muted-foreground flex-grow"
            dangerouslySetInnerHTML={{ __html: fullDescription }}
          />

          <div className="mt-8 pt-8 border-t">
              <div className="flex justify-between items-center mb-6">
                   <span className="text-4xl font-bold text-primary">
                      €{product.price}
                    </span>
                  <ShareButton title={product.name} text={`Echa un vistazo a este producto: ${product.name}`} />
              </div>
            
              <AddToCart 
                  name={product.name}
                  description={product.short_description || ''}
                  id={String(product.id)}
                  price={parseFloat(product.price)}
                  currency="EUR"
                  image={product.images?.[0]?.src}
                  className="w-full"
                  size="lg"
              />
          </div>
        </div>
      </div>
    </div>
  );
}
