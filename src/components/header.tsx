
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader, SheetFooter } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import { useShoppingCart } from 'use-shopping-cart';
import { Separator } from './ui/separator';

const Header = () => {
  const { cartCount, cartDetails, removeItem, totalPrice, redirectToCheckout } = useShoppingCart();
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const navLinks = [
    { href: '/shop', label: 'Tienda' },
    { href: '/courses', label: 'Cursos' },
    { href: '/gallery', label: 'Galería' },
    { href: '/#about', label: 'Sobre Nosotros' },
    { href: '/#footer', 'label': 'Contacto' },
  ];

  async function handleCheckoutClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const result = await redirectToCheckout();
      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
           <Image src="https://picsum.photos/seed/logo/180/64" alt="Pastelería de Morty" width={180} height={64} className="object-contain h-auto max-w-[100px]" data-ai-hint="logo" unoptimized />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
           <Button asChild variant="ghost" size="icon" className="hidden md:flex">
                <Link href="https://cms.mortyscake.com/mi-cuenta" aria-label="Iniciar Sesión">
                    <User className="h-6 w-6"/>
                </Link>
           </Button>

           <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount !== undefined && cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transform translate-x-1/2 -translate-y-1/2">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Abrir carrito</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Tu Carrito</SheetTitle>
                <SheetDescription>
                  {cartCount === 0
                    ? 'Tu carrito está vacío.'
                    : `Tienes ${cartCount} artículo(s) en tu carrito.`}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full">
                {cartCount !== undefined && cartCount > 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto pr-4 my-4">
                      {Object.values(cartDetails ?? {}).map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-4">
                          <Image
                            src={item.image as string}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                            unoptimized
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x {item.formattedValue}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Eliminar ${item.name} del carrito`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <SheetFooter className="mt-auto p-4 space-y-4">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span>€{totalPrice?.toFixed(2) ?? '0.00'}</span>
                      </div>
                      <Button className="w-full" onClick={handleCheckoutClick}>
                        Finalizar Compra
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">El checkout se redirigirá a WooCommerce.</p>
                    </SheetFooter>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ShoppingCart className="w-20 h-20 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">¡Empieza a llenarlo!</p>
                     <Button variant="outline" className="mt-6" onClick={() => setIsCartOpen(false)}>
                        Seguir comprando
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>


          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Abrir Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                  <SheetDescription>Navegación principal del sitio.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                     <Image src="https://picsum.photos/seed/logo/180/64" alt="Pastelería de Morty" width={180} height={64} className="object-contain h-auto max-w-[100px]" data-ai-hint="logo" unoptimized />
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator className="my-2"/>
                   <Link href="https://cms.mortyscake.com/mi-cuenta" className="flex items-center gap-2 text-lg font-medium">
                    <User className="h-5 w-5" />
                    <span>Mi Cuenta</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
