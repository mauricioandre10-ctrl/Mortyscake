
'use client';

import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart';
import { Button, ButtonProps } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from 'use-shopping-cart/core';
import { QuantityManager } from './QuantityManager';

interface AddToCartProps extends ButtonProps {
  name: string;
  description: string;
  id: string;
  price: number;
  currency: string;
  image?: string;
  children?: React.ReactNode;
}

export const AddToCart = ({ name, description, id, price, currency, image, className, size = 'default', children }: AddToCartProps) => {
  const { addItem, cartDetails } = useShoppingCart();

  const product: Product = {
    name: name,
    description: description,
    id: id,
    price: price * 100, // Price in cents
    sku: id,
    currency: currency,
    image: image,
    quantity: 1,
  };
  
  const isInCart = cartDetails?.[id];

  const handleAddItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addItem(product);
  };
  
  if(isInCart) {
    return <QuantityManager product={product} />
  }

  return (
    <Button onClick={handleAddItem} className={className} size={size}>
      <ShoppingCart className="mr-2" />
      {children || 'Añadir al carrito'}
    </Button>
  );
};
