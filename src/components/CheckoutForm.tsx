
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useShoppingCart } from 'use-shopping-cart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreditCard, Landmark, Loader2 } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const formSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  address: z.string().min(5, { message: 'La dirección debe tener al menos 5 caracteres.' }),
  city: z.string().min(2, { message: 'La ciudad debe tener al menos 2 caracteres.' }),
  zip: z.string().min(5, { message: 'El código postal debe tener 5 caracteres.' }).max(5),
  phone: z.string().min(9, { message: 'El número de teléfono debe ser válido.' }),
  paymentMethod: z.enum(['card', 'paypal'], { required_error: 'Debes seleccionar un método de pago.' }),
});

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
};

export function CheckoutForm() {
  const { cartDetails, totalPrice, cartCount, formattedTotalPrice, clearCart } = useShoppingCart();
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zip: '',
      phone: '',
      paymentMethod: 'card',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements || !totalPrice) {
        setErrorMessage('La pasarela de pago no está lista.');
        setLoading(false);
        return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        setErrorMessage('El componente de tarjeta no se ha cargado.');
        setLoading(false);
        return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
     if (!apiUrl) {
        setErrorMessage('La URL de la API no está configurada.');
        setLoading(false);
        return;
    }

    try {
        // 1. Crear Payment Intent en el backend
        const intentResponse = await fetch(`${apiUrl}/wp-json/morty/v1/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: Math.round(totalPrice * 100), // En céntimos
                currency: 'eur',
            }),
        });

        const intentData = await intentResponse.json();

        if (!intentResponse.ok || !intentData.client_secret) {
            throw new Error(intentData.message || 'Error al crear la intención de pago.');
        }

        // 2. Confirmar el pago en el frontend con Stripe
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
            intentData.client_secret,
            {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${values.firstName} ${values.lastName}`,
                        email: values.email,
                        phone: values.phone,
                        address: {
                            line1: values.address,
                            city: values.city,
                            postal_code: values.zip,
                            country: 'ES',
                        }
                    },
                },
            }
        );

        if (stripeError) {
            throw new Error(stripeError.message);
        }

        if (paymentIntent?.status !== 'succeeded') {
            throw new Error('El pago no se ha completado.');
        }

        // 3. Crear el pedido en WooCommerce
        const orderResponse = await fetch(`${apiUrl}/wp-json/morty/v1/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                billingDetails: values,
                cartItems: Object.values(cartDetails ?? {}).map(item => ({ id: item.id, quantity: item.quantity })),
                paymentIntentId: paymentIntent.id
            })
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
            throw new Error(orderData.message || 'Error al crear el pedido en WooCommerce.');
        }

        toast({
            title: "¡Pedido completado!",
            description: `Tu pedido #${orderData.orderId} se ha realizado con éxito.`,
        });

        clearCart();
        router.push('/?success=true');
        
    } catch (error: any) {
        setErrorMessage(error.message || 'Ha ocurrido un error inesperado.');
        toast({
            variant: "destructive",
            title: "Error en el pago",
            description: error.message || 'No se pudo procesar el pago.',
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Detalles de Facturación</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tu nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Apellidos</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tus apellidos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="tu@correo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tu teléfono de contacto" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input placeholder="Calle, número, piso" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tu ciudad" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="zip"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Código Postal</FormLabel>
                                    <FormControl>
                                        <Input placeholder="32004" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Método de Pago</h2>
                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 data-[state=checked]:border-primary">
                                    <FormControl>
                                    <RadioGroupItem value="card" id="card" />
                                    </FormControl>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5"/>
                                        <FormLabel htmlFor="card" className="font-normal cursor-pointer">Tarjeta de Crédito / Débito</FormLabel>
                                    </div>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 data-[state=checked]:border-primary" onClick={() => form.setValue('paymentMethod', 'paypal')} >
                                    <FormControl>
                                    <RadioGroupItem value="paypal" id="paypal" disabled />
                                    </FormControl>
                                     <div className="flex items-center gap-2">
                                        <Landmark className="w-5 h-5 text-muted-foreground"/>
                                        <FormLabel htmlFor="paypal" className="font-normal text-muted-foreground cursor-not-allowed">PayPal (Próximamente)</FormLabel>
                                    </div>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <Card className="mt-4 p-4 bg-muted/50">
                            {form.getValues('paymentMethod') === 'card' && (
                                <div>
                                    <Label className="mb-2 block">Datos de la tarjeta</Label>
                                    <div className="p-3 border rounded-md bg-background">
                                        <CardElement options={cardElementOptions} />
                                    </div>
                                </div>
                            )}
                         </Card>
                         {errorMessage && <p className="text-sm font-medium text-destructive mt-4">{errorMessage}</p>}
                </div>


                <Button type="submit" className="w-full" size="lg" disabled={loading || cartCount === 0}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading ? 'Procesando...' : `Pagar ${formattedTotalPrice}`}
                </Button>
                </form>
            </Form>
        </div>
        <div className="lg:mt-16">
            <Card>
                <CardHeader>
                    <CardTitle>Tu Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                     {cartCount === 0 ? (
                        <p className="text-muted-foreground">Tu carrito está vacío.</p>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {Object.values(cartDetails ?? {}).map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">{item.formattedValue}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p>Subtotal</p>
                                    <p>{formattedTotalPrice}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Envío</p>
                                    <p>Gratis</p>
                                </div>
                            </div>
                            <Separator className="my-6" />
                            <div className="flex justify-between font-bold text-lg">
                                <p>Total</p>
                                <p>{formattedTotalPrice}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
