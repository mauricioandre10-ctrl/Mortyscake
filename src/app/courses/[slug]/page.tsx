import { courses } from '@/lib/courses';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Banknote, Video, Users } from 'lucide-react';

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = courses.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={course.image.src}
              alt={course.title}
              data-ai-hint={course.image.hint}
              fill
              className="object-cover"
            />
          </div>
           <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h2 className="font-headline text-2xl font-bold mb-4">Detalles del Curso</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Video className="h-4 w-4 mr-3 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold">Modalidad:</span> Online (Live View)
                      <p className="text-muted-foreground text-xs">Clases en vivo y en directo con el instructor.</p>
                    </div>
                  </div>
                   <div className="flex items-start">
                    <CalendarDays className="h-4 w-4 mr-3 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold">Fecha:</span> {course.schedule}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-3 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold">Duración:</span> {course.duration}
                    </div>
                  </div>
                   <div className="flex items-start">
                    <Users className="h-4 w-4 mr-3 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold">Acceso:</span> Grupos reducidos
                      <p className="text-muted-foreground text-xs">Plazas limitadas para una experiencia personalizada.</p>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-center">
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground text-lg mb-6">{course.description}</p>
            
            <div className="border rounded-lg p-6">
                <h2 className="font-headline text-2xl font-bold mb-4">Detalles de la Inscripción</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Precio del curso</span>
                        <span className="font-bold text-2xl text-primary">
                          {course.slug === 'mi-primera-tarta' ? '€' : '$'}
                          {course.price}
                        </span>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Instrucciones de Pago</h3>
                        <p className="text-sm text-muted-foreground mb-2">Para confirmar tu inscripción, por favor realiza una transferencia bancaria a la siguiente cuenta:</p>
                        <ul className="text-sm space-y-1 bg-background p-3 rounded-md">
                            <li><strong>Banco:</strong> Banco Ficticio S.A.</li>
                            <li><strong>Titular:</strong> Morty Smith</li>
                            <li><strong>Nº de Cuenta:</strong> ES00 1234 5678 9012 3456 7890</li>
                            <li><strong>Concepto:</strong> {course.title}</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">Una vez realizado el pago, envía el comprobante a nuestro correo electrónico para finalizar la inscripción.</p>
                    </div>
                </div>
                 <Button size="lg" className="w-full mt-6">
                  <Banknote className="mr-2" /> Pagar con Transferencia
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-2">El link para la clase se compartirá en las primeras 24 horas después de confirmado el pago.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
