

import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';
import { SocialLinks } from './SocialLinks';


const Footer = () => {
  return (
    <footer id="footer" className="w-full border-t">
      <div className="bg-[#513938] text-white">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <h3 className="font-bold text-lg mb-4 font-headline">Contacto</h3>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>Rúa Valle Inclán, 23, Bajo 11, 32004 Ourense, Province of Ourense</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <span>616 28 44 63</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
               <Image src="/image/Logo_mortys_cake.webp" alt="Pastelería de Morty" width="90" height="32" className="object-contain h-8 w-auto" data-ai-hint="logo" />
            </div>
            <div className="flex flex-col items-end">
              <h3 className="font-bold text-lg mb-4 font-headline">Síguenos</h3>
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
       <div className="bg-card">
        <div className="container mx-auto py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}{' '}
              <Link href="https://tecnovacenter.es/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                TecnovaCenter
              </Link>
              . Todos los derechos reservados.
            </div>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
              <Link href="/legal/terms" className="text-sm hover:text-primary">Términos de Servicio</Link>
              <Link href="/legal/privacy" className="text-sm hover:text-primary">Política de Privacidad</Link>
              <Link href="/legal/cookies" className="text-sm hover:text-primary">Política de Cookies</Link>
            </nav>
        </div>
       </div>
    </footer>
  );
};

export default Footer;
