'use client';

import { useShoppingCart } from 'use-shopping-cart';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Product } from 'use-shopping-cart/core';

interface QuantityManagerProps {
  product: Product;
}

export const QuantityManager = ({ product }: QuantityManagerProps) => {
  const { cartDetails, incrementItem, decrementItem, removeItem } = useShoppingCart();

  const itemInCart = cartDetails?.[product.id];

  if (!itemInCart) {
    return null;
  }
  
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if(itemInCart.quantity === 1) {
        removeItem(itemInCart.id);
    } else {
        decrementItem(itemInCart.id);
    }
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    incrementItem(itemInCart.id)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrement}>
        <Minus className="h-4 w-4" />
        <span className="sr-only">Quitar un artículo</span>
      </Button>
      <span className="w-8 text-center font-medium">{itemInCart.quantity}</span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrement}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Añadir un artículo</span>
      </Button>
    </div>
  );
};
