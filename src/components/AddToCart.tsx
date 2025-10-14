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
  const { addItem, setItemQuantity, cartDetails } = useShoppingCart();
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
    
    const isInCart = cartDetails?.[item.id];

    if (isInCart) {
        // If the item is already in the cart, update its quantity
        setItemQuantity(item.id, quantity);
        toast({
            title: `Cantidad actualizada`,
            description: `Has actualizado "${name}" a ${quantity} unidad(es) en tu carrito.`,
        });
    } else {
        // If it's a new item, add it
        addItem(item, { count: quantity });
        toast({
            title: `${isCourse ? 'Curso añadido' : 'Producto añadido'}`,
            description: `"${name}" (x${quantity}) se ha añadido a tu carrito.`,
        });
    }

    trackAddToCart(name, isCourse ? 'Curso' : 'Producto', price.toString());
  };

  return (
    <Button size="lg" onClick={handleAddToCart} className="shadow-md w-full sm:w-auto">
      <ShoppingCart className="mr-2" />
      {isCourse ? 'Inscribirse Ahora' : 'Añadir al carrito'}
    </Button>
  );
}
