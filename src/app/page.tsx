
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { testimonials } from '@/lib/testimonials';
import { galleryImages } from '@/lib/gallery-images';
import { useEffect, useState, useRef } from 'react';
import Autoplay from "embla-carousel-autoplay"
import { Skeleton } from '@/components/ui/skeleton';
import { ShareButton } from '@/components/ShareButton';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  menu_order: number;
  average_rating: number;
  rating_count: number;
  category_names: string[];
}

// Datos simulados para el blog
const blogPosts = [
  {
    slug: 'secretos-merengue-perfecto',
    title: '5 Secretos para un Merengue Suizo Perfecto',
    description: 'Descubre los trucos de profesional para lograr un merengue brillante, sedoso y estable que llevará tus postres al siguiente nivel.',
    image: { src: 'https://picsum.photos/seed/blog1/800/450', hint: 'meringue' },
    category: 'Técnicas',
  },
  {
    slug: 'tendencias-decoracion-tartas-2025',
    title: 'Tendencias en Decoración de Tartas para 2025',
    description: 'Desde diseños minimalistas hasta texturas inspiradas en la naturaleza, te mostramos lo que viene para que tus creaciones sorprendan.',
    image: { src: 'https://picsum.photos/seed/blog2/800/450', hint: 'cake trends' },
    category: 'Inspiración',
  }
];

