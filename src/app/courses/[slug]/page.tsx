
'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Video, Target, Package, Laptop, Lightbulb, ArrowLeft, Star, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { wooCommerce } from '@/lib/woocommerce';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ShareButton } from '@/components/ShareButton';

const iconMap: { [key: string]: React.ElementType } = {
  '¿A quién está dirigido?': Target,
  '¿Qué materiales necesito?': Package,
  'Modalidad': Laptop,
  '¿Qué aprenderé exactamente?': Lightbulb,
  'default': Info,
};


export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slug = params.slug;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await wooCommerce.get('products', {
          slug: slug,
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
  }, [slug]);


  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
            <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-12 w-1/3" />
                        </div>
                        <Skeleton className="h-12 w-full" />
                         <div className="border-t pt-4 space-y-3 text-sm">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
         <div className="max-w-6xl mx-auto mt-16 pt-8 border-t">
            <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return notFound();
  }

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
