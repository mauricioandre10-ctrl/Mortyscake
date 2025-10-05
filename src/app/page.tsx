'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { courses, isEuroCourse } from '@/lib/courses';
import { testimonials } from '@/lib/testimonials';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AddToCart } from '@/components/AddToCart';
import { getFeaturedProducts } from '@/app/actions/product-actions';

// Datos simulados para el blog
const blogPosts = [
  {
    slug: 'secretos-merengue-perfecto',
    title: '5 Secretos para un Merengue Suizo Perfecto',
    description: 'Descubre los trucos de profesional para lograr un merengue brillante, sedoso y estable que llevará tus postres al siguiente nivel.',
    image: { src: '/image/blog-1.webp', hint: 'meringue' },
    category: 'Técnicas',
  },
  {
    slug: 'tendencias-decoracion-tartas-2025',
    title: 'Tendencias en Decoración de Tartas para 2025',
    description: 'Desde diseños minimalistas hasta texturas inspiradas en la naturaleza, te mostramos lo que viene para que tus creaciones sorprendan.',
    image: { src: '/image/blog-2.webp', hint: 'cake trends' },
    category: 'Inspiración',
  }
];


export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error fetching products from WooCommerce:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] bg-black text-white flex items-center justify-center">
         <Image 
            src="/image/hero-background.webp" 
            alt="Mujer decorando una tarta con flores frescas"
            fill
            className="object-cover opacity-40"
            priority
            data-ai-hint="woman decorating cake"
         />
         <div className="relative z-10 text-center container mx-auto px-4">
            <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight">
              Transforma tu Pasión por la Repostería en Arte
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
              Aprende desde cero con nuestros cursos online y en vivo, y crea postres que cuenten una historia.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/#courses">Ver Próximos Cursos</Link>
            </Button>
         </div>
      </section>

      {/* 2. Categories Section (Shop & Courses) */}
      <section id="categories" className="w-full py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link href="/#courses" className="group block">
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[4/3] w-full">
                  <Image src="/image/category-courses.webp" alt="Alumna decorando un pastel en un curso" fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="pastry class" />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Cursos de Repostería</CardTitle>
                  <CardDescription>Aprende técnicas profesionales desde casa.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <span className="flex items-center text-primary font-semibold">
                    Explorar Cursos <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
            <Link href="/shop" className="group block">
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[4/3] w-full">
                  <Image src="/image/category-shop.webp" alt="Productos de repostería de alta calidad" fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="baking products" />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Nuestros Productos</CardTitle>
                  <CardDescription>Ingredientes y herramientas de alta calidad para tus creaciones.</CardDescription>
                </CardHeader>
                <CardFooter>
                   <span className="flex items-center text-primary font-semibold">
                    Ir a la Tienda <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Courses Section */}
      <section id="courses" className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Próximos Cursos</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Desde técnicas fundamentales hasta decoración avanzada, encuentra el curso perfecto para elevar tu repostería.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {courses.map((course) => (
              <Card key={course.title} className="flex flex-col overflow-hidden hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={course.image.src}
                      alt={`Imagen de ${course.title} - ${course.image.hint}`}
                      data-ai-hint={course.image.hint}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow p-6">
                  <CardTitle as="h3" className="font-headline text-xl mb-2">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/30 p-4">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-primary">
                      {course.price === 0 ? 'Gratis' : `${isEuroCourse(course.slug) ? '€' : '$'}${course.price}`}
                    </span>
                  </div>
                  <Button asChild>
                    <Link href={`/courses/${course.slug}`}>
                      Ver Detalles
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section id="products" className="w-full py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Nuestros Productos Destacados</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Selección de ingredientes y herramientas de alta calidad para llevar tus creaciones al siguiente nivel.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-md">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-6 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center bg-muted/30 p-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-1/2" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              products.map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card">
                   <CardHeader className="p-0">
                    <Link href={`/shop/${product.slug}`} className="block relative aspect-square">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.name}
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
                    <CardTitle as="h3" className="font-headline text-xl mb-2">
                      <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                    </CardTitle>
                    <CardDescription className="text-sm" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center bg-muted/30 p-4 mt-auto">
                    <span className="text-2xl font-bold text-primary">
                      €{product.price}
                    </span>
                    <AddToCart
                      name={product.name}
                      description={product.short_description || ''}
                      id={String(product.id)}
                      price={parseFloat(product.price)}
                      currency="EUR"
                      image={product.images?.[0]?.src || ''}
                    />
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
           <div className="text-center mt-12">
              <Button asChild size="lg">
                  <Link href="/shop">
                      Ver todos los productos
                  </Link>
              </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
                <Image 
                    src="/image/chef.webp"
                    alt="Retrato de Morty, la chef de repostería"
                    fill
                    className="object-cover"
                    data-ai-hint="chef portrait"
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
      <section id="testimonials" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Lo que dicen nuestros alumnos</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  La mayor satisfacción es ver cómo mis alumnos descubren su propio talento.
              </p>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                      <Card key={index} className="text-left bg-card flex flex-col">
                          <CardContent className="p-6 flex-grow">
                              <div className="flex mb-4">
                                  {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                              </div>
                              <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                          </CardContent>
                          <CardFooter className="flex items-center gap-4 p-6 bg-muted/30">
                              <Image
                                  src={testimonial.avatar}
                                  alt={`Avatar de ${testimonial.name}`}
                                  width={48}
                                  height={48}
                                  className="rounded-full object-cover h-12 w-12"
                                  data-ai-hint="person avatar"
                              />
                              <div>
                                  <p className="font-semibold">{testimonial.name}</p>
                                  <p className="text-sm text-muted-foreground">{testimonial.course}</p>
                              </div>
                          </CardFooter>
                      </Card>
                  ))}
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
                      <Card key={post.slug} className="overflow-hidden group">
                        <Link href={`/blog/${post.slug}`} className="block">
                          <div className="relative aspect-[16/9]">
                              <Image 
                                  src={post.image.src}
                                  alt={`Imagen para ${post.title}`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  data-ai-hint={post.image.hint}
                              />
                          </div>
                          <CardContent className="p-6">
                              <span className="text-sm text-primary font-semibold">{post.category}</span>
                              <h3 className="font-headline text-xl font-bold mt-2">{post.title}</h3>
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

    </div>
  );
}
