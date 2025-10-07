
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, ArrowLeft, Star, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { ShareButton } from '@/components/ShareButton';
import { notFound } from 'next/navigation';

const WP_API_URL = 'https://cms.mortyscake.com';

// This function tells Next.js which slugs to pre-render at build time.
// It's required for static export with dynamic routes.
export async function generateStaticParams() {
    try {
        // First, get the ID for the 'cursos' category
        const catResponse = await fetch(`${WP_API_URL}/wp-json/morty/v1/category-by-slug?slug=cursos`);
        if (!catResponse.ok) {
            console.error('Failed to fetch course category for static params, skipping.');
            return [];
        }
        const courseCategory = await catResponse.json();

        // Use term_id as per API response, with a fallback to id for robustness
        const categoryId = courseCategory.term_id || courseCategory.id;

        // If the category doesn't exist, we can't generate params.
        if (!categoryId) {
            console.error('Course category ID not found, skipping param generation.');
            return [];
        }

        // Then, fetch all products (courses) in that category
        const coursesResponse = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?category=${categoryId}&per_page=100`);
        if (!coursesResponse.ok) {
            console.error('Failed to fetch courses for static params, skipping.');
            return [];
        }
        const courses = await coursesResponse.json();
        
        // Return an array of objects, where each object has a `slug` property
        return courses.map((course: any) => ({
            slug: course.slug,
        }));
    } catch (error) {
        console.error("Error in generateStaticParams for courses:", error);
        // In case of any error, return an empty array to prevent build failure.
        return [];
    }
}


// Fetch a single course by its slug
async function getCourse(slug: string) {
    try {
        const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?slug=${slug}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        // The API returns an array, so we get the first element
        if (data && Array.isArray(data) && data.length > 0) {
            return data[0];
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch course on server", error);
        return null;
    }
}


export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);

  // If no course is found, render the 404 page.
  // This must be the very first check.
  if (!course) {
    notFound();
    return null; // <-- CRITICAL: Return null to stop execution.
  }

  const imageUrl = course.images?.[0]?.src || 'https://picsum.photos/seed/placeholder/800/600';

  return (
        <div className="container mx-auto py-12 px-4 md:px-6">
           <div className="mb-8">
                <Button asChild variant="outline" size="sm">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver a todos los cursos</span>
                    </Link>
                </Button>
            </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={course.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-2">
                     <h1 className="font-headline text-3xl md:text-4xl font-bold">{course.name}</h1>
                     <ShareButton title={course.name} text={`¡Mira este increíble curso de repostería: ${course.name}!`} />
                </div>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < course.average_rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({course.rating_count} reseñas)</span>
                </div>
                <div className="text-muted-foreground text-lg prose" dangerouslySetInnerHTML={{ __html: course.description }} />
                
                <Card className="border mt-4">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Precio del curso</span>
                            <span className="font-bold text-3xl text-primary">
                                 {course.price === "0.00" ? 'Gratis' : `€${course.price}`}
                            </span>
                        </div>
                         <AddToCart 
                            name={course.name}
                            description={course.short_description || ''}
                            id={String(course.id)}
                            price={parseFloat(course.price)}
                            currency="EUR"
                            image={imageUrl}
                            className="w-full"
                            size="lg"
                         >
                           {course.price === "0.00" ? "Inscribirse Gratis" : "Añadir al carrito"}
                         </AddToCart>
                         <div className="border-t pt-4 space-y-3 text-sm">
                          <div className="flex items-start">
                            <Video className="h-4 w-4 mr-3 mt-1 shrink-0" />
                            <div>
                              <span className="font-semibold">Acceso:</span> Inmediato y de por vida.
                              <p className="text-muted-foreground text-xs">Aprende a tu ritmo, cuando y donde quieras.</p>
                            </div>
                          </div>
                          {Array.isArray(course.attributes) && course.attributes.map((attr: any) => (
                             <div key={attr.id} className="flex items-start">
                                <Info className="h-4 w-4 mr-3 mt-1 shrink-0" />
                                <div>
                                    <span className="font-semibold">{attr.name}:</span> {attr.options.join(', ')}
                                </div>
                             </div>
                          ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
  );
}
