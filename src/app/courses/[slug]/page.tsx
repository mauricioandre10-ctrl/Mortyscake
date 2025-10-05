
'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Video, Target, Package, Laptop, Lightbulb, ArrowLeft, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { wooCommerce } from '@/lib/woocommerce';
import { useEffect, useState } from 'react';

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await wooCommerce.get('products', {
          slug: params.slug,
        });
        if (response.data && response.data.length > 0) {
          setCourse(response.data[0]);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch course product", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [params.slug]);


  if (loading) {
    return <div className="container mx-auto py-12 px-4 md:px-6">Cargando curso...</div>;
  }
  
  if (!course) {
    return notFound();
  }

  // NOTE: The following section uses placeholder data.
  // You should fetch this from WooCommerce, probably using product meta fields.
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
       <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={course.images[0].src}
            alt={course.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">{course.name}</h1>
             <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-muted-foreground fill-muted" />
                </div>
                <span className="text-sm text-muted-foreground">({course.rating_count} reseñas)</span>
            </div>
            <div className="text-muted-foreground text-lg mb-6" dangerouslySetInnerHTML={{ __html: course.description }} />
            
            <Card className="border">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Precio del curso</span>
                        <span className="font-bold text-3xl text-primary">
                             {course.price === "0.00" ? 'Gratis' : `€${course.price}`}
                        </span>
                    </div>
                     <AddToCart 
                        name={course.name}
                        description={course.short_description || ''}
                        id={String(course.id)}
                        price={parseFloat(course.price)}
                        currency="EUR"
                        image={course.images?.[0]?.src || ''}
                        className="w-full"
                        size="lg"
                     >
                       {course.price === "0.00" ? "Inscribirse Gratis" : "Añadir al carrito"}
                     </AddToCart>
                     <div className="border-t pt-4 space-y-3 text-sm">
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
                          <span className="font-semibold">Fecha:</span> A determinar
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-3 mt-1 shrink-0" />
                        <div>
                          <span className="font-semibold">Duración:</span> 4 horas
                        </div>
                      </div>
                    </div>
                </CardContent>
            </Card>
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
