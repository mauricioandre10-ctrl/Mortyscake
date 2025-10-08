'use client';

import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useShoppingCart, CartEntry } from 'use-shopping-cart';
import { Button } from './ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';

export function CartSheet() {
  const {
    cartCount,
    shouldDisplayCart,
    handleCartClick,
    cartDetails,
    removeItem,
    incrementItem,
    decrementItem,
    totalPrice,
    clearCart,
    formattedTotalPrice,
  } = useShoppingCart();
  const { toast } = useToast();

  const handleCheckout = async () => {
    const wooCommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    if (!wooCommerceUrl) {
      console.error('La URL de la tienda WooCommerce no está configurada.');
      toast({
        variant: 'destructive',
        title: 'Error de configuración',
        description: 'No se puede proceder al pago en este momento.',
      });
      return;
    }

    if (cartCount === 0) return;

    // Construir la URL para añadir múltiples productos al carrito de WooCommerce
    let checkoutUrl = `${wooCommerceUrl}/carrito/?clear-cart=true`;
    Object.values(cartDetails ?? {}).forEach(item => {
        checkoutUrl += `&add-to-cart=${item.id}&quantity=${item.quantity}`;
    });
    
    // Limpiar el carrito local antes de redirigir
    clearCart();

    // Redirigir al usuario
    window.location.href = checkoutUrl;
  };

  return (
    <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-4 text-left">
          <SheetTitle>Mi Carrito ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <Trash2 className="h-20 w-20 text-muted-foreground/30" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-4">
                {Object.values(cartDetails ?? {}).map((item: CartEntry) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        {item.image && (
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.formattedValue}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => decrementItem(item.id)}
                          disabled={item.quantity === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <Button
                           variant="outline"
                           size="icon"
                           className="h-6 w-6"
                           onClick={() => incrementItem(item.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                        >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="p-4 border-t">
              <div className="flex w-full flex-col gap-2">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>{formattedTotalPrice}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={cartCount === 0}
                >
                  Finalizar Compra
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
