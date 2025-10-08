
'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface AddToCartProps extends ButtonProps {
  id: string;
  children?: React.ReactNode;
}

export const AddToCart = ({ id, className, size = 'default', children }: AddToCartProps) => {
  const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
  if (!storeUrl) {
    console.error('La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_STORE_URL no está definida.');
    return (
      <Button className={className} size={size} disabled>
        {children || 'Añadir al carrito'}
      </Button>
    );
  }
  
  const addToCartUrl = `${storeUrl}/cart/?add-to-cart=${id}`;

  return (
    <Button asChild className={className} size={size}>
      <Link href={addToCartUrl} rel="noopener noreferrer">
        <ShoppingCart className="mr-2" />
        {children || 'Añadir al carrito'}
      </Link>
    </Button>
  );
};
