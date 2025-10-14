
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetails } from '@/components/ProductDetails';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  category_names: string[];
  sku: string;
  tags: { name: string; slug: string }[];
  rating_count: number;
  average_rating: number;
  attributes: { name: string; options: string[] }[] | Record<string, { name: string; options: string[] }>;
}

async function getProduct(slug: string): Promise<Product | null> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        console.error("[SERVER] Error: La variable de entorno NEXT_PUBLIC_API_URL no está configurada.");
        return null;
    }

    try {
        const url = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        url.searchParams.set('slug', slug);
        url.searchParams.set('per_page', '1');
        
        const response = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Revalidar cada hora
        
        if (!response.ok) {
            console.error(`[SERVER] Failed to fetch product. Status: ${response.status}`);
            return null;
        }
        
        const products = await response.json();
        if (products.length === 0) {
            return null;
        }

        const fetchedProduct = products[0];

        // Ensure we don't show a course in the product page
        if (fetchedProduct && fetchedProduct.category_names && fetchedProduct.category_names.includes('Cursos')) {
            return null;
        } else {
            // Remove reviews from the object as they won't be used
            const { reviews, ...productWithoutReviews } = fetchedProduct;
            return productWithoutReviews;
        }
    } catch (err) {
        console.error('[SERVER] An unexpected error occurred:', err);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe o no está disponible.',
    };
  }

  const cleanDescription = product.short_description.replace(/<[^>]*>?/gm, '');
  const imageUrl = product.images?.[0]?.src;

  return {
    title: product.name,
    description: cleanDescription,
    openGraph: {
      title: product.name,
      description: cleanDescription,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: cleanDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string }}) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }
  
    return <ProductDetails product={product} />;
}
