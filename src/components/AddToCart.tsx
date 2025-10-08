'use client';

import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { trackAddToCart } from '@/lib/events';

interface AddToCartProps extends ButtonProps {
  productId: number;
  productName: string;
  price: string;
  children?: React.ReactNode;
}

export const AddToCart = ({
  productId,
  productName,
  price,
  className,
  size = 'default',
  children,
  ...props
}: AddToCartProps) => {
  const { addItem, openCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addItem(productId, 1);
      trackAddToCart(productName, 'Producto', price); // Asume que esto es un producto general, se puede ajustar
      toast({
        title: '¡Añadido al carrito!',
        description: `${productName} se ha añadido a tu carrito.`,
      });
      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo añadir el producto al carrito.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleAddToCart} className={className} size={size} disabled={isLoading} {...props}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2" />
      )}
      {children || 'Añadir al carrito'}
    </Button>
  );
};
