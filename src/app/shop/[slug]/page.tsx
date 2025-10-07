
import { Suspense } from 'react';
import ProductClientPage from './ProductClientPage';
import ProductDetailPageSkeleton from './ProductDetailPageSkeleton';


const WP_API_URL = 'https://mortyscake.com';

type ProductDetailPageProps = {
  params: { slug: string };
};


// This tells Next.js to generate pages on-demand if they weren't generated at build time.
export const dynamicParams = true;

// This function can return an empty array if we want to build all pages on-demand.
// This makes the build process independent of the API's availability.
export async function generateStaticParams() {
  // We return an empty array to prevent build-time fetching errors
  // Pages will be generated on-demand.
  return [];
}

async function getProduct(slug: string) {
  // During build, don't fetch data. Data will be fetched on the client.
  if (process.env.npm_lifecycle_event === 'build') {
    return null;
  }
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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.slug);

  // The notFound() call is now handled inside the Client Component after client-side fetching.

  return (
    <Suspense fallback={<ProductDetailPageSkeleton />}>
        <ProductClientPage initialProduct={product} slug={params.slug} />
    </Suspense>
  );
}
