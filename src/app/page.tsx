import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';

const courses = [
  {
    title: 'Art of the Croissant',
    description: 'Master the delicate art of French viennoiserie. Learn lamination, shaping, and baking to perfection.',
    price: 199,
    schedule: 'Saturdays, 9am - 1pm',
    duration: '4 weeks',
    image: {
      src: 'https://picsum.photos/600/400',
      width: 600,
      height: 400,
      hint: 'croissant pastry'
    }
  },
  {
    title: 'Modern Cake Design',
    description: 'Explore contemporary cake decorating techniques, from mirror glazes to abstract chocolate work.',
    price: 249,
    schedule: 'Sundays, 10am - 2pm',
    duration: '5 weeks',
    image: {
      src: 'https://picsum.photos/600/401',
      width: 600,
      height: 401,
      hint: 'modern cake'
    }
  },
  {
    title: 'Sourdough Bread Science',
    description: 'Dive deep into the science of wild yeast. Cultivate your own starter and bake rustic, flavorful loaves.',
    price: 179,
    schedule: 'Tues & Thurs, 6pm - 8pm',
    duration: '3 weeks',
    image: {
      src: 'https://picsum.photos/600/402',
      width: 600,
      height: 402,
      hint: 'sourdough bread'
    }
  },
  {
    title: 'Macaron & Meringue',
    description: 'Perfect the notoriously tricky macaron and explore the versatility of meringue in various classic desserts.',
    price: 159,
    schedule: 'Mondays, 5pm - 8pm',
    duration: '2 weeks',
    image: {
      src: 'https://picsum.photos/600/403',
      width: 600,
      height: 403,
      hint: 'macaron cookies'
    }
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Artisanal pastries on a dark background"
          data-ai-hint="pastry background"
          fill
          className="object-cover -z-10 brightness-[0.4]"
        />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Discover the Art of Pastry
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-primary-foreground/80">
              Join our hands-on courses and transform your passion for baking into professional-level skill.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <a href="#courses">Explore Courses</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Courses</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              From foundational techniques to advanced decoration, find the perfect course to elevate your baking.
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
                  <Button>Enroll Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
