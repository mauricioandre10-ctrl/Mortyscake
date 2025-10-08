
import { NextResponse } from 'next/server';

const WP_API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

export async function GET(request: Request) {
  if (!WP_API_URL) {
    return NextResponse.json({ error: 'WordPress API URL not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '100';

  try {
    // 1. Get Course Category ID
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

    // 2. Fetch Courses from that category
    const coursesApiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
    coursesApiUrl.searchParams.set('category', courseCategoryId);
    coursesApiUrl.searchParams.set('per_page', limit);
    
    const coursesResponse = await fetch(coursesApiUrl.toString(), { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!coursesResponse.ok) {
       const errorText = await coursesResponse.text();
      console.error("Failed to fetch courses:", coursesResponse.status, errorText);
      return NextResponse.json({ error: `Failed to fetch courses: ${coursesResponse.statusText}` }, { status: coursesResponse.status });
    }
    const courses = await coursesResponse.json();

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error in /api/courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

    