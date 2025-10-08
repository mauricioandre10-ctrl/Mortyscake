
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const WP_API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

export async function GET(request: Request) {
  if (!WP_API_URL) {
    return NextResponse.json({ error: 'WordPress API URL not configured' }, { status: 500 });
  }
  
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '100';

  try {
    const productsApiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
    productsApiUrl.searchParams.set('category_exclude_slug', 'cursos');
    productsApiUrl.searchParams.set('per_page', limit);

    const productsResponse = await fetch(productsApiUrl.toString(), { next: { revalidate: 60 } }); // Revalidate every minute
    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      console.error("Failed to fetch products:", productsResponse.status, errorText);
      return NextResponse.json({ error: `Failed to fetch products: ${productsResponse.statusText}` }, { status: productsResponse.status });
    }
    const products = await productsResponse.json();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in /api/products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
