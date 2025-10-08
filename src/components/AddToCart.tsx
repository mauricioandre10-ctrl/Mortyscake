
'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { WOOCOMMERCE_STORE_URL } from '@/lib/env';

interface AddToCartProps extends ButtonProps {
  id: string;
  children?: React.ReactNode;
}

export const AddToCart = ({ id, className, size = 'default', children }: AddToCartProps) => {
  if (!WOOCOMMERCE_STORE_URL) {
    return (
      <Button className={className} size={size} disabled>
        {children || 'Añadir al carrito'}
      </Button>
    );
  }
  
  const addToCartUrl = `${WOOCOMMERCE_STORE_URL}/cart/?add-to-cart=${id}`;

  return (
    <Button asChild className={className} size={size}>
      <Link href={addToCartUrl} target="_blank" rel="noopener noreferrer">
        <ShoppingCart className="mr-2" />
        {children || 'Añadir al carrito'}
      </Link>
    </Button>
  );
};
