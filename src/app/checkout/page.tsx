
import { CheckoutForm } from '@/components/CheckoutForm';

export default function CheckoutPage() {
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
