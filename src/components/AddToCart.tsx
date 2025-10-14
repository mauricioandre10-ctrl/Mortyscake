'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { trackAddToCart } from '@/lib/events';
import { ShoppingCart } from 'lucide-react';
import { useShoppingCart } from 'use-shopping-cart';

interface AddToCartProps {
  name: string;
  id: string;
  price: number;
  currency: string;
  image?: string;
  description?: string;
  sku?: string;
  isCourse?: boolean;
  quantity: number;
}

export function AddToCart({ name, id, price, currency, image, description, isCourse = false, quantity }: AddToCartProps) {
  const { addItem } = useShoppingCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const item = {
      name,
      id,
      price: Math.round(price * 100), // Convert to smallest currency unit (cents)
      currency,
      image,
      description,
      sku: id, // Use product id as SKU for cart uniqueness
    };
    addItem(item, { count: quantity });
    toast({
      title: `${isCourse ? 'Curso añadido' : 'Producto añadido'}`,
      description: `"${name}" (x${quantity}) se ha añadido a tu carrito.`,
    });
    trackAddToCart(name, isCourse ? 'Curso' : 'Producto', price.toString());
  };

  return (
    <Button size="lg" onClick={handleAddToCart} className="shadow-md w-full sm:w-auto">
      <ShoppingCart className="mr-2" />
      {isCourse ? 'Inscribirse Ahora' : 'Añadir al carrito'}
    </Button>
  );
}
