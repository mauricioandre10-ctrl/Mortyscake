import { CakeSlice } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <CakeSlice className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">Pastelería de Morty</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Pastelería de Morty. Todos los derechos reservados.
          </div>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm hover:text-primary">Política de Privacidad</Link>
            <Link href="#" className="text-sm hover:text-primary">Términos de Servicio</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
