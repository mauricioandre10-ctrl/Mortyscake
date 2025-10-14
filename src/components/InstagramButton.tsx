
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { trackSocialLink } from '@/lib/events';

const InstagramButton = () => {
  const instagramUrl = "https://www.instagram.com/mortyscake.ourense/";

  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 h-[52px] w-[52px] rounded-full shadow-lg bg-black hover:opacity-90 transition-opacity text-white"
      aria-label="Ir al perfil de Instagram"
      onClick={() => trackSocialLink('Instagram')}
    >
      <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2">
        <Image 
            src="/image/instagram.webp" 
            alt="Instagram" 
            width={25} 
            height={25} 
        />
      </Link>
    </Button>
  );
};

export default InstagramButton;
