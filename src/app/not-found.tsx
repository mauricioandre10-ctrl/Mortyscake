import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cake } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-16">
        <Cake className="w-16 h-16 text-primary/70 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Página no Encontrada</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
            Ups. Parece que la página que buscas se ha perdido en la cocina o nunca existió.
        </p>
        <Button asChild className="mt-8">
            <Link href="/">Volver al Inicio</Link>
        </Button>
    </div>
  );
}
