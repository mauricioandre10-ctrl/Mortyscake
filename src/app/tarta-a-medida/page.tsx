
'use client';

import { Button } from "@/components/ui/button"
import { Mail, MessageCircle } from "lucide-react"
import Link from 'next/link';

export default function TartaAMedidaPage() {
  const wordpressFormUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL}/solicitud-de-tarta-a-medida/` || '#';
  
  // Asumiendo que el número de teléfono y el mensaje predeterminado son los mismos que en el componente WhatsAppButton.
  const phoneNumber = "34616284463";
  const message = "¡Hola! Quisiera solicitar un presupuesto para una tarta a medida.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl">Diseña tu Tarta a Medida</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Cuéntanos tu idea y la haremos realidad. Rellena nuestro formulario para que podamos empezar a crear la tarta perfecta para tu celebración.
        </p>
      </header>

      <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg text-center">
         <h2 className="text-2xl font-card-title mb-4">Elige tu método de contacto</h2>
         <p className="text-muted-foreground mb-6">
            Para asegurar que recibimos todos los detalles correctamente, hemos movido nuestro formulario a nuestra página principal.
         </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="w-full">
              <Link href={wordpressFormUrl}>
                <Mail className="mr-2 h-4 w-4" />
                Rellenar Formulario
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
               <MessageCircle className="mr-2 h-4 w-4" />
              Contactar por WhatsApp
              </Link>
            </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
            Al hacer clic en "Rellenar Formulario", serás redirigido a nuestro sitio principal para completar tu solicitud de forma segura.
        </p>
      </div>
    </div>
  );
}
