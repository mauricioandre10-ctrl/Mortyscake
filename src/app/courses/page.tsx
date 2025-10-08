
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { ShareButton } from '@/components/ShareButton';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  date_created: string | { date: string };
  menu_order: number;
  category_names: string[];
}

function CourseCard({ course, siteUrl }: { course: Course, siteUrl: string | undefined}) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card group">
      <Link href={`/courses/${course.slug}`} className="flex flex-col flex-grow">
          <CardHeader className="p-0 relative">
             <ShareButton 
                title={course.name} 
                text={`Echa un vistazo a este curso: ${course.name}`} 
                url={`${siteUrl}/courses/${course.slug}`}
                className="absolute top-2 right-2 z-10 h-8 w-8"
                size="icon"
              />
            <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
              {course.images?.[0]?.src ? (
                  <Image
                    src={course.images[0].src}
                    alt={course.name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                   <div className="w-full h-full bg-muted"></div>
                )}
              </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-6">
             <CardTitle className="font-card-title text-xl mb-2">{course.name}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < course.average_rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({course.rating_count} reseñas)</span>
                </div>
            <CardDescription className="flex-grow text-sm" dangerouslySetInnerHTML={{ __html: course.short_description || '' }} />
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted/30 p-4 mt-auto">
            <span className="text-2xl font-bold text-primary">
               {course.price === "0.00" ? 'Gratis' : `€${course.price}`}
            </span>
            <Button variant="secondary">Ver Detalles</Button>
          </CardFooter>
        </Link>
    </Card>
  );
}

function CoursesList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    useEffect(() => {
        async function fetchCourses() {
            const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
            console.log('[CLIENT] WOOCOMMERCE_API_URL:', apiUrl);

            if (!apiUrl) {
                console.error('[CLIENT] Error: La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_STORE_URL no está configurada.');
                setError('La configuración del sitio no es correcta.');
                setLoading(false);
                return;
            }
        
            try {
                const coursesApiUrl = new URL(`${apiUrl}/wp-json/morty/v1/products`);
                coursesApiUrl.searchParams.set('category_slug', 'cursos');
                coursesApiUrl.searchParams.set('per_page', '100');

                console.log(`[CLIENT] Fetching URL: ${coursesApiUrl.toString()}`);
                
                const response = await fetch(coursesApiUrl.toString(), { cache: 'no-store' });
                
                console.log(`[CLIENT] Response status: ${response.status}`);

                if (!response.ok) {
                    console.error(`[CLIENT] Failed to fetch courses. Status: ${response.status}, StatusText: ${response.statusText}`);
                    throw new Error(`Failed to fetch courses: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(`[CLIENT] Received ${data.length} items from API.`);
                
                const filteredData = data.filter((item: Course) => 
                    item.category_names && item.category_names.includes('Cursos')
                );
                console.log(`[CLIENT] Filtered to ${filteredData.length} courses.`);
                
                const sortedCourses = filteredData.sort((a: Course, b: Course) => {
                    const dateA = new Date(typeof a.date_created === 'object' ? a.date_created.date : a.date_created).getTime();
                    const dateB = new Date(typeof b.date_created === 'object' ? b.date_created.date : b.date_created).getTime();
                    return dateB - dateA;
                });

                setCourses(sortedCourses);

            } catch (err) {
                console.error('[CLIENT] An unexpected error occurred:', err);
                setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
            } finally {
                setLoading(false);
            }
        }
        
        fetchCourses();
    }, []);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <p className="text-center text-destructive col-span-full">Error al cargar los cursos: {error}</p>
    }

    if (courses.length === 0) {
        return <p className="text-center text-muted-foreground col-span-full">No se encontraron cursos en este momento. Por favor, inténtalo de nuevo más tarde.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: Course) => (
             <CourseCard key={course.id} course={course} siteUrl={siteUrl} />
          ))}
        </div>
    )
}

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Nuestros Cursos</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Desde técnicas fundamentales hasta decoración avanzada, encuentra el curso perfecto para elevar tu repostería.
        </p>
      </header>
      
      <CoursesList />
    </div>
  );
}

function LoadingSkeleton() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-[4/3] w-full" />
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

    