import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  const navLinks = [
    { href: '/#courses', label: 'Cursos' },
    { href: '#', label: 'Sobre Nosotros' },
    { href: '/#contact', 'label': 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
           <Image src="/image/Logo_mortys_cake.webp" alt="Pastelería de Morty" width={180} height={64} className="object-contain h-auto max-w-[80px]" />
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
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Abrir Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetTitle>Menú</SheetTitle>
                <SheetDescription className="sr-only">Navegación principal de la aplicación</SheetDescription>
                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                     <Image src="/image/Logo_mortys_cake.webp" alt="Pastelería de Morty" width={180} height={64} className="object-contain h-auto max-w-[80px]" />
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
