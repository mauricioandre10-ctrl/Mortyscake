import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-6xl font-bold font-serif text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">Página No Encontrada</h2>
      <p className="mt-2 text-muted-foreground">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <Button asChild className="mt-6">
        <Link href="/">Volver a la Página de Inicio</Link>
      </Button>
    </div>
  );
}
