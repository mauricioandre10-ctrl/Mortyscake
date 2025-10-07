
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'alpha-asc' | 'alpha-desc' | 'date-desc';

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Popularidad' },
    { value: 'date-desc', label: 'Más Recientes' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'alpha-asc', label: 'Alfabético: A-Z' },
    { value: 'alpha-desc', label: 'Alfabético: Z-A' },
];

const CACHE_KEY = 'all_courses_cache';
const CACHE_DURATION = 3600 * 1000; // 1 hora en milisegundos
const WP_API_URL = 'https://tecnovacenter.shop';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOption>('default');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      let dataLoaded = false;

      // 1. Intentar cargar desde la caché
      try {
          const cachedItem = localStorage.getItem(CACHE_KEY);
          if (cachedItem) {
              const { timestamp, data } = JSON.parse(cachedItem);
              if ((new Date().getTime() - timestamp) < CACHE_DURATION) {
                  setCourses(data);
                  setLoading(false);
                  dataLoaded = true;
              }
          }
      } catch(e) {
          console.error("Failed to read from localStorage", e);
      }

      // 2. Fetch de la red
      try {
        const catResponse = await fetch(`${WP_API_URL}/wp-json/morty/v1/category-by-slug?slug=cursos`);
        const courseCategory = await catResponse.json();

        if (!courseCategory || courseCategory.error) {
            console.error('Course category not found or API error:', courseCategory?.error);
            if (!dataLoaded) setLoading(false);
            return;
        }
        
        const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?category=${courseCategory.id}&per_page=100`);
        const data = await response.json();
        
        // Actualizar estado y caché
        setCourses(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: new Date().getTime(), data }));

      } catch (error) {
        console.error('Error fetching course products from API:', error);
      } finally {
        if(!dataLoaded) setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const sortedCourses = useMemo(() => {
    const sorted = [...courses];
    switch (sortOrder) {
      case 'price-desc':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'price-asc':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'alpha-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
      case 'default':
      default:
        // Default is based on menu_order which corresponds to popularity/default sort
        return courses.sort((a, b) => a.menu_order - b.menu_order);
    }
  }, [courses, sortOrder]);
  
  const showLoadingSkeleton = loading && courses.length === 0;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestros Cursos</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Desde técnicas fundamentales hasta decoración avanzada, encuentra el curso perfecto para elevar tu repostería.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <span className="text-sm font-medium mr-2 text-muted-foreground">Ordenar por:</span>
        {sortOptions.map(option => (
          <Button
            key={option.value}
            variant={sortOrder === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortOrder(option.value)}
            className="rounded-full"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {showLoadingSkeleton ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCourses.map((course: any) => (
            <Card key={course.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardHeader className="p-0">
                <Link href={`/courses/${course.slug}`} className="block relative aspect-[4/3]">
                  {course.images && course.images[0] ? (
                    <Image
                      src={course.images[0].src}
                      alt={course.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-6">
                 <CardTitle as="h3" className="font-headline text-xl mb-2">{course.name}</CardTitle>
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
                <Button asChild>
                  <Link href={`/courses/${course.slug}`}>
                      Ver Detalles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

    