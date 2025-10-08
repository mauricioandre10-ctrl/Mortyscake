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
import { Label } from './ui/label';
import { CreditCard, Landmark } from 'lucide-react';

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

export function CheckoutForm() {
  const { cartDetails, totalPrice, cartCount, formattedTotalPrice } = useShoppingCart();

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí procesaríamos el pago
    console.log(values);
    alert('Funcionalidad de pago aún no implementada.');
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
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                    <RadioGroupItem value="card" />
                                    </FormControl>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5"/>
                                        <FormLabel className="font-normal">Tarjeta de Crédito / Débito</FormLabel>
                                    </div>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                    <RadioGroupItem value="paypal" />
                                    </FormControl>
                                     <div className="flex items-center gap-2">
                                        <Landmark className="w-5 h-5"/>
                                        <FormLabel className="font-normal">PayPal</FormLabel>
                                    </div>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <Card className="mt-4 p-4 bg-muted/50">
                            <p className="text-muted-foreground text-sm">
                                El proceso de pago real se integrará en el siguiente paso. Por ahora, esta es una demostración visual.
                            </p>
                        </Card>
                </div>


                <Button type="submit" className="w-full" size="lg">Realizar el pedido</Button>
                </form>
            </Form>
        </div>
        <div className="lg:mt-16">
            <Card>
                <CardHeader>
                    <CardTitle>Tu Pedido</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

    