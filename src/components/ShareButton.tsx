
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButton({ title, text, url: propUrl, className, size = 'icon' }: ShareButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // navigator.share is only available in secure contexts (HTTPS) and on client-side
    if (typeof window !== 'undefined' && typeof navigator.share === 'function') {
      setIsSupported(true);
      setUrl(propUrl || window.location.href);
    }
  }, [propUrl]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el link de la tarjeta
    e.preventDefault();   // Evita que se active el link de la tarjeta
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
      // Ignora los errores comunes cuando el usuario cancela o el entorno no lo permite.
      // NotAllowedError: The user or the browser denied the request.
      // AbortError: The user canceled the share operation.
      if (error instanceof Error && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
        // No hacer nada, es una acción esperada.
      } else {
        console.error('Error sharing:', error);
        // Opcional: Mostrar un toast solo para errores inesperados.
        toast({
            variant: 'destructive',
            title: 'Error al compartir',
            description: 'No se pudo compartir el contenido en este momento.',
        });
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button variant="secondary" size={size} onClick={handleShare} aria-label="Compartir" className={cn("rounded-full", className)}>
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
