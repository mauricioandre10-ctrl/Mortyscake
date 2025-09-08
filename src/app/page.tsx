import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';
import { courses } from '@/lib/courses';

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full">
        <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
          <Image
            src="https://picsum.photos/1600/900"
            alt="Pasteles artesanales sobre un fondo oscuro"
            data-ai-hint="pastry background"
            fill
            className="object-cover -z-10 brightness-[0.4]"
          />
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Descubre el Arte de la Repostería
              </h1>
              <p className="mt-4 md:mt-6 text-lg md:text-xl text-primary-foreground/80">
                Únete a nuestros cursos prácticos y transforma tu pasión por la repostería en una habilidad profesional.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <a href="#courses">Explorar Cursos</a>
                </Button>
              </div>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                      <span className="text-2xl font-bold text-primary">${course.price}</span>
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
