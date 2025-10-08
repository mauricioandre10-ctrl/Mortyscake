
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { ShareButton } from '@/components/ShareButton';
import { Suspense } from 'react';
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

async function getCourses(): Promise<Course[]> {
  const apiUrl = process.env.WOOCOMMERCE_API_URL;
  if (!apiUrl) {
    console.error('WooCommerce API URL not configured');
    return [];
  }
  
  try {
    const coursesApiUrl = new URL(`${apiUrl}/wp-json/morty/v1/products`);
    coursesApiUrl.searchParams.set('category_slug', 'cursos');
    coursesApiUrl.searchParams.set('per_page', '100');

    const response = await fetch(coursesApiUrl.toString(), { next: { revalidate: 60 } }); // Revalidate every minute
    if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    const data = await response.json();
    // Final safety filter
    return data.filter((item: Course) => 
        item.category_names && item.category_names.includes('Cursos')
    );
  } catch (error) {
    console.error('Error fetching course products from API:', error);
    return [];
  }
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
                  />
                ) : (
                   <div className="w-full h-full bg-muted"></div>
                )}
              </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-6">
             <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
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

async function CoursesList() {
    const courses = await getCourses();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    // Simple sort by date, can be expanded later
    const sortedCourses = courses.sort((a, b) => {
        const dateA = new Date(typeof a.date_created === 'object' ? a.date_created.date : a.date_created).getTime();
        const dateB = new Date(typeof b.date_created === 'object' ? b.date_created.date : b.date_created).getTime();
        return dateB - dateA;
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCourses.map((course: Course) => (
             <CourseCard key={course.id} course={course} siteUrl={siteUrl} />
          ))}
        </div>
    )
}

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestros Cursos</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Desde técnicas fundamentales hasta decoración avanzada, encuentra el curso perfecto para elevar tu repostería.
        </p>
      </header>
      
      {/* Sorting UI can be re-added here if needed, but would require client component */}

      <Suspense fallback={<LoadingSkeleton />}>
        <CoursesList />
      </Suspense>
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
