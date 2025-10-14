
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { trackSocialLink } from '@/lib/events';

export function SocialLinks() {
  const phoneNumber = "34616284463";
  const message = "¡Hola! Estoy interesado en los cursos de repostería.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex items-center gap-4">
      <Link href="https://www.facebook.com/MortysCake/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity" onClick={() => trackSocialLink('Facebook')}>
        <Image 
            src="/image/facebook.webp" 
            alt="Facebook" 
            width={28} 
            height={28}
            className="object-contain"
        />
      </Link>
      <Link href="https://www.instagram.com/mortyscake.ourense/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity" onClick={() => trackSocialLink('Instagram')}>
        <Image 
            src="/image/instagram.webp" 
            alt="Instagram" 
            width={28} 
            height={28}
            className="object-contain"
        />
      </Link>
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity" onClick={() => trackSocialLink('WhatsApp')}>
        <Image
          src="/image/whatsapp.webp"
          alt="WhatsApp"
          width={28}
          height={28}
          className="object-contain"
        />
      </Link>
    </div>
  );
}
