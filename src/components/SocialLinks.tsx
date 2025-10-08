
'use client';

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { trackSocialLink } from '@/lib/events';

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      <Link href="https://www.facebook.com/MortysCake/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80" onClick={() => trackSocialLink('Facebook')}>
        <Facebook className="h-7 w-7" />
      </Link>
      <Link href="https://www.instagram.com/mortyscake.ourense/" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80" onClick={() => trackSocialLink('Instagram')}>
        <Instagram className="h-7 w-7" />
      </Link>
    </div>
  );
}
