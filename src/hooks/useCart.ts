'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from './use-toast';

// Define las interfaces para la estructura de datos del carrito
interface CartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  price: string;
  line_subtotal: number;
  image: {
    src: string;
    alt: string;
  };
}

interface Cart {
  items: CartItem[];
  item_count: number;
  totals: {
    total_price: string;
  };
  checkout_url?: string;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  updateItem: (itemKey: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

// Proveedor del contexto del carrito
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!apiUrl) {
      console.error("WooCommerce Store URL no está configurado.");
      setIsLoading(false);
      return;
    };
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/wp-json/morty/v1/cart`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Error al obtener el carrito');
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error(error);
       toast({
        variant: 'destructive',
        title: 'Error de Carrito',
        description: 'No se pudo cargar el contenido del carrito.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = async (productId: number, quantity: number) => {
    if (!apiUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/wp-json/morty/v1/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      if (!response.ok) throw new Error('Error al añadir producto');
      const data = await response.json();
      setCart(data);
    } catch (error) {
       console.error(error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo añadir el producto al carrito.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemKey: string) => {
    if (!apiUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/wp-json/morty/v1/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_key: itemKey }),
      });
      if (!response.ok) throw new Error('Error al eliminar producto');
      const data = await response.json();
      setCart(data);
    } catch (error) {
       console.error(error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el producto del carrito.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (itemKey: string, quantity: number) => {
     if (!apiUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/wp-json/morty/v1/cart/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_key: itemKey, quantity }),
      });
      if (!response.ok) throw new Error('Error al actualizar producto');
      const data = await response.json();
      setCart(data);
    } catch (error) {
       console.error(error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el carrito.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = async () => {
    if (!apiUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/wp-json/morty/v1/cart/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al vaciar el carrito');
      const data = await response.json();
      setCart(data);
      toast({ title: 'Carrito vaciado' });
    } catch (error) {
       console.error(error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo vaciar el carrito.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    isLoading,
    isCartOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
