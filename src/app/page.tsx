'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';
import { courses } from '@/lib/courses';
import { LiteYouTubeEmbed } from '@/components/LiteYouTubeEmbed';
import * as gtag from '@/lib/gtag';

export default function Home() {
  const isEuroCourse = (slug: string) => ['mi-primera-tarta', 'diseno-gourmet-de-pasteles'].includes(slug);

  const handleCtaClick = (courseName: string) => {
    gtag.event('iniciar_pago', {
      nombre_curso: courseName,
    });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full">
        <section className="w-full h-auto bg-black py-8 md:py-12">
          {/* SEO: El h1 está oculto visualmente pero disponible para los lectores de pantalla y buscadores */}
          <h1 className="sr-only">Transforma tu Pasión por la Repostería en Arte</h1>
          <div className="w-full md:w-[70%] mx-auto">
            <LiteYouTubeEmbed
                id="6McqHZrP-IY" 
                title="Video de repostería"
                noCookie={true}
                params="autoplay=1&mute=1&loop=1&playlist=6McqHZrP-IY&controls=0&showinfo=0&autohide=1&modestbranding=1"
                className="aspect-video rounded-lg shadow-2xl shadow-primary/20"
            />
          </div>
        </section>

        <section id="courses" className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Nuestros Cursos</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Desde técnicas fundamentales hasta decoración avanzada, encuentra el curso perfecto para elevar tu repostería.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
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
                    <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
                    <CardDescription className="flex-grow">{course.description}</CardDescription>
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
                        {isEuroCourse(course.slug) ? '€' : '$'}
                        {course.price}
                      </span>
                    </div>
                    <Button asChild onClick={() => handleCtaClick(course.title)}>
                      <Link href={`/courses/${course.slug}`}>
                        Inscribirse Ahora
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
