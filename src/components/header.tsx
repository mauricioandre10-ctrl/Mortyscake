
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader, SheetFooter } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import { Separator } from './ui/separator';

const Header = () => {
  const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
  const cartUrl = `${storeUrl}/cart`;
  const accountUrl = `${storeUrl}/mi-cuenta`;

  const navLinks = [
    { href: '/shop', label: 'Tienda' },
    { href: '/courses', label: 'Cursos' },
    { href: '/gallery', label: 'Galería' },
    { href: '/#about', label: 'Sobre Nosotros' },
    { href: '/#footer', 'label': 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
           <Image src="https://picsum.photos/seed/logo/180/64" alt="Pastelería de Morty" width={180} height={64} className="object-contain h-auto max-w-[100px]" data-ai-hint="logo" />
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
                <Link href={storeUrl ? accountUrl : '#'} target="_blank" rel="noopener noreferrer" aria-label="Iniciar Sesión">
                    <User className="h-6 w-6"/>
                </Link>
           </Button>

           <Button asChild variant="ghost" size="icon" className="relative" disabled={!storeUrl}>
             <Link href={storeUrl ? cartUrl : '#'} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Ver carrito</span>
             </Link>
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
                  <SheetTitle>Menú</SheetTitle>
                  <SheetDescription>Navegación principal del sitio.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                     <Image src="https://picsum.photos/seed/logo/180/64" alt="Pastelería de Morty" width={180} height={64} className="object-contain h-auto max-w-[100px]" data-ai-hint="logo" />
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
                   <Link href={storeUrl ? accountUrl : '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lg font-medium">
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
