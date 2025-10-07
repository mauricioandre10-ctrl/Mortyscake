
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductClientPage from './ProductClientPage';
import { Skeleton } from '@/components/ui/skeleton';


const WP_API_URL = 'https://tecnovacenter.shop';


// This function is called at build time to generate static pages for each product
export async function generateStaticParams() {
  try {
    const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?per_page=100`);
    if (!response.ok) {
       console.error(`Build-time: Failed to fetch products. Status: ${response.statusText}`);
       return [];
    }
    const products = await response.json();

    if (!Array.isArray(products)) {
        console.error('Build-time: API did not return an array of products.');
        return [];
    }
    
    return products.map((product: any) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Build-time error in generateStaticParams for products:', error);
    return [];
  }
}

async function getProduct(slug: string) {
  try {
    const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?slug=${slug}`, { next: { revalidate: 3600 } }); // Revalidate every hour
     if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch initial product from API", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailPageSkeleton />}>
        <ProductClientPage initialProduct={product} />
    </Suspense>
  );
}


function ProductDetailPageSkeleton() {
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

// We need this dummy card component here to avoid a circular dependency with the skeleton
function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border rounded-lg ${className}`} {...props} />;
}
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-0 ${className}`} {...props} />;
}
