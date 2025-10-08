
'use client';

import { CheckoutForm } from '@/components/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';

export default function CheckoutPage() {
  const stripePromise = useMemo(() => {
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    if (!publicKey) {
      console.error('La clave pública de Stripe no está configurada.');
      return null;
    }
    return loadStripe(publicKey);
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Finalizar Compra</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ya casi está. Completa tus datos para realizar el pedido.
        </p>
      </header>
      
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div className="text-center text-destructive">
          Error: La pasarela de pago no se pudo cargar. Por favor, contacta con el soporte.
        </div>
      )}
    </div>
  );
}
