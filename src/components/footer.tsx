import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Pastelería de Morty" width={140} height={50} className="object-contain" />
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
