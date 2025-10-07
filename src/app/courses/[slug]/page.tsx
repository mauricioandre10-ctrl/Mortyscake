
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, ArrowLeft, Star, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { ShareButton } from '@/components/ShareButton';
import { notFound } from 'next/navigation';

const WP_API_URL = 'https://cms.mortyscake.com';

// This function is required for static export with dynamic routes.
// It tells Next.js not to pre-render any pages at build time.
// Data fetching will happen on the client side.
export async function generateStaticParams() {
  return [];
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

  // Critical check: If no course is found, stop execution immediately.
  if (!course) {
    notFound();
    return null; // Ensure no further rendering happens if course is not found.
  }

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
                src={course.images[0].src}
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
                            image={course.images?.[0]?.src || ''}
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
                          {course.attributes && course.attributes.map((attr: any) => (
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
