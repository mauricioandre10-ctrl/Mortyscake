'use client';

import Image from 'next/image';
import { ArrowLeft, FileText, Info, MessageSquare, Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShareButton } from './ShareButton';
import { trackAddToCart } from '@/lib/events';

interface Review {
  id: number;
  review: string;
  rating: number;
  reviewer: string;
  reviewer_avatar_urls: { [key: string]: string };
  date_created: string;
}

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
  reviews: Review[];
}

export function CourseDetails({ course }: { course: Course }) {
  const fullDescription = course.description || course.short_description || 'No hay descripción disponible.';
  const courseAttributes = Array.isArray(course.attributes) ? course.attributes : Object.values(course.attributes);

  const phoneNumber = "34616284463";
  const message = `¡Hola! Estoy interesado en el curso "${course.name}". ¿Podrías darme más información?`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

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
                        sizes="(max-width: 1024px) 100vw, 33vw"
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
            <h1 className="font-card-title text-4xl md:text-5xl mb-2">{course.name}</h1>
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
            <Button asChild size="lg" onClick={() => trackAddToCart(course.name, 'Curso', course.price)}>
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2" />
                {course.price === "0.00" ? "Inscribirse Gratis" : "Inscribirse por WhatsApp"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description"><FileText className="mr-2" />Descripción</TabsTrigger>
            <TabsTrigger value="additional-info"><Info className="mr-2" />Info Adicional</TabsTrigger>
            <TabsTrigger value="reviews"><MessageSquare className="mr-2" />Valoraciones ({course.rating_count})</TabsTrigger>
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
            <h3 className="text-xl font-bold mb-4">Opiniones de los alumnos ({course.reviews?.length || 0})</h3>
            {course.reviews && course.reviews.length > 0 ? (
              <div className="space-y-6">
                {course.reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.reviewer_avatar_urls['96']} alt={review.reviewer} />
                      <AvatarFallback>{review.reviewer.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{review.reviewer}</p>
                        <time dateTime={review.date_created} className="text-xs text-muted-foreground">
                          {format(new Date(review.date_created), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </time>
                      </div>
                      <div className="flex text-yellow-400 mt-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                        ))}
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: review.review }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Actualmente no hay valoraciones para este curso.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}
