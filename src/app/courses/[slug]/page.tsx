
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ArrowLeft, Info, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddToCart } from '@/components/AddToCart';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ShareButton } from '@/components/ShareButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

const WP_API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

// This enables ISR (Incremental Static Regeneration)
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
  category_names: string[];
  sku: string;
  tags: { name: string; slug: string }[];
}

// This function tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  if (!WP_API_URL) return [];
  try {
    const apiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
    apiUrl.searchParams.set('category_slug', 'cursos');
    apiUrl.searchParams.set('per_page', '100');
    
    const response = await fetch(apiUrl.toString());
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
  if (!WP_API_URL) return null;
  try {
    const apiUrl = new URL(`${WP_API_URL}/wp-json/morty/v1/products`);
    apiUrl.searchParams.set('slug', slug);
    apiUrl.searchParams.set('per_page', '1');
    
    const response = await fetch(apiUrl.toString());
    if (!response.ok) return null;
    
    const courses = await response.json();
    if (courses.length === 0) return null;
    
    const course = courses[0];

    // After fetching the specific slug, ensure it's actually a course.
    if (course && course.category_names && course.category_names.includes('Cursos')) {
        return course;
    }

    // If no product is found, or it's not in the 'Cursos' category, return null.
    return null;
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1">
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

        <div className="flex flex-col lg:col-span-2">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">{course.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < course.average_rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({course.rating_count} reseñas)</span>
          </div>
          
           <div 
            className="prose dark:prose-invert max-w-none text-muted-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: course.short_description || '' }}
          />

          <div className="mt-auto">
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

       <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description"><FileText className="mr-2"/>Descripción</TabsTrigger>
            <TabsTrigger value="additional-info"><Info className="mr-2"/>Info Adicional</TabsTrigger>
            <TabsTrigger value="reviews"><MessageSquare className="mr-2"/>Valoraciones ({course.rating_count})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6 px-4 border rounded-b-md">
             <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: fullDescription }}
              />
          </TabsContent>
          <TabsContent value="additional-info" className="py-6 px-4 border rounded-b-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.sku && (
                    <div>
                        <h4 className="font-semibold mb-1">SKU</h4>
                        <p>{course.sku}</p>
                    </div>
                )}
                 {course.tags?.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-2">Etiquetas</h4>
                        <div className="flex flex-wrap gap-2">
                            {course.tags.map(tag => (
                                <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6 px-4 border rounded-b-md">
            <h3 className="text-xl font-bold mb-4">Opiniones de los alumnos</h3>
            <p className="text-muted-foreground">Actualmente no hay valoraciones para este curso.</p>
             {/* TODO: Implementar la muestra de valoraciones de WooCommerce */}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
