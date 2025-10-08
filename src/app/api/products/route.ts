
import { NextResponse } from 'next/server';

const WP_API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

export async function GET(request: Request) {
  if (!WP_API_URL) {
    return NextResponse.json({ error: 'WordPress API URL not configured' }, { status: 500 });
  }
  
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '100';

  try {
    // 1. Get Course Category ID to exclude it
    const catResponse = await fetch(`${WP_API_URL}/wp-json/morty/v1/category-by-slug?slug=cursos`, { next: { revalidate: 3600 } });
    if (!catResponse.ok) {
      const errorText = await catResponse.text();
      console.error("Failed to fetch course category:", catResponse.status, errorText);
      return NextResponse.json({ error: `Failed to fetch course category: ${catResponse.statusText}` }, { status: catResponse.status });
    }
    const courseCategory = await catResponse.json();
    const courseCategoryId = courseCategory?.id;

    if (!courseCategoryId) {
      return NextResponse.json({ error: 'Course category not found' }, { status: 404 });
    }

    // 2. Fetch products excluding the course category
    const productsApiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
    productsApiUrl.searchParams.set('category_exclude', courseCategoryId);
    productsApiUrl.searchParams.set('per_page', limit);

    const productsResponse = await fetch(productsApiUrl.toString(), { next: { revalidate: 3600 } }); // Revalidate every hour
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

    