
'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Video, Target, Package, Laptop, Lightbulb, ArrowLeft, Star, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { useEffect, useState } from 'react';
import { ShareButton } from '@/components/ShareButton';
import CourseDetailPageSkeleton from './CourseDetailPageSkeleton';


const iconMap: { [key: string]: React.ElementType } = {
  '¿A quién está dirigido?': Target,
  '¿Qué materiales necesito?': Package,
  'Modalidad': Laptop,
  '¿Qué aprenderé exactamente?': Lightbulb,
  'default': Info,
};

const WP_API_URL = 'https://mortyscake.com';


export default function CourseClientPage({ initialCourse, slug }: { initialCourse: any, slug: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(initialCourse);
  const [loading, setLoading] = useState(!initialCourse);

   useEffect(() => {
    if (!initialCourse) {
      const fetchCourse = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?slug=${slug}`);
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            if (data && data.length > 0) {
                setCourse(data[0]);
            } else {
                setCourse(null);
            }
        } catch (error) {
            console.error("Failed to fetch course on client", error);
            setCourse(null);
        } finally {
            setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [initialCourse, slug]);


  if (loading) {
      return <CourseDetailPageSkeleton />;
  }
  
  if (!course) {
    return notFound();
  }

  // This logic is now safely placed after the loading/null checks
  const courseInfo = course.attributes.map((attr: any) => ({
      icon: iconMap[attr.name] || iconMap.default,
      title: attr.name,
      description: attr.options.join(', ')
  }));


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
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center">
            <div className="flex items-start justify-between gap-4 mb-2">
                 <h1 className="font-headline text-3xl md:text-4xl font-bold">{course.name}</h1>
                 <ShareButton title={course.name} text={`¡Mira este increíble curso de repostería: ${course.name}!`} />
            </div>
             <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < course.average_rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({course.rating_count} reseñas)</span>
            </div>
            <div className="text-muted-foreground text-lg prose" dangerouslySetInnerHTML={{ __html: course.description }} />
            
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
                          <span className="font-semibold">Acceso:</span> Inmediato y de por vida.
                          <p className="text-muted-foreground text-xs">Aprende a tu ritmo, cuando y donde quieras.</p>
                        </div>
                      </div>
                      {course.attributes.map((attr: any) => (
                         <div key={attr.id} className="flex items-start">
                            <Info className="h-4 w-4 mr-3 mt-1 shrink-0" />
                            <div>
                                <span className="font-semibold">{attr.name}:</span> {attr.options.join(', ')}
                            </div>
                         </div>
                      ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      {courseInfo.length > 0 && (
       <div className="max-w-6xl mx-auto mt-16 pt-8 border-t">
        <h2 className="font-headline text-3xl font-bold text-center mb-8">Todo lo que necesitas saber</h2>
        <div className="grid md:grid-cols-2 gap-6">
            {courseInfo.map((info: any, index: number) => {
                const Icon = info.icon
                return (
                    <Card key={index} className="bg-muted/50">
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
      )}
    </div>
  );
}
