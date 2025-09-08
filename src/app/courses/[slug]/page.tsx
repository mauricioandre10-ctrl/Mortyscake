import { courses } from '@/lib/courses';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Banknote, Video, Users, BookOpen, Lightbulb, Package, Laptop } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
       <div className="max-w-6xl mx-auto mt-12 pt-8 border-t">
        <h2 className="font-headline text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5" />
                <span>¿A quién está dirigido el curso?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">Este curso es perfecto para cualquier persona apasionada por la repostería, sin importar su nivel de experiencia. Si eres un principiante con ganas de aprender desde cero o si ya tienes algunas nociones y quieres perfeccionar tu técnica, ¡este es tu lugar! </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                <span>¿Qué materiales necesito?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">Te enviaremos una lista detallada de ingredientes y utensilios básicos de repostería que necesitarás. ¡No te preocupes! La mayoría son cosas que probablemente ya tienes en casa. Nos aseguraremos de que todo sea fácil de conseguir para que solo te enfoques en disfrutar y aprender.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
                <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5" />
                <span>¿Cómo funciona la modalidad 100% online?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">El curso es totalmente en vivo a través de una plataforma de video. Podrás interactuar con el instructor, hacer preguntas en tiempo real y compartir tus avances con otros compañeros. La clase quedará grabada, por si quieres repasar alguna técnica más tarde. ¡Es como tener un taller de repostería en la comodidad de tu hogar!</p>
            </AccordionContent>
          </AccordionItem>
           <AccordionItem value="item-4">
            <AccordionTrigger>
                <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5" />
                <span>¿Qué aprenderé exactamente?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">En este curso, te guiaremos paso a paso para que domines las bases de la repostería. Aprenderás a preparar la masa perfecta, a hornear como un profesional, a crear rellenos deliciosos y a decorar tu tarta con un acabado espectacular. ¡Saldrás con la confianza para crear tus propias obras maestras!</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
