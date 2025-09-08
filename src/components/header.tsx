import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CakeSlice, Menu } from 'lucide-react';

const Header = () => {
  const navLinks = [
    { href: '#courses', label: 'Cursos' },
    { href: '#', label: 'Sobre Nosotros' },
    { href: '#', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <CakeSlice className="h-6 w-6 text-primary" />
          <span className="font-bold">Pastelería de Morty</span>
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
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
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
                <SheetTitle className="sr-only">Menú</SheetTitle>
                <SheetDescription className="sr-only">Navegación principal de la aplicación</SheetDescription>
                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <CakeSlice className="h-6 w-6 text-primary" />
                    <span className="font-bold">Pastelería de Morty</span>
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
