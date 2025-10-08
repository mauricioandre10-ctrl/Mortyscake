
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShareButton } from '@/components/ShareButton';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


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


async function getProducts(): Promise<Product[]> {
    const WP_API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    if (!WP_API_URL) {
        console.error('WordPress API URL not configured');
        return [];
    }

    try {
        const productsApiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
        productsApiUrl.searchParams.set('category_exclude_slug', 'cursos');
        productsApiUrl.searchParams.set('per_page', '100');

        const response = await fetch(productsApiUrl.toString(), { next: { revalidate: 60 } }); // Revalidate every minute
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        // Final safety filter
        return data.filter((item: Product) => 
            !item.category_names || !item.category_names.includes('Cursos')
        );
    } catch (error) {
        console.error('Error fetching products from API:', error);
        return [];
    }
}


function ProductCard({ product, siteUrl }: { product: Product, siteUrl: string | undefined }) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card group">
        <Link href={`/shop/${product.slug}`} className="flex flex-col flex-grow">
        <CardHeader className="p-0 relative">
            <ShareButton 
                title={product.name} 
                text={`Echa un vistazo a este producto: ${product.name}`} 
                url={`${siteUrl}/shop/${product.slug}`}
                className="absolute top-2 right-2 z-10 h-8 w-8"
                size="icon"
            />
            <div className="aspect-square w-full bg-muted relative overflow-hidden">
            {product.images?.[0]?.src ? (
                <Image
                    src={product.images[0].src}
                    alt={product.name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                />
                ) : (
                <div className="w-full h-full bg-muted"></div>
                )}
            </div>
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
            <Button variant="secondary">Ver Detalles</Button>
        </CardFooter>
        </Link>
    </Card>
  )
}

async function ProductsList() {
    const products = await getProducts();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const sortedProducts = products.sort((a, b) => a.menu_order - b.menu_order);

    return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} siteUrl={siteUrl} />
          ))}
        </div>
    )
}


export default function ShopPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestra Tienda</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ingredientes, herramientas y todo lo que necesitas para que tus creaciones de repostería cobren vida.
        </p>
      </header>

      {/* Sorting UI can be re-added here if needed, but would require client component */}

      <Suspense fallback={<LoadingSkeleton />}>
        <ProductsList />
      </Suspense>
      
    </div>
  );
}


function LoadingSkeleton() {
    return (
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
    );
}