function FeaturedCourses() {
  const [courses, setCourses] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    // Ensure we are on the client side before accessing window
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
    
    async function fetchCourses() {
      const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
      if (!apiUrl) {
        console.error("[CLIENT] Error: La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_STORE_URL no está configurada.");
        setLoading(false);
        return;
      }

      try {
        const coursesApiUrl = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        coursesApiUrl.searchParams.set('category_slug', 'cursos');
        coursesApiUrl.searchParams.set('per_page', '3'); // Fetch only 3 courses

        const response = await fetch(coursesApiUrl.toString(), { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('[CLIENT] An unexpected error occurred fetching featured courses:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
           <Card key={i}>
            <Skeleton className="aspect-[4/3] w-full" />
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
               <Skeleton className="h-10 w-full" />
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
  
  if (!courses.length) {
    return null; // Don't render the section if there are no courses
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map(course => (
         <Card key={course.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card group">
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
      ))}
    </div>
  );
}


export default function Home() {
  const plugin = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true })
  )
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    // Ensure we are on the client side before accessing window
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);


  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] bg-black text-white flex items-center justify-center">
         <Image 
            src="https://picsum.photos/seed/hero/1920/1080" 
            alt="Mujer decorando una tarta con flores frescas"
            fill
            className="object-cover opacity-40"
            priority
            data-ai-hint="woman decorating cake"
            unoptimized
         />
         <div className="relative z-10 text-center container mx-auto px-4">
            <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight">
              Transforma tu Pasión por la Repostería en Arte
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
              Aprende desde cero con nuestros cursos online y en vivo, y crea postres que cuenten una historia.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/courses">Ver Próximos Cursos</Link>
            </Button>
         </div>
      </section>

      {/* 2. Featured Courses Section */}
      <section id="featured-courses" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Cursos Destacados</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Empieza tu viaje en el mundo de la repostería con nuestros cursos más populares.
            </p>
          </div>
          <FeaturedCourses />
           <div className="text-center mt-12">
              <Button asChild>
                  <Link href="/courses">
                      Ver todos los cursos
                  </Link>
              </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
                <Image 
                    src="https://picsum.photos/seed/chef/800/1000"
                    alt="Retrato de Morty, la chef de repostería"
                    fill
                    className="object-cover"
                    data-ai-hint="chef portrait"
                    unoptimized
                />
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">La Magia detrás de Morty's Cake</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Hola, soy Morty. Mi viaje en la repostería comenzó como una forma de expresión, un lienzo en blanco donde azúcar, harina y pasión se encuentran.
              </p>
              <p className="mt-4 text-muted-foreground">
                En Morty's Cake, cada tarta es una obra de arte y cada curso una oportunidad para compartir los secretos que he aprendido. Mi misión es darte la confianza y las herramientas para que tú también puedas crear postres que no solo deleiten el paladar, sino que también cuenten tu propia historia. ¡Vamos a hornear juntos!
              </p>
              <Button asChild variant="link" className="mt-4 text-base px-0">
                  <Link href="/#about">
                      Conoce más sobre mi historia
                  </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Lo que dicen nuestros alumnos</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  La mayor satisfacción es ver la alegría en quienes prueban nuestras creaciones.
              </p>
              <Carousel
                plugins={[plugin.current]}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-xl lg:max-w-3xl mx-auto mt-12"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                     <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-4 h-full">
                          <Card className="text-left bg-card flex flex-col shadow-md h-full">
                              <CardContent className="p-6 flex-grow">
                                  <div className="flex mb-4">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                      ))}
                                  </div>
                                  <p className="text-muted-foreground italic text-sm">"{testimonial.quote}"</p>
                              </CardContent>
                              <CardFooter className="flex items-center gap-4 p-6 bg-muted/30">
                                  <Image
                                      src={testimonial.avatar}
                                      alt={`Avatar de ${testimonial.name}`}
                                      width={48}
                                      height={48}
                                      className="rounded-full object-cover h-12 w-12"
                                      data-ai-hint="person avatar"
                                      unoptimized
                                  />
                                  <div>
                                      <p className="font-semibold">{testimonial.name}</p>
                                      {testimonial.course && <p className="text-sm text-muted-foreground">{testimonial.course}</p>}
                                  </div>
                              </CardFooter>
                          </Card>
                        </div>
                     </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 md:-left-12" />
                <CarouselNext className="-right-4 md:-right-12" />
              </Carousel>
              <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                  <Link href="https://share.google/5iGt1ltt2KUW5eejD" target="_blank" rel="noopener noreferrer">
                    Ver todas las reseñas en Google
                  </Link>
                </Button>
              </div>
          </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Nuestra Galería</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Un vistazo a las dulces creaciones de nuestros cursos y encargos.
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {galleryImages.slice(0, 9).map((image, index) => ( // Show first 9 images
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                         <div className="relative w-full h-full">
                           <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover"
                              data-ai-hint={image.hint}
                              unoptimized
                            />
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
           <div className="text-center mt-12">
              <Button asChild>
                  <Link href="/gallery">
                      Ver Galería Completa
                  </Link>
              </Button>
          </div>
        </div>
      </section>


      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                  <h2 className="font-headline text-3xl md:text-4xl font-bold">Desde nuestra cocina</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                      Consejos, recetas e inspiración para tu viaje en la repostería.
                  </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {blogPosts.map(post => (
                      <Card key={post.slug} className="overflow-hidden group shadow-md">
                        <Link href={`/blog/${post.slug}`} className="block">
                          <div className="relative aspect-[16/9]">
                              <Image 
                                  src={post.image.src}
                                  alt={`Imagen para ${post.title}`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  data-ai-hint={post.image.hint}
                                  unoptimized
                              />
                          </div>
                          <CardContent className="p-6">
                              <span className="text-sm text-primary font-semibold">{post.category}</span>
                              <CardTitle className="font-headline text-xl mt-2">{post.title}</CardTitle>
                              <p className="text-muted-foreground mt-2 text-sm">{post.description}</p>
                          </CardContent>
                        </Link>
                      </Card>
                  ))}
              </div>
              <div className="text-center mt-12">
                  <Button asChild variant="outline">
                      <Link href="/blog">Visitar el Blog</Link>
                  </Button>
              </div>
          </div>
      </section>
      
       {/* CTA Section */}
        <section id="cta" className="w-full py-16 md:py-24 bg-primary/20">
            <div className="container px-4 md:px-6 mx-auto text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground/90">¿Listo para empezar a crear?</h2>
                 <p className="text-primary-foreground/70 mt-2 max-w-2xl mx-auto">
                     Explora nuestros cursos y encuentra el perfecto para ti, o visita nuestra tienda para conseguir los mejores ingredientes.
                 </p>
                <div className="flex justify-center gap-4 mt-8">
                    <Button asChild size="lg">
                        <Link href="/courses">Explorar Cursos</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/shop">Ir a la Tienda</Link>
                    </Button>
                </div>
            </div>
        </section>

    </div>
  );
}
