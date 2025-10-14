
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { trackSocialLink } from '@/lib/events';

const WhatsAppButton = () => {
  const phoneNumber = "34616284463";
  const message = "¡Hola! Estoy interesado en los cursos de repostería.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 left-6 h-[52px] w-[52px] rounded-full shadow-lg bg-[#25D366] hover:bg-[#1EBE57] transition-opacity text-white"
      aria-label="Chat en WhatsApp"
      onClick={() => trackSocialLink('WhatsApp')}
    >
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2">
        <Image 
            src="/image/whatsapp.webp" 
            alt="WhatsApp" 
            width={35} 
            height={35} 
        />
      </Link>
    </Button>
  );
};

export default WhatsAppButton;
