
'use client';

import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart';
import { Button, ButtonProps } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from 'use-shopping-cart/core';

interface AddToCartProps extends ButtonProps {
  name: string;
  description: string;
  id: string;
  price: number;
  currency: string;
  image: string;
}

export const AddToCart = ({ name, description, id, price, currency, image, className, size = 'default' }: AddToCartProps) => {
  const { addItem, cartDetails } = useShoppingCart();

  const product: Product = {
    name: name,
    description: description,
    id: id,
    price: price,
    currency: currency,
    image: image,
  };
  
  const isInCart = cartDetails?.[id];

  const handleAddItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addItem(product);
  };

  return (
    <Button onClick={handleAddItem} disabled={!!isInCart} className={className} size={size}>
      <ShoppingCart className="mr-2" />
      {isInCart ? 'Añadido' : 'Añadir al carrito'}
    </Button>
  );
};
