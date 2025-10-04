
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddToCart } from '@/components/AddToCart';
import { wooCommerce } from '@/lib/woocommerce';

async function getProducts() {
  try {
    const response = await wooCommerce.get('products');
    if (response.status !== 200) {
      console.error('Error fetching products:', response.statusText);
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching products from WooCommerce:', error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestra Tienda</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ingredientes, herramientas y todo lo que necesitas para que tus creaciones de repostería cobren vida.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product: any) => (
          <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 bg-card">
            <CardHeader className="p-0">
              <Link href={`/shop/${product.slug}`} className="block relative aspect-square">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow p-6">
              <CardTitle as="h3" className="font-headline text-xl mb-2">
                 <Link href={`/shop/${product.slug}`}>{product.name}</Link>
              </CardTitle>
              <CardDescription className="text-sm" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/30 p-4">
              <span className="text-2xl font-bold text-primary">
                €{product.price}
              </span>
              <AddToCart
                name={product.name}
                description={product.short_description || ''}
                id={String(product.id)}
                price={parseFloat(product.price)}
                currency="EUR"
                image={product.images?.[0]?.src || ''}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
