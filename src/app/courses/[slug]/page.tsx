
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddToCart } from '@/components/AddToCart';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ShareButton } from '@/components/ShareButton';

const WP_API_URL = 'https://cms.mortyscake.es';

// This enables ISR (Incremental Static Regeneration)
// The page will be re-generated at most once per hour
export const revalidate = 3600;

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
}

// This function tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  try {
    const catResponse = await fetch(`${WP_API_URL}/wp-json/morty/v1/category-by-slug?slug=cursos`);
    if (!catResponse.ok) return [];

    const courseCategory = await catResponse.json();
    if (!courseCategory?.id) return [];

    const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?category=${courseCategory.id}&per_page=100`);
    if (!response.ok) return [];

    const courses: Course[] = await response.json();
    return courses.map((course) => ({
      slug: course.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for courses:', error);
    return [];
  }
}

async function getCourse(slug: string): Promise<Course | null> {
  try {
    const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?slug=${slug}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }
  
  const fullDescription = course.description || course.short_description || 'No hay descripción disponible.';

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/courses">
            <ArrowLeft className="mr-2" />
            Volver a Cursos
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {course.images?.length > 0 ? (
                course.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="aspect-square relative rounded-lg overflow-hidden border">
                      <Image
                        src={image.src}
                        alt={image.alt || course.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                    <div className="w-full h-full bg-muted"></div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {course.images?.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
              </>
            )}
          </Carousel>
        </div>

        <div className="flex flex-col">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < course.average_rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({course.rating_count} reseñas)</span>
          </div>

          <div 
            className="prose dark:prose-invert max-w-none text-muted-foreground flex-grow"
            dangerouslySetInnerHTML={{ __html: fullDescription }}
          />

          <div className="mt-8 pt-8 border-t">
              <div className="flex justify-between items-center mb-6">
                  <span className="text-4xl font-bold text-primary">
                      {course.price === "0.00" ? 'Gratis' : `€${course.price}`}
                  </span>
                  <ShareButton title={course.name} text={`Echa un vistazo a este curso: ${course.name}`} />
              </div>
            
              <AddToCart 
                  name={course.name}
                  description={course.short_description || ''}
                  id={String(course.id)}
                  price={parseFloat(course.price)}
                  currency="EUR"
                  image={course.images?.[0]?.src}
                  className="w-full"
                  size="lg"
              >
                  {course.price === "0.00" ? "Inscribirse Gratis" : "Añadir al carrito"}
              </AddToCart>
          </div>
        </div>
      </div>
    </div>
  );
}
