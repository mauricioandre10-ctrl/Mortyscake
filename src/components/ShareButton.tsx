
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // navigator.share is only available in secure contexts (HTTPS) and on client-side
    if (typeof window !== 'undefined' && typeof navigator.share === 'function') {
      setIsSupported(true);
      setUrl(window.location.href);
    }
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
        // We can ignore AbortError which happens if the user cancels the share dialog
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
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
    <Button variant="outline" size="icon" onClick={handleShare} aria-label="Compartir curso">
      <Share2 className="h-5 w-5" />
    </Button>
  );
}
