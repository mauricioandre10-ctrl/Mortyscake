
'use client';

import { CheckoutForm } from '@/components/CheckoutForm';
import { useShoppingCart } from 'use-shopping-cart';

export default function CheckoutPage() {
  const { cartCount } = useShoppingCart();

  if (cartCount === 0) {
    // Esto es opcional, pero es buena idea manejar el caso del carrito vacío
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
             <h1 className="font-headline text-4xl md:text-5xl">Finalizar Compra</h1>
             <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Tu carrito está vacío. Añade algunos productos antes de finalizar la compra.
            </p>
        </div>
    )
  }


  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Finalizar Compra</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ya casi está. Completa tus datos para realizar el pedido.
        </p>
      </header>
      
      <CheckoutForm />
    </div>
  );
}
