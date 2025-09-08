import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
)


const InstagramButton = () => {
  const instagramUsername = "pasteleria_morty"; 
  const instagramUrl = `https://ig.me/m/${instagramUsername}`;

  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 hover:opacity-90 transition-opacity text-white"
      aria-label="Chat en Instagram"
    >
      <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
        <InstagramIcon />
      </Link>
    </Button>
  );
};

export default InstagramButton;
