'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { trackSocialLink } from '@/lib/events';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
)

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
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
      </Link>
    </Button>
  );
};

export default WhatsAppButton;
