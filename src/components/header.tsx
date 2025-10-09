
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader, SheetClose } from '@/components/ui/sheet';
import { Menu, User, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { useShoppingCart } from 'use-shopping-cart';

const Header = () => {
  const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
  const accountUrl = storeUrl ? `${storeUrl}/mi-cuenta` : '#';
  const { handleCartClick, cartCount } = useShoppingCart();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/shop', label: 'Tienda' },
    { href: '/courses', label: 'Cursos' },
    { href: '/gallery', label: 'Galería' },
    { href: '/blog', label: 'Blog' },
    { href: '/#about', label: 'Sobre Nosotros' },
    { href: '/#footer', 'label': 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
           <Image src="/image/Logo_mortys_cake.webp" alt="Pastelería de Morty" width={120} height={43} className="object-contain" data-ai-hint="logo" />
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
            <Button asChild variant="ghost" size="icon" className="hidden md:flex" disabled={!storeUrl}>
                <Link href={accountUrl} target="_blank" rel="noopener noreferrer" aria-label="Iniciar Sesión">
                    <User className="h-6 w-6"/>
                </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={() => handleCartClick()} aria-label="Abrir carrito">
                <ShoppingCart className="h-6 w-6" />
                {cartCount !== undefined && cartCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cartCount}
                    </span>
                )}
            </Button>

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
                  <SheetTitle>
                     <Link href="/" className="flex items-center gap-2 mb-4">
                       <Image src="/image/Logo_mortys_cake.webp" alt="Pastelería de Morty" width={120} height={43} className="object-contain" data-ai-hint="logo" />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="text-lg font-medium"
                        >
                          {link.label}
                        </Link>
                    </SheetClose>
                  ))}
                  <Separator className="my-2"/>
                  <SheetClose asChild>
                    <Link href={accountUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lg font-medium">
                        <User className="h-5 w-5" />
                        <span>Mi Cuenta</span>
                    </Link>
                  </SheetClose>
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
