
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CourseDetails } from '@/components/CourseDetails';

interface Review {
  id: number;
  review: string;
  rating: number;
  reviewer: string;
  reviewer_avatar_urls: { [key: string]: string };
  date_created: string;
}

interface Course {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  average_rating: number;
  rating_count: number;
  category_names: string[];
  sku: string;
  tags: { name: string; slug: string }[];
  attributes: { name: string; options: string[] }[] | Record<string, { name: string; options: string[] }>;
  reviews: Review[];
}

async function getCourse(slug: string): Promise<Course | null> {
    const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    if (!apiUrl) {
        console.error("[SERVER] Error: La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_STORE_URL no está configurada.");
        return null;
    }

    try {
        const url = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        url.searchParams.set('slug', slug);
        url.searchParams.set('per_page', '1');
        
        const response = await fetch(url.toString(), { cache: 'no-store' });
        
        if (!response.ok) {
            console.error(`[SERVER] Failed to fetch course. Status: ${response.status}`);
            return null;
        }
        
        const courses = await response.json();
        if (courses.length === 0) {
            return null;
        }
        
        const fetchedCourse = courses[0];

        if (fetchedCourse && fetchedCourse.category_names && fetchedCourse.category_names.includes('Cursos')) {
            return fetchedCourse;
        } else {
            return null;
        }
    } catch (err) {
        console.error('[SERVER] An unexpected error occurred:', err);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourse(params.slug);

  if (!course) {
    return {
      title: 'Curso no encontrado',
      description: 'El curso que buscas no existe o no está disponible.',
    };
  }

  const cleanDescription = course.short_description.replace(/<[^>]*>?/gm, '');

  return {
    title: course.name,
    description: cleanDescription,
    openGraph: {
      title: course.name,
      description: cleanDescription,
      images: course.images.length > 0 ? [course.images[0].src] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.name,
      description: cleanDescription,
      images: course.images.length > 0 ? [course.images[0].src] : [],
    },
  };
}


export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }

  return <CourseDetails course={course} />;
}
