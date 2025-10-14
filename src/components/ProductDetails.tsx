
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Info, FileText, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ShareButton } from '@/components/ShareButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { AddToCart } from './AddToCart';
import { QuantitySelector } from './QuantitySelector';
import { RelatedProducts } from './RelatedProducts';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  category_names: string[];
  sku: string;
  tags: { name: string; slug: string }[];
  attributes: { name: string; options: string[] }[] | Record<string, { name: string; options: string[] }>;
}

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const fullDescription = product.description || product.short_description || 'No hay descripción disponible.';
  const productAttributes = Array.isArray(product.attributes) ? product.attributes : Object.values(product.attributes);
  const googleReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJR8mR-xH_Lw0RQZ-CfPwZD-Q&source=g.page.m._&laa=merchant-review-solicitation";
  
  const isOnSale = product.sale_price && product.regular_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const priceToUse = isOnSale ? product.sale_price : product.price;
  const priceAsNumber = parseFloat(priceToUse);
  const totalPrice = !isNaN(priceAsNumber) ? priceAsNumber * quantity : 0;

  const handleImageClick = (image: { src: string; alt: string }) => {
    setSelectedImage(image);
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
        return window.location.href;
    }
    return '';
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/shop">
            <ArrowLeft className="mr-2" />
            Volver a la Tienda
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:col-span-1">
          <Dialog>
            <Carousel className="w-full">
                <CarouselContent>
                {product.images?.length > 0 ? (
                    product.images.map((image) => (
                    <CarouselItem key={image.id}>
                        <DialogTrigger asChild>
                            <div className="aspect-square relative rounded-lg overflow-hidden border cursor-pointer" onClick={() => handleImageClick(image)}>
                                {isOnSale && (
                                    <Badge variant="destructive" className="absolute top-2 left-2 z-10">Oferta</Badge>
                                )}
                                <Image
                                    src={image.src}
                                    alt={image.alt || product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </DialogTrigger>
                    </CarouselItem>
                    ))
                ) : (
                    <CarouselItem>
                    <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                        <div className="w-full h-full bg-muted"></div>
                    </div>
                    </CarouselItem>
                )}
                </CarouselContent>
                {product.images?.length > 1 && (
                <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                </>
                )}
            </Carousel>

             <DialogContent className="w-auto max-w-none h-auto max-h-none p-0 bg-transparent border-none">
              {selectedImage && (
                <>
                  <div className="relative w-[95vw] h-[95vh]">
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      fill
                      className="object-contain"
                      sizes="95vw"
                    />
                  </div>
                  <ShareButton
                    title={`Mira este producto: ${product.name}`}
                    text="¡Me encantó este producto de Morty's Cake!"
                    url={getShareUrl()}
                    className="absolute top-4 right-14 z-20 bg-accent text-accent-foreground hover:bg-accent/90"
                    size="icon"
                  />
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col lg:col-span-1">
          <div className="flex justify-between items-start">
            <h1 className="font-card-title text-4xl md:text-5xl mb-4">{product.name}</h1>
            <ShareButton title={product.name} text={`Echa un vistazo a este producto: ${product.name}`} />
          </div>
          
          <Button asChild variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md mb-4 self-start">
              <Link href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquarePlus className="mr-2 h-4 w-4"/>
                  Dejar una Reseña en Google
              </Link>
          </Button>

          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: product.short_description || '' }}
          />

          <div className="mt-auto pt-6 bg-muted/30 p-6 rounded-lg shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-baseline gap-2 text-center sm:text-left shrink-0">
                    {isOnSale && product.regular_price && (
                      <span className="text-3xl text-muted-foreground line-through">
                        €{parseFloat(product.regular_price).toFixed(2)}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-primary">
                        €{totalPrice.toFixed(2)}
                    </span>
                </div>
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                <AddToCart
                    name={product.name}
                    id={product.id.toString()}
                    price={priceAsNumber}
                    currency="EUR"
                    image={product.images?.[0]?.src}
                    description={product.short_description}
                    sku={product.sku}
                    isCourse={false}
                    quantity={quantity}
                />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description"><FileText className="mr-2" />Descripción</TabsTrigger>
            <TabsTrigger value="additional-info"><Info className="mr-2" />Info Adicional</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6 px-4 border rounded-b-md">
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: fullDescription }}
            />
          </TabsContent>
          <TabsContent value="additional-info" className="py-6 px-4 border rounded-b-md">
            <table className="w-full text-sm">
              <tbody>
                {product.sku && (
                  <tr className="border-b">
                    <td className="py-3 font-semibold pr-4">SKU</td>
                    <td className="py-3">{product.sku}</td>
                  </tr>
                )}
                {productAttributes && productAttributes.map((attr, index) => (
                  attr.name && attr.options.length > 0 && (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-semibold pr-4">{attr.name}</td>
                      <td className="py-3">{attr.options.join(', ')}</td>
                    </tr>
                  )
                ))}
                {product.tags?.length > 0 && (
                  <tr className="border-b">
                    <td className="py-3 font-semibold pr-4 align-top">Etiquetas</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map(tag => (
                          <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </div>

      <RelatedProducts
        currentProductId={product.id}
        categories={product.category_names}
        productType='shop'
      />
    </div>
  );
}
