'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, X, Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function CartItem({ item }: { item: any }) {
    const { removeItem, updateItem, isLoading } = useCart();
    const { toast } = useToast();

    const handleRemove = async () => {
        await removeItem(item.key);
        toast({ title: 'Producto eliminado' });
    };

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemove();
            return;
        }
        await updateItem(item.key, newQuantity);
    };

    return (
        <div className="flex items-start gap-4 py-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="96px"
                />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Precio: €{item.price}</p>
                <div className="mt-2 flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={isLoading}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        disabled={isLoading}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">€{(item.line_subtotal).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="mt-2 text-muted-foreground" onClick={handleRemove} disabled={isLoading}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function CartSheet() {
    const { cart, isLoading, isCartOpen, closeCart, clearCart } = useCart();
    const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const checkoutUrl = cart?.checkout_url || `${storeUrl}/checkout`;

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetContent className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader className="pr-6">
                    <SheetTitle>Tu Carrito</SheetTitle>
                    <SheetDescription>
                        {cart?.item_count || 0} productos en tu carrito.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    {isLoading && cart?.items.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : cart?.items && cart.items.length > 0 ? (
                        <ScrollArea className="h-full pr-6">
                            <div className="divide-y">
                                {cart.items.map((item) => (
                                    <CartItem key={item.key} item={item} />
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold">Tu carrito está vacío</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                ¡Añade algunos productos para empezar!
                            </p>
                            <SheetClose asChild>
                                <Button className="mt-4" asChild>
                                    <Link href="/shop">Ir a la tienda</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    )}
                </div>
                {cart && cart.items.length > 0 && (
                     <SheetFooter className="border-t pt-6">
                        <div className="flex w-full flex-col gap-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Subtotal</span>
                                <span>€{cart.totals.total_price}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Los gastos de envío e impuestos se calcularán en el checkout.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                               <Button variant="outline" onClick={clearCart} disabled={isLoading}>Vaciar Carrito</Button>
                                <Button asChild>
                                    <Link href={checkoutUrl}>Ir al Checkout</Link>
                                </Button>
                            </div>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
