
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Star, CakeSlice } from 'lucide-react';
import Link from 'next/link';
import { testimonials } from '@/lib/testimonials';
import { useEffect, useState, useRef } from 'react';
import Autoplay from "embla-carousel-autoplay"
import { Skeleton } from '@/components/ui/skeleton';
import { ShareButton } from '@/components/ShareButton';
import { trackViewDetails } from '@/lib/events';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  menu_order: number;
  category_names: string[];
}

interface Post {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_image_url: string | null;
}

const localGalleryImages = Array.from({ length: 9 }, (_, i) => ({
  src: `/image/galeria/foto${i + 1}.webp`,
  alt: `Imagen de la galería de repostería ${i + 1}`,
}));

function FeaturedCourses() {
  const [courses, setCourses] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
    
    async function fetchCourses() {
      const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
      if (!apiUrl) {
        setLoading(false);
        return;
      }

      try {
        const coursesApiUrl = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        coursesApiUrl.searchParams.set('category_slug', 'cursos');
        coursesApiUrl.searchParams.set('per_page', '3'); 

        const response = await fetch(coursesApiUrl.toString(), { 
            signal: AbortSignal.timeout(30000),
            next: { revalidate: 3600 }
        });
        
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {[...Array(3)].map((_, i) => (
           <Card key={i}>
             <div className="aspect-[4/3] w-full bg-muted relative rounded-t-lg overflow-hidden">
                <Skeleton className="w-full h-full" />
             </div>
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
               <Skeleton className="h-10 w-full" />
            </CardContent>
             <CardFooter className="flex-col items-center gap-2 bg-muted/30 p-4">
               <Skeleton className="h-8 w-1/4" />
               <Skeleton className="h-10 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!courses.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {courses.map(course => (
         <Card key={course.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card group">
          <Link href={`/courses/${course.slug}`} className="flex flex-col flex-grow" onClick={() => trackViewDetails(course.name, 'Curso')}>
              <div className="relative">
                <ShareButton 
                    title={course.name} 
                    text={`Echa un vistazo a este curso: ${course.name}`} 
                    url={`${siteUrl}/courses/${course.slug}`}
                    className="absolute top-2 right-2 z-10 h-8 w-8"
                    size="icon"
                  />
                <div className="aspect-[4/3] w-full bg-muted relative rounded-t-lg overflow-hidden">
                  {course.images?.[0]?.src ? (
                      <Image
                        src={course.images[0].src}
                        alt={course.name}
                        fill
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted"></div>
                    )}
                  </div>
              </div>
              <CardContent className="flex flex-col flex-grow p-6">
                <CardTitle className="font-card-title text-xl mb-2">{course.name}</CardTitle>
                <CardDescription className="flex-grow text-sm" dangerouslySetInnerHTML={{ __html: course.short_description || '' }} />
              </CardContent>
              <CardFooter className="flex-col items-center gap-2 bg-muted/30 p-4 mt-auto">
                <span className="text-2xl font-bold text-primary">
                  {course.price === "0.00" ? 'Gratis' : `€${course.price}`}
                </span>
                <Button variant="secondary" size="sm" className="w-full">Ver Detalles</Button>
              </CardFooter>
            </Link>
        </Card>
      ))}
    </div>
  );
}


function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
    
    async function fetchProducts() {
      const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
      if (!apiUrl) {
        setLoading(false);
        return;
      }

      try {
        const productsApiUrl = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        productsApiUrl.searchParams.set('category_exclude_slug', 'cursos');
        productsApiUrl.searchParams.set('per_page', '10');

        const response = await fetch(productsApiUrl.toString(), {
            signal: AbortSignal.timeout(30000),
            next: { revalidate: 3600 }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        
        const filteredProducts = data.filter((product: Product) => 
            !product.category_names.includes('Cursos')
        ).slice(0, 3); 

        setProducts(filteredProducts);
      } catch (err) {
        console.error('[CLIENT] An unexpected error occurred fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {[...Array(3)].map((_, i) => (
           <Card key={i}>
            <div className="aspect-[4/3] w-full bg-muted relative rounded-t-lg overflow-hidden">
                <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
               <Skeleton className="h-10 w-full" />
            </CardContent>
             <CardFooter className="flex-col items-center gap-2 bg-muted/30 p-4">
               <Skeleton className="h-8 w-1/4" />
               <Skeleton className="h-10 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!products.length) {
    return null; 
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {products.map(product => (
         <Card key={product.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card group">
          <Link href={`/shop/${product.slug}`} className="flex flex-col flex-grow" onClick={() => trackViewDetails(product.name, 'Producto')}>
              <div className="relative">
                <ShareButton 
                    title={product.name} 
                    text={`Echa un vistazo a este producto: ${product.name}`} 
                    url={`${siteUrl}/shop/${product.slug}`}
                    className="absolute top-2 right-2 z-10 h-8 w-8"
                    size="icon"
                  />
                <div className="aspect-[4/3] w-full bg-muted relative rounded-t-lg overflow-hidden">
                  {product.images?.[0]?.src ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        fill
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted"></div>
                    )}
                  </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <CardTitle className="font-card-title text-xl mb-2">{product.name}</CardTitle>
                <CardDescription className="text-sm flex-grow" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
              </CardContent>
              <CardFooter className="flex-col items-center gap-2 bg-muted/30 p-4 mt-auto">
                <span className="text-2xl font-bold text-primary">
                  {product.price === "0.00" ? 'Gratis' : `€${product.price}`}
                </span>
                <Button variant="secondary" size="sm" className="w-full">Ver Detalles</Button>
              </CardFooter>
            </Link>
        </Card>
      ))}
    </div>
  );
}

function FeaturedBlogPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
      if (!apiUrl) {
        setLoading(false);
        return;
      }
      try {
        const postsApiUrl = new URL(`${apiUrl}/wp-json/wp/v2/posts`);
        postsApiUrl.searchParams.set('per_page', '2'); // Obtener solo 2 posts
        postsApiUrl.searchParams.set('_embed', ''); // Para obtener info como la imagen destacada

        const response = await fetch(postsApiUrl.toString(), {
            signal: AbortSignal.timeout(30000),
            next: { revalidate: 3600 }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('[CLIENT] An unexpected error occurred fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <div className="aspect-[16/9] w-full relative rounded-t-lg overflow-hidden">
                <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {posts.map(post => (
        <Card key={post.id} className="overflow-hidden group shadow-md">
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative aspect-[16/9] bg-muted rounded-t-lg overflow-hidden">
                {post.featured_image_url ? (
                    <Image 
                        src={post.featured_image_url}
                        alt={`Imagen para ${post.title.rendered}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <div className="w-full h-full bg-muted"></div>
                )}
            </div>
            <CardContent className="p-6">
                <CardTitle className="font-card-title text-xl mt-2">{post.title.rendered}</CardTitle>
                <div className="text-muted-foreground mt-2 text-sm" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}/>
            </CardContent>
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
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);


  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] bg-black text-white flex items-center justify-center">
         <Image 
            src="/image/fondo_heder.webp" 
            alt="Mujer decorando una tarta con flores frescas"
            fill
            className="object-cover opacity-60"
            priority
         />
         <div className="relative z-10 text-center container mx-auto px-4">
            <h1 className="font-headline text-4xl md:text-6xl leading-tight">
              Transforma tu Pasión por la Repostería en Arte
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
              Aprende desde cero con nuestros cursos online y en vivo, y crea postres que cuenten una historia.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/courses">Ver Todos los Cursos</Link>
            </Button>
         </div>
      </section>

      {/* 2. Featured Courses Section */}
      <section id="featured-courses" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">Cursos Destacados</h2>
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

      {/* 3. Featured Products Section */}
      <section id="featured-products" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">Nuestros Productos</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Descubre nuestros productos estrella, perfectos para empezar a crear.
            </p>
          </div>
          <FeaturedProducts />
           <div className="text-center mt-12">
              <Button asChild>
                  <Link href="/shop">
                      Ver toda la tienda
                  </Link>
              </Button>
          </div>
        </div>
      </section>
      
      {/* New Custom Cake Section */}
      <section id="custom-cake" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-muted/30 rounded-lg p-8 md:p-12">
                <div className="relative w-full aspect-square md:aspect-[4/5] rounded-lg overflow-hidden shadow-lg -m-4 md:-m-16">
                    <Image 
                        src="https://picsum.photos/seed/custom-cake/800/1000"
                        alt="Tarta de boda espectacular con varias capas y flores"
                        fill
                        className="object-cover"
                        data-ai-hint="wedding cake flowers"
                        unoptimized
                    />
                </div>
                <div className="text-center md:text-left">
                    <CakeSlice className="w-12 h-12 text-primary mx-auto md:mx-0 mb-4" />
                    <h2 className="font-headline text-3xl md:text-4xl">¿Tienes una idea para una Tarta?</h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        Creamos la tarta de tus sueños, totalmente a medida para tu evento especial. Cada detalle, desde el sabor hasta el último adorno, está hecho para ti.
                    </p>
                    <p className="mt-4 text-muted-foreground">
                        Cuéntanos tu visión, comparte tus imágenes de inspiración y déjanos crear algo mágico juntos. Recibirás un presupuesto personalizado sin compromiso.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/tarta-a-medida">
                            Pide tu Tarta a Medida
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* 4. About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
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
              <h2 className="font-headline text-3xl md:text-4xl">La Magia detrás de Morty's Cake</h2>
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

      {/* 5. Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="font-headline text-3xl md:text-4xl">Lo que dicen nuestros clientes</h2>
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
                              <CardFooter className="p-6 flex items-center gap-4 bg-muted/30">
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
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
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

      {/* 6. Gallery Section */}
      <section id="gallery" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl">Nuestra Galería</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Un vistazo a las dulces creaciones de nuestros cursos y encargos.
            </p>
          </div>
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent>
                {localGalleryImages.map((image, index) => ( // Show first 9 images
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <CardContent className="p-0 flex aspect-square items-center justify-center">
                           <div className="relative w-full h-full">
                             <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              />
                           </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
          </div>
           <div className="text-center mt-12">
              <Button asChild>
                  <Link href="/gallery">
                      Ver Galería Completa
                  </Link>
              </Button>
          </div>
        </div>
      </section>


      {/* 7. Blog Section */}
      <section id="blog" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                  <h2 className="font-headline text-3xl md:text-4xl">Desde nuestra cocina</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                      Consejos, recetas e inspiración para tu viaje en la repostería.
                  </p>
              </div>
              <FeaturedBlogPosts />
              <div className="text-center mt-12">
                  <Button asChild variant="outline">
                      <Link href="/blog">Visitar el Blog</Link>
                  </Button>
              </div>
          </div>
      </section>
      
       {/* 8. CTA Section */}
        <section id="cta" className="w-full py-16 md:py-24 bg-primary/20">
            <div className="container px-4 md:px-6 mx-auto text-center">
                 <h2 className="font-headline text-3xl md:text-4xl text-primary-foreground/90">¿Listo para empezar a crear?</h2>
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
