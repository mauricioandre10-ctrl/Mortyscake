
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Truck, ShieldCheck } from 'lucide-react';
import { AddToCart } from '@/components/AddToCart';

// Generate static pages for each product
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={product.image.src}
            alt={product.name}
            data-ai-hint={product.image.hint}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-muted-foreground fill-muted" />
                </div>
                <span className="text-sm text-muted-foreground">(12 reseñas)</span>
            </div>
            <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
            
            <Card className="border">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Precio</span>
                        <span className="font-bold text-3xl text-primary">
                            €{product.price.toFixed(2)}
                        </span>
                    </div>
                     <AddToCart 
                        name={product.name}
                        description={product.description}
                        id={product.slug}
                        price={product.price}
                        currency="EUR"
                        image={product.image.src}
                        className="w-full"
                        size="lg"
                     />
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Truck className="w-5 h-5 text-muted-foreground" />
                            <span>Envío en 24/48 horas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                             <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                            <span>Pago 100% seguro</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
