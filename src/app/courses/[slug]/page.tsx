
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CourseDetails } from '@/components/CourseDetails';

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
}

async function getCourse(slug: string): Promise<Course | null> {
    const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
    if (!apiUrl) {
        console.error("[SERVER] Error: La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_API_URL no está configurada.");
        return null;
    }

    try {
        const url = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        url.searchParams.set('slug', slug);
        url.searchParams.set('per_page', '1');
        
        const response = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Revalidar cada hora
        
        if (!response.ok) {
            console.error(`[SERVER] Failed to fetch course. Status: ${response.status}`);
            return null;
        }
        
        const courses = await response.json();
        if (courses.length === 0) {
            return null;
        }
        
        const fetchedCourse = courses[0];

        // Ensure we don't show a product in the course page
        if (fetchedCourse && fetchedCourse.category_names && fetchedCourse.category_names.includes('Cursos')) {
            // Remove reviews from the object as they won't be used
            const { reviews, ...courseWithoutReviews } = fetchedCourse;
            return courseWithoutReviews;
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
  const imageUrl = course.images?.[0]?.src;

  return {
    title: course.name,
    description: cleanDescription,
    openGraph: {
      title: course.name,
      description: cleanDescription,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.name,
      description: cleanDescription,
      images: imageUrl ? [imageUrl] : [],
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
