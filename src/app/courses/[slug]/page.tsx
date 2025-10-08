
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
  const apiUrl = process.env.WOOCOMMERCE_API_URL;
  console.log('[getCourse] WOOCOMMERCE_API_URL:', apiUrl);

  if (!apiUrl) {
    console.error("[getCourse] Error: La variable de entorno WOOCOMMERCE_API_URL no está configurada.");
    return null;
  };

  try {
    const url = new URL(`${apiUrl}/wp-json/morty/v1/products`);
    url.searchParams.set('slug', slug);
    url.searchParams.set('per_page', '1');
    
    console.log(`[getCourse] Fetching URL: ${url.toString()}`);

    const response = await fetch(url.toString(), { next: { revalidate: 60 } });
    
    console.log(`[getCourse] Response status for slug ${slug}: ${response.status}`);

    if (!response.ok) {
        console.error(`[getCourse] Failed to fetch course. Status: ${response.status}, StatusText: ${response.statusText}`);
        return null;
    }
    
    const courses = await response.json();
    if (courses.length === 0) {
        console.log(`[getCourse] No course found for slug: ${slug}`);
        return null;
    }
    
    const course = courses[0];

    // After fetching the specific slug, ensure it's actually a course.
    if (course && course.category_names && course.category_names.includes('Cursos')) {
        console.log(`[getCourse] Successfully found course: ${course.name}`);
        return course;
    }

    // If no product is found, or it's not in the 'Cursos' category, return null.
    console.log(`[getCourse] Product found for slug ${slug}, but it's not in 'Cursos' category.`);
    return null;
  } catch (error) {
    console.error('[getCourse] An unexpected error occurred:', error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }
  
  const fullDescription = course.description || course.short_description || 'No hay descripción disponible.';
  const courseAttributes = Array.isArray(course.attributes) ? course.attributes : Object.values(course.attributes);

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
           <div className="flex justify-between items-start">
             <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">{course.name}</h1>
             <ShareButton title={course.name} text={`Echa un vistazo a este curso: ${course.name}`} />
           </div>
          
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
              <div className="flex items-center mb-6">
                  <span className="text-4xl font-bold text-primary">
                      {course.price === "0.00" ? 'Gratis' : `€${course.price}`}
                  </span>
              </div>
            
              <AddToCart 
                  id={String(course.id)}
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
             <table className="w-full text-sm">
                <tbody>
                  {course.sku && (
                     <tr className="border-b">
                        <td className="py-3 font-semibold pr-4">SKU</td>
                        <td className="py-3">{course.sku}</td>
                    </tr>
                  )}
                  {courseAttributes && courseAttributes.map((attr, index) => (
                    attr.name && attr.options.length > 0 && (
                        <tr key={index} className="border-b">
                        <td className="py-3 font-semibold pr-4">{attr.name}</td>
                        <td className="py-3">{attr.options.join(', ')}</td>
                        </tr>
                    )
                  ))}
                  {course.tags?.length > 0 && (
                    <tr className="border-b">
                        <td className="py-3 font-semibold pr-4 align-top">Etiquetas</td>
                        <td className="py-3">
                           <div className="flex flex-wrap gap-2">
                                {course.tags.map(tag => (
                                    <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                                ))}
                            </div>
                        </td>
                    </tr>
                   )}
                </tbody>
            </table>
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
