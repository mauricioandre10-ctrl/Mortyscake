
import { courses, isEuroCourse } from '@/lib/courses';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Banknote, Video, Users, BookOpen, Lightbulb, Package, Laptop, Target, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Metadata } from 'next';

// Generate metadata for each course page (SEO Optimization)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = courses.find((c) => c.slug === params.slug);

  if (!course) {
    return {
      title: 'Curso no encontrado',
      description: 'La página que buscas no existe.',
    };
  }

  return {
    title: `${course.title} | Pastelería de Morty`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [
        {
          url: course.image.src,
          width: course.image.width,
          height: course.image.height,
          alt: course.title,
        },
      ],
    },
  };
}

// Generate static pages for each course at build time (Performance Optimization)
export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}


export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = courses.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }
  
  const courseInfo = [
      {
        icon: Target,
        title: '¿A quién está dirigido?',
        description: 'Perfecto para apasionados por la repostería, desde principiantes que quieren aprender las bases hasta aficionados que buscan perfeccionar su técnica y explorar nuevos sabores.'
      },
      {
        icon: Package,
        title: '¿Qué materiales necesito?',
        description: 'Recibirás una lista detallada de ingredientes y utensilios básicos. La mayoría son fáciles de encontrar y probablemente ya los tienes en tu cocina.'
      },
      {
        icon: Laptop,
        title: 'Modalidad 100% Online',
        description: 'Las clases son en vivo a través de una plataforma de video, permitiéndote interactuar en tiempo real. Además, la sesión quedará grabada para que puedas repasarla cuando quieras.'
      },
      {
        icon: Lightbulb,
        title: '¿Qué aprenderé exactamente?',
        description: 'Dominarás las técnicas esenciales de la repostería:desde preparar masas y hornear a la perfección, hasta crear rellenos y decoraciones con un acabado profesional.'
      }
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={course.image.src}
              alt={`Imagen de ${course.title} - ${course.image.hint}`}
              data-ai-hint={course.image.hint}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
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
                          {isEuroCourse(course.slug) ? '€' : '$'}
                          {course.price}
                        </span>
                    </div>

                    {isEuroCourse(course.slug) ? (
                       <div className="border-t pt-4 text-center">
                          <h3 className="font-semibold mb-2">1. Paga cómodamente con Bizum</h3>
                          <p className="text-sm text-muted-foreground mb-4">Escanea el código QR desde tu móvil o pulsa el botón para agregar el contacto.</p>
                          <div className="flex justify-center my-4">
                            <Image src="/image/bizum_qr_curso.svg" alt="Bizum QR Code" width={100} height={100} className="rounded-lg h-auto" />
                          </div>
                           <Button asChild size="lg" className="w-full mt-2 bg-[#33A1F2] hover:bg-[#2a8ad0] text-white">
                            <Link href="https://qrto.org/lGWCJi" target="_blank" rel="noopener noreferrer">
                              <QrCode className="mr-2" /> Pagar con Bizum
                            </Link>
                          </Button>
                           <p className="text-xs text-muted-foreground mt-2">Recuerda guardar el comprobante de la transacción para adjuntarlo al formulario de inscripción.</p>
                          
                          <div className="border-t pt-4 mt-6 text-center">
                              <h3 className="font-semibold mb-2">2. Completa tu Inscripción</h3>
                              <p className="text-sm text-muted-foreground mb-4">Una vez realizado el pago, haz clic en el botón de abajo para completar tus datos y adjuntar el comprobante.</p>
                              <Button asChild size="lg" className="w-full mt-2">
                                <Link href={course.enrollmentUrl} target="_blank" rel="noopener noreferrer">
                                  <BookOpen className="mr-2" /> Inscribirse Ahora
                                </Link>
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">Enviaremos el link de la clase a tu correo una vez confirmado el pago.</p>
                          </div>
                       </div>
                    ) : (
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
                           <Button size="lg" className="w-full mt-6" disabled>
                            <Banknote className="mr-2" /> Pagar con Transferencia
                          </Button>
                      </div>
                    )}
                </div>
                 <p className="text-center text-xs text-muted-foreground mt-4">El link para la clase se compartirá en las primeras 24 horas después de confirmado el pago.</p>
            </div>
        </div>
      </div>
       <div className="max-w-6xl mx-auto mt-16 pt-8 border-t">
        <h2 className="font-headline text-3xl font-bold text-center mb-8">Todo lo que necesitas saber</h2>
        <div className="grid md:grid-cols-2 gap-6">
            {courseInfo.map((info, index) => {
                const Icon = info.icon
                return (
                    <Card key={index} className="bg-muted/30">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Icon className="h-8 w-8 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                                    <p className="text-muted-foreground text-sm">{info.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </div>
    </div>
  );
}
