import { CakeSlice } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <CakeSlice className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">Morty's Cake</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Morty's Cake. All rights reserved.
          </div>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:text-primary">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
