'use client';

import Image from 'next/image';
import { ArrowLeft, FileText, Info, Star, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';
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
import { ShareButton } from './ShareButton';
import { AddToCart } from './AddToCart';

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

export function CourseDetails({ course }: { course: Course }) {
  const fullDescription = course.description || course.short_description || 'No hay descripción disponible.';
  const courseAttributes = Array.isArray(course.attributes) ? course.attributes : Object.values(course.attributes);
  const googleReviewUrl = "https://share.google/5iGt1ltt2KUW5eejD"; // Direct link to leave a review

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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <Button asChild variant="outline" size="sm">
                <Link href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquarePlus className="mr-2 h-4 w-4"/>
                    Dejar una Reseña en Google
                </Link>
            </Button>
          </div>

          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: course.short_description || '' }}
          />

          <div className="mt-auto">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                {course.price === "0.00" ? 'Gratis' : `€${course.price}`}
              </span>
            </div>
            <AddToCart
                name={course.name}
                id={course.id.toString()}
                price={parseFloat(course.price)}
                currency="EUR"
                image={course.images?.[0]?.src}
                description={course.short_description}
                sku={course.sku}
                isCourse={true}
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description"><FileText className="mr-2" />Descripción</TabsTrigger>
            <TabsTrigger value="additional-info"><Info className="mr-2" />Info Adicional</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  )
}
