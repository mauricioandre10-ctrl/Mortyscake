import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';
import { courses } from '@/lib/courses';

export default function Home() {
  const isEuroCourse = (slug: string) => ['mi-primera-tarta', 'diseno-gourmet-de-pasteles'].includes(slug);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full">
        <section className="relative w-full h-0 pb-[25%] bg-black">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/6McqHZrP-IY?autoplay=1&mute=1&loop=1&playlist=6McqHZrP-IY&controls=0&showinfo=0&autohide=1&modestbranding=1"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Video de repostería"
          ></iframe>
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
                        alt={course.title}
                        data-ai-hint={course.image.hint}
                        fill
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
                    <Button asChild>
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
