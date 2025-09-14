import Link from 'next/link';
import { Button } from '@/components/ui/button';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 50 50" role="img" aria-labelledby="instagramIconTitle">
        <title id="instagramIconTitle">Instagram</title>
        <path fill="currentColor" d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
    </svg>
)

const InstagramButton = () => {
  const instagramUsername = "pasteleria_morty"; 
  const instagramUrl = `https://ig.me/m/${instagramUsername}`;

  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 h-[52px] w-[52px] rounded-full shadow-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 hover:opacity-90 transition-opacity text-white"
      aria-label="Chat en Instagram"
    >
      <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
        <InstagramIcon />
      </Link>
    </Button>
  );
};

export default InstagramButton;
